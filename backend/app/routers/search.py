from __future__ import annotations

import time
from collections import OrderedDict
from typing import Optional, List, Tuple

import httpx
from fastapi import APIRouter, HTTPException, Query, status

from app.core.config import MAL_CLIENT_ID, TMDB_API_KEY, GOOGLE_BOOKS_API_KEY
from app.schemas.search import SearchResult

router = APIRouter()

# In-memory cache: key=(q, type) -> (timestamp, results)
_cache: OrderedDict[Tuple[str, str], Tuple[float, List[SearchResult]]] = OrderedDict()
CACHE_TTL = 60  # seconds
CACHE_MAX = 100
EXTERNAL_TIMEOUT = 5.0  # seconds


def _get_cached(q: str, type_: str) -> Optional[List[SearchResult]]:
    key = (q.lower(), type_)
    entry = _cache.get(key)
    if entry and (time.time() - entry[0]) < CACHE_TTL:
        _cache.move_to_end(key)
        return entry[1]
    if entry:
        del _cache[key]
    return None


def _set_cached(q: str, type_: str, results: List[SearchResult]) -> None:
    key = (q.lower(), type_)
    _cache[key] = (time.time(), results)
    while len(_cache) > CACHE_MAX:
        _cache.popitem(last=False)


async def _search_manga(q: str) -> List[SearchResult]:
    if not MAL_CLIENT_ID:
        raise HTTPException(status_code=status.HTTP_502_BAD_GATEWAY, detail="External API unavailable, please try again later.")
    async with httpx.AsyncClient(timeout=EXTERNAL_TIMEOUT) as client:
        resp = await client.get(
            "https://api.myanimelist.net/v2/manga",
            params={"q": q, "limit": 10, "fields": "id,title,alternative_titles,main_picture,synopsis,authors{first_name,last_name},start_date,mean"},
            headers={"X-MAL-CLIENT-ID": MAL_CLIENT_ID},
        )
        resp.raise_for_status()
    data = resp.json().get("data", [])
    results = []
    for item in data:
        node = item.get("node", {})
        authors = node.get("authors", [])
        author_name = ", ".join(
            f"{a.get('node', {}).get('last_name', '')} {a.get('node', {}).get('first_name', '')}".strip()
            for a in authors
        ) or None
        alt = node.get("alternative_titles", {})
        year = None
        start = node.get("start_date", "")
        if start and len(start) >= 4:
            year = int(start[:4])
        pic = node.get("main_picture", {})
        results.append(SearchResult(
            external_id=str(node.get("id", "")),
            type="manga",
            title=node.get("title", ""),
            original_title=alt.get("ja"),
            thumbnail=pic.get("medium") or pic.get("large"),
            description=node.get("synopsis"),
            author=author_name,
            year=year,
            score=node.get("mean"),
        ))
    return results


async def _search_movie(q: str) -> List[SearchResult]:
    if not TMDB_API_KEY:
        raise HTTPException(status_code=status.HTTP_502_BAD_GATEWAY, detail="External API unavailable, please try again later.")
    async with httpx.AsyncClient(timeout=EXTERNAL_TIMEOUT) as client:
        resp = await client.get(
            "https://api.themoviedb.org/3/search/movie",
            params={"api_key": TMDB_API_KEY, "query": q, "language": "zh-TW"},
        )
        resp.raise_for_status()
    data = resp.json().get("results", [])
    results = []
    for item in data[:10]:
        year = None
        rd = item.get("release_date", "")
        if rd and len(rd) >= 4:
            year = int(rd[:4])
        poster = item.get("poster_path")
        results.append(SearchResult(
            external_id=str(item.get("id", "")),
            type="movie",
            title=item.get("title", ""),
            original_title=item.get("original_title"),
            thumbnail=f"https://image.tmdb.org/t/p/w200{poster}" if poster else None,
            description=item.get("overview"),
            author=None,
            year=year,
            score=item.get("vote_average"),
        ))
    return results


async def _search_book(q: str) -> List[SearchResult]:
    params = {"q": q, "maxResults": 10}
    if GOOGLE_BOOKS_API_KEY:
        params["key"] = GOOGLE_BOOKS_API_KEY
    async with httpx.AsyncClient(timeout=EXTERNAL_TIMEOUT) as client:
        resp = await client.get("https://www.googleapis.com/books/v1/volumes", params=params)
        resp.raise_for_status()
    data = resp.json().get("items", [])
    results = []
    for item in data:
        info = item.get("volumeInfo", {})
        year = None
        pub = info.get("publishedDate", "")
        if pub and len(pub) >= 4:
            year = int(pub[:4])
        images = info.get("imageLinks", {})
        results.append(SearchResult(
            external_id=item.get("id", ""),
            type="book",
            title=info.get("title", ""),
            original_title=None,
            thumbnail=images.get("thumbnail"),
            description=info.get("description"),
            author=", ".join(info.get("authors", [])) or None,
            year=year,
            score=info.get("averageRating"),
        ))
    return results


_SEARCHERS = {
    "manga": _search_manga,
    "movie": _search_movie,
    "book": _search_book,
}


@router.get("", response_model=List[SearchResult])
async def search_external(
    q: str = Query(..., min_length=1),
    type: str = Query(..., pattern="^(manga|movie|book)$"),
):
    cached = _get_cached(q, type)
    if cached is not None:
        return cached

    searcher = _SEARCHERS.get(type)
    if not searcher:
        raise HTTPException(status_code=400, detail=f"Unknown type: {type}")

    try:
        results = await searcher(q)
    except httpx.HTTPStatusError:
        raise HTTPException(status_code=status.HTTP_502_BAD_GATEWAY, detail="External API unavailable, please try again later.")
    except httpx.TimeoutException:
        raise HTTPException(status_code=status.HTTP_502_BAD_GATEWAY, detail="External API unavailable, please try again later.")

    _set_cached(q, type, results)
    return results
