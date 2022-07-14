from flask_migrate import Migrate
from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()
migrate = Migrate()


def init_db(app):
    db.init_app(app)
    migrate.init_app(app, db)
    return db


class UserModel(db.Model):

    __tablename__ = 'users'

    uid = db.Column(db.String(256), primary_key=True)
    id = db.Column(db.String(256), unique=True, nullable=False)
    role = db.Column(db.Integer, nullable=False)  # 0: CA，1: S，2: P，3: R

    username = db.Column(db.String(120))
    email = db.Column(db.String(256), unique=True)
    password = db.Column(db.String(256))
    detail = db.Column(db.TEXT)  # user detail

    ctime = db.Column(db.DateTime, nullable=False)  # create time
    utime = db.Column(db.DateTime, nullable=False)  # update time
    active = db.Column(db.Integer, nullable=False, default=1)  # 0:delete,  1:not delete

    def save_to_db(self):
        db.session.add(self)
        db.session.commit()


class CourseModel(db.Model):

    __tablename__ = 'courses'

    cid = db.Column(db.String(256), primary_key=True)
    name = db.Column(db.String(120), unique=True)
    description = db.Column(db.TEXT)  # course description
    start_time = db.Column(db.DateTime, nullable=False)     # start time
    close_time = db.Column(db.DateTime, nullable=False)     # close time
    public = db.Column(db.Integer, nullable=False, default=0)   # 0: private, 1: public
    ctime = db.Column(db.DateTime, nullable=False)  # create time
    utime = db.Column(db.DateTime, nullable=False)  # update time
    active = db.Column(db.Integer, nullable=False, default=1)  # 0:delete, 1:not delete

    def save_to_db(self):
        db.session.add(self)
        db.session.commit()


class CourseUser(db.Model):
    # key: cuid
    # foreign key: cid, uid(users.role = 0, 1)
    # ctime, utime, active

    __tablename__ = 'course_user'

    cuid = db.Column(db.String(256), primary_key=True)
    cid = db.Column(db.String(256), nullable=False)  # courses.cid
    uid = db.Column(db.String(256), nullable=False)  # users.uid

    ctime = db.Column(db.DateTime, nullable=False)  # create time
    utime = db.Column(db.DateTime, nullable=False)  # update time
    active = db.Column(db.Integer, nullable=False, default=1)  # 0:delete, 1:not delete

    def save_to_db(self):
        db.session.add(self)
        db.session.commit()

