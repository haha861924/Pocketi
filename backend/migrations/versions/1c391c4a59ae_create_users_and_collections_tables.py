"""create users and collections tables

Revision ID: 1c391c4a59ae
Revises:
Create Date: 2026-06-05 20:43:53.886515

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


revision: str = '1c391c4a59ae'
down_revision: Union[str, Sequence[str], None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.create_table(
        "users",
        sa.Column("id", sa.String(36), primary_key=True),
        sa.Column("email", sa.String, unique=True, nullable=False, index=True),
        sa.Column("hashed_password", sa.String, nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.text("now()")),
    )

    op.create_table(
        "collections",
        sa.Column("id", sa.String(36), primary_key=True),
        sa.Column("user_id", sa.String(36), sa.ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True),
        sa.Column("type", sa.String, nullable=False),
        sa.Column("external_id", sa.String, nullable=True),
        sa.Column("title", sa.String, nullable=False),
        sa.Column("author", sa.String, nullable=True),
        sa.Column("thumbnail_url", sa.String, nullable=True),
        sa.Column("status", sa.String, nullable=False, server_default="want"),
        sa.Column("total_chapters", sa.Integer, nullable=True),
        sa.Column("read_chapters", sa.Integer, server_default="0"),
        sa.Column("rating", sa.Numeric(3, 1), nullable=True),
        sa.Column("notes", sa.Text, nullable=True),
        sa.Column("tags", sa.JSON, nullable=True),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.text("now()")),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.text("now()")),
    )


def downgrade() -> None:
    op.drop_table("collections")
    op.drop_table("users")
