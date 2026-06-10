from __future__ import annotations

from datetime import datetime
from typing import Optional, List
from uuid import UUID

from pydantic import BaseModel


class CollectionCreate(BaseModel):
    type: str
    title: str
    author: Optional[str] = None
    external_id: Optional[str] = None
    thumbnail_url: Optional[str] = None
    status: str = "want"
    total_chapters: Optional[int] = None
    read_chapters: int = 0
    rating: Optional[float] = None
    notes: Optional[str] = None
    tags: Optional[List[str]] = None


class CollectionUpdate(BaseModel):
    title: Optional[str] = None
    author: Optional[str] = None
    status: Optional[str] = None
    total_chapters: Optional[int] = None
    read_chapters: Optional[int] = None
    rating: Optional[float] = None
    notes: Optional[str] = None
    tags: Optional[List[str]] = None
    thumbnail_url: Optional[str] = None


class CollectionResponse(BaseModel):
    id: UUID
    type: str
    title: str
    author: Optional[str]
    external_id: Optional[str]
    thumbnail_url: Optional[str]
    status: str
    total_chapters: Optional[int]
    read_chapters: int
    rating: Optional[float]
    notes: Optional[str]
    tags: Optional[List[str]]
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}
