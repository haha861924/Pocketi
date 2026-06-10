from __future__ import annotations

from typing import Optional

from pydantic import BaseModel


class SearchResult(BaseModel):
    external_id: str
    type: str
    title: str
    original_title: Optional[str] = None
    thumbnail: Optional[str] = None
    description: Optional[str] = None
    author: Optional[str] = None
    year: Optional[int] = None
    score: Optional[float] = None
