from __future__ import annotations

from datetime import datetime, timezone
from typing import Optional, List

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.auth import get_current_user
from app.db import get_db
from app.models.collection import Collection
from app.models.user import User
from app.schemas.collection import CollectionCreate, CollectionUpdate, CollectionResponse

router = APIRouter()


@router.get("", response_model=List[CollectionResponse])
async def list_collections(
    type: Optional[str] = Query(None),
    status_filter: Optional[str] = Query(None, alias="status"),
    q: Optional[str] = Query(None),
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    stmt = select(Collection).where(Collection.user_id == user.id)

    if type:
        stmt = stmt.where(Collection.type == type)
    if status_filter:
        stmt = stmt.where(Collection.status == status_filter)
    if q:
        pattern = f"%{q}%"
        stmt = stmt.where(Collection.title.ilike(pattern) | Collection.author.ilike(pattern))

    stmt = stmt.order_by(Collection.updated_at.desc())
    result = await db.execute(stmt)
    return result.scalars().all()


@router.post("", response_model=CollectionResponse, status_code=status.HTTP_201_CREATED)
async def create_collection(
    body: CollectionCreate,
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    item = Collection(user_id=user.id, **body.model_dump())
    db.add(item)
    await db.commit()
    await db.refresh(item)
    return item


@router.patch("/{item_id}", response_model=CollectionResponse)
async def update_collection(
    item_id: str,
    body: CollectionUpdate,
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(
        select(Collection).where(Collection.id == item_id, Collection.user_id == user.id)
    )
    item = result.scalar_one_or_none()
    if not item:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Collection not found")

    update_data = body.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(item, key, value)

    # Auto-complete: if read_chapters >= total_chapters, set status to completed
    if item.total_chapters and item.total_chapters > 0 and item.read_chapters >= item.total_chapters:
        item.status = "completed"

    item.updated_at = datetime.now(timezone.utc)
    await db.commit()
    await db.refresh(item)
    return item


@router.delete("/{item_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_collection(
    item_id: str,
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(
        select(Collection).where(Collection.id == item_id, Collection.user_id == user.id)
    )
    item = result.scalar_one_or_none()
    if not item:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Collection not found")

    await db.delete(item)
    await db.commit()
