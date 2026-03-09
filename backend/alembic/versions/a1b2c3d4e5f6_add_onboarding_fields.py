"""Add new onboarding fields

Revision ID: a1b2c3d4e5f6
Revises: e47c22f08db2
Create Date: 2026-03-08

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'a1b2c3d4e5f6'
down_revision: Union[str, None] = 'e47c22f08db2'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.add_column('users', sa.Column('gender', sa.String(), nullable=True))
    op.add_column('users', sa.Column('focus', sa.String(), nullable=True))
    op.add_column('users', sa.Column('headline', sa.Text(), nullable=True))
    op.add_column('users', sa.Column('commitment_level', sa.String(), nullable=True))
    op.add_column('users', sa.Column('deal_breakers', sa.JSON(), nullable=True))
    op.add_column('users', sa.Column('perspective_answers', sa.JSON(), nullable=True))
    op.add_column('users', sa.Column('profile_photo_url', sa.String(), nullable=True))
    op.add_column('users', sa.Column('age_collab_only', sa.Boolean(), nullable=True))
    op.add_column('users', sa.Column('gender_collab_only', sa.Boolean(), nullable=True))
    op.add_column('users', sa.Column('country', sa.String(), nullable=True))


def downgrade() -> None:
    op.drop_column('users', 'country')
    op.drop_column('users', 'gender_collab_only')
    op.drop_column('users', 'age_collab_only')
    op.drop_column('users', 'profile_photo_url')
    op.drop_column('users', 'perspective_answers')
    op.drop_column('users', 'deal_breakers')
    op.drop_column('users', 'commitment_level')
    op.drop_column('users', 'headline')
    op.drop_column('users', 'focus')
    op.drop_column('users', 'gender')
