"""empty message

Revision ID: 3972bd660839
Revises: 4b0e5ada2664
Create Date: 2022-07-15 02:04:24.113912

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import mysql

# revision identifiers, used by Alembic.
revision = '3972bd660839'
down_revision = '4b0e5ada2664'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('course-user',
    sa.Column('cuid', sa.String(length=256), nullable=False),
    sa.Column('cid', sa.String(length=256), nullable=False),
    sa.Column('uid', sa.String(length=256), nullable=False),
    sa.Column('ctime', sa.DateTime(), nullable=False),
    sa.Column('utime', sa.DateTime(), nullable=False),
    sa.Column('active', sa.Integer(), nullable=False),
    sa.PrimaryKeyConstraint('cuid')
    )
    op.create_table('courses',
    sa.Column('cid', sa.String(length=256), nullable=False),
    sa.Column('name', sa.String(length=120), nullable=True),
    sa.Column('description', sa.TEXT(), nullable=True),
    sa.Column('start_time', sa.DateTime(), nullable=False),
    sa.Column('close_time', sa.DateTime(), nullable=False),
    sa.Column('public', sa.Integer(), nullable=False),
    sa.Column('ctime', sa.DateTime(), nullable=False),
    sa.Column('utime', sa.DateTime(), nullable=False),
    sa.Column('active', sa.Integer(), nullable=False),
    sa.PrimaryKeyConstraint('cid'),
    sa.UniqueConstraint('name')
    )
    op.add_column('users', sa.Column('uid', sa.String(length=256), nullable=False))
    op.add_column('users', sa.Column('role', sa.Integer(), nullable=False))
    op.add_column('users', sa.Column('email', sa.String(length=256), nullable=True))
    op.add_column('users', sa.Column('detail', sa.TEXT(), nullable=True))
    op.add_column('users', sa.Column('ctime', sa.DateTime(), nullable=False))
    op.add_column('users', sa.Column('utime', sa.DateTime(), nullable=False))
    op.add_column('users', sa.Column('active', sa.Integer(), nullable=False))
    op.alter_column('users', 'username',
               existing_type=mysql.VARCHAR(length=120),
               nullable=True)
    op.alter_column('users', 'password',
               existing_type=mysql.VARCHAR(length=256),
               nullable=True)
    op.create_unique_constraint(None, 'users', ['email'])
    op.create_unique_constraint(None, 'users', ['id'])
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_constraint(None, 'users', type_='unique')
    op.drop_constraint(None, 'users', type_='unique')
    op.alter_column('users', 'password',
               existing_type=mysql.VARCHAR(length=256),
               nullable=False)
    op.alter_column('users', 'username',
               existing_type=mysql.VARCHAR(length=120),
               nullable=False)
    op.drop_column('users', 'active')
    op.drop_column('users', 'utime')
    op.drop_column('users', 'ctime')
    op.drop_column('users', 'detail')
    op.drop_column('users', 'email')
    op.drop_column('users', 'role')
    op.drop_column('users', 'uid')
    op.drop_table('courses')
    op.drop_table('course-user')
    # ### end Alembic commands ###
