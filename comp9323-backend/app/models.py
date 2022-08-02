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
    role = db.Column(db.Integer, nullable=False)  # 0: authority，1: student，2: proposer，3: reviewer

    username = db.Column(db.String(120))
    email = db.Column(db.String(256), unique=True)
    password = db.Column(db.String(256))
    detail = db.Column(db.TEXT)  # user detail

    ctime = db.Column(db.DateTime, nullable=False)  # create time
    utime = db.Column(db.DateTime, nullable=False)  # update time
    active = db.Column(db.Integer, nullable=False, default=0)  # 0:not active,  1:active

    def save_to_db(self):
        db.session.add(self)
        db.session.commit()


class CourseModel(db.Model):
    __tablename__ = 'courses'

    cid = db.Column(db.String(256), primary_key=True)
    name = db.Column(db.String(120), unique=True)
    description = db.Column(db.TEXT, nullable=False)  # course description
    start_time = db.Column(db.DateTime, nullable=False)  # start time
    close_time = db.Column(db.DateTime, nullable=False)  # close time
    public = db.Column(db.Integer, nullable=False, default=0)  # 0: private, 1: public

    ctime = db.Column(db.DateTime, nullable=False)  # create time
    utime = db.Column(db.DateTime, nullable=False)  # update time
    active = db.Column(db.Integer, nullable=False, default=1)  # 0:delete, 1:not delete

    def save_to_db(self):
        db.session.add(self)
        db.session.commit()


class CourseUserModel(db.Model):

    __tablename__ = 'course_user'

    cu_id = db.Column(db.String(256), primary_key=True)
    cid = db.Column(db.String(256), nullable=False)  # courses.cid
    uid = db.Column(db.String(256), nullable=False)  # users.uid

    ctime = db.Column(db.DateTime, nullable=False)  # create time
    utime = db.Column(db.DateTime, nullable=False)  # update time
    active = db.Column(db.Integer, nullable=False, default=1)  # 0:delete, 1:not delete

    def save_to_db(self):
        db.session.add(self)
        db.session.commit()


# requirement
class RequirementModel(db.Model):

    __tablename__ = 'requirements'

    rid = db.Column(db.String(256), primary_key=True)
    cid = db.Column(db.String(256), nullable=False)  # courses.cid
    aid = db.Column(db.String(256), nullable=False)  # users.uid, only 'role = 0' authority
    content = db.Column(db.TEXT, nullable=False)  # requirement content

    ctime = db.Column(db.DateTime, nullable=False)  # create time
    utime = db.Column(db.DateTime, nullable=False)  # update time
    active = db.Column(db.Integer, nullable=False, default=1)  # 0:delete, 1:not delete

    def save_to_db(self):
        db.session.add(self)
        db.session.commit()


# Project
class ProjectModel(db.Model):

    __tablename__ = 'projects'

    proj_id = db.Column(db.String(256), unique=True, primary_key=True)
    cid = db.Column(db.String(256), nullable=False)  # courses.cid
    aid = db.Column(db.String(256), nullable=False)  # users.uid, role = 0 or 3 authority
    pid = db.Column(db.String(256), nullable=False)  # users.uid, role = 2 proposer
    rid = db.Column(db.String(256), nullable=False)  # requirement.rid
    proj_name = db.Column(db.String(120), unique=True, nullable=False)  # project name
    description = db.Column(db.TEXT, nullable=False)
    start_time = db.Column(db.DateTime, nullable=False)  # start time init = course start time, can be modified
    close_time = db.Column(db.DateTime, nullable=False)  # close time init = course close time, can be modified
    max_num = db.Column(db.Integer, nullable=False, default=10)  # course max_enroll students num
    cur_num = db.Column(db.Integer, nullable=False, default=0)  # current enroll students num

    ctime = db.Column(db.DateTime, nullable=False)  # create time
    utime = db.Column(db.DateTime, nullable=False)  # update time
    status = db.Column(db.Integer, nullable=False, default=0)
    # 0:pending, 1:approved 2: reject 3: published 4: in progress 5: done -1: delete

    def save_to_db(self):
        db.session.add(self)
        db.session.commit()


# File
class FileModel(db.Model):

    __tablename__ = 'files'

    fid = db.Column(db.String(256), primary_key=True)
    proj_id = db.Column(db.String(256), nullable=False)
    uid = db.Column(db.String(256), nullable=False)  # users.uid  where role = 0 , 1 , 2

    file_name = db.Column(db.String(120), nullable=False)
    file_url = db.Column(db.String(256), nullable=True)
    type = db.Column(db.String(120), nullable=True)  # work or description document

    ctime = db.Column(db.DateTime, nullable=False)  # create time
    utime = db.Column(db.DateTime, nullable=False)  # update time
    active = db.Column(db.Integer, nullable=False, default=1)  # 0:delete, 1:not delete

    def save_to_db(self):
        db.session.add(self)
        db.session.commit()


class SelectionModel(db.Model):

    __tablename__ = 'selections'

    sel_id = db.Column(db.String(256), primary_key=True)
    proj_id = db.Column(db.String(256), nullable=False)  # project.proj_id
    sid = db.Column(db.String(256), nullable=False)  # users.uid, role = '1' student
    a_feedback = db.Column(db.TEXT, nullable=True)  # authority's feedback
    p_feedback = db.Column(db.TEXT, nullable=True)  # proposer's feedback
    award = db.Column(db.Integer, nullable=False, default=0)  # default: 0  award: 1

    ctime = db.Column(db.DateTime, nullable=False)  # create time
    utime = db.Column(db.DateTime, nullable=False)  # update time
    active = db.Column(db.Integer, nullable=False, default=1)  # 0:delete, 1:not delete

    def save_to_db(self):
        db.session.add(self)
        db.session.commit()


class CommentModel(db.Model):

    __tablename__ = 'comments'

    cm_id = db.Column(db.String(256), primary_key=True)
    proj_id = db.Column(db.String(256), nullable=False)  # project.proj_id
    owner_uid = db.Column(db.String(256), nullable=False)  # comment poster
    target_uid = db.Column(db.String(256), nullable=True)  # reply who's uid, if poster: None
    parent_id = db.Column(db.String(256), nullable=True)  # comment replier, if poster: None
    root_id = db.Column(db.String(256), nullable=False)  # the level id, can be canceled if it is not necessary
    content = db.Column(db.TEXT, nullable=False)  # comment content

    ctime = db.Column(db.DateTime, nullable=False)  # create time
    utime = db.Column(db.DateTime, nullable=False)  # update time
    active = db.Column(db.Integer, nullable=False, default=1)  # 0:delete, 1:not delete

    def save_to_db(self):
        db.session.add(self)
        db.session.commit()


class MessageModel(db.Model):

    __tablename__ = 'messages'

    msg_id = db.Column(db.String(256), primary_key=True)
    uid = db.Column(db.String(256), nullable=False)  # user.uid
    content = db.Column(db.TEXT, nullable=False)  # content
    read = db.Column(db.Integer, nullable=False, default=0)  # 0:did not read, 1:read

    ctime = db.Column(db.DateTime, nullable=False)  # create time
    utime = db.Column(db.DateTime, nullable=False)  # update time
    active = db.Column(db.Integer, nullable=False, default=1)  # 0:delete, 1:not delete

    def save_to_db(self):
        db.session.add(self)
        db.session.commit()

