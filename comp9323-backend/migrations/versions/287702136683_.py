"""empty message

Revision ID: 287702136683
Revises: 3972bd660839
Create Date: 2022-07-15 04:19:38.816844

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import mysql

# revision identifiers, used by Alembic.
revision = '287702136683'
down_revision = '3972bd660839'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('course_user',
    sa.Column('cuid', sa.String(length=256), nullable=False),
    sa.Column('cid', sa.String(length=256), nullable=False),
    sa.Column('uid', sa.String(length=256), nullable=False),
    sa.Column('ctime', sa.DateTime(), nullable=False),
    sa.Column('utime', sa.DateTime(), nullable=False),
    sa.Column('active', sa.Integer(), nullable=False),
    sa.PrimaryKeyConstraint('cuid')
    )
    op.drop_table('course-user')
    op.drop_index('username', table_name='users')
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_index('username', 'users', ['username'], unique=False)
    op.create_table('course-user',
    sa.Column('cuid', mysql.VARCHAR(length=256), nullable=False),
    sa.Column('cid', mysql.VARCHAR(length=256), nullable=False),
    sa.Column('uid', mysql.VARCHAR(length=256), nullable=False),
    sa.Column('ctime', mysql.DATETIME(), nullable=False),
    sa.Column('utime', mysql.DATETIME(), nullable=False),
    sa.Column('active', mysql.INTEGER(), autoincrement=False, nullable=False),
    sa.PrimaryKeyConstraint('cuid'),
    mysql_collate='utf8mb4_0900_ai_ci',
    mysql_default_charset='utf8mb4',
    mysql_engine='InnoDB'
    )
    op.drop_table('course_user')
    # ### end Alembic commands ###
