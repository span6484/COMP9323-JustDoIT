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
    detail = db.Column(db.TEXT, nullable=False)  # user detail

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


# requirement
class RequirementModel(db.Model):
    # key: rid
    # foreign key: cid, aid（user.role=0: CA）
    # content, ctime, utime, active

    __tablename__ = 'requirement'

    rid = db.Column(db.String(256), primary_key=True)
    cid = db.Column(db.String(256), nullable=False)  # courses.cid
    aid = db.Column(db.String(256), nullable=False)  # users.uid     only  'role = 0' authority

    content = db.Column(db.TEXT, nullable=False)  # requirement content
    ctime = db.Column(db.DateTime, nullable=False)  # create time
    utime = db.Column(db.DateTime, nullable=False)  # update time
    active = db.Column(db.Integer, nullable=False, default=1)  # 0:delete, 1:not delete

    def save_to_db(self):
        db.session.add(self)
        db.session.commit()


# Project
class ProjectModel(db.Model):
    # key: projid
    # foreign key: cid, aid, pid    （user.role = 0, 2)
    # name, description, start_time, close_time, max_num, cur_num， status, ctime, utime, status

    __tablename__ = 'project'

    projid = db.Column(db.String(256), unique=True, primary_key=True)
    cid = db.Column(db.String(256), nullable=False)  # courses.cid
    aid = db.Column(db.String(256), nullable=False)  # users.uid    role = 0 authority
    pid = db.Column(db.String(256), nullable=False)  # users.uid    role = 2 proposer

    proj_name = db.Column(db.String(120), unique=True, nullable=False)  # project name
    description = db.Column(db.TEXT, nullable=False)
    start_time = db.Column(db.DateTime, nullable=False)  # start time
    close_time = db.Column(db.DateTime, nullable=False)  # update time
    ctime = db.Column(db.DateTime, nullable=False)  # create time
    utime = db.Column(db.DateTime, nullable=False)  # update time

    max_num = db.Column(db.Integer, nullable=False, default=10)  # course max_enroll students num
    cur_num = db.Column(db.Integer, nullable=False, default=0)  # current enroll students numm

    status = db.Column(db.Integer, nullable=False, default=0)  # 0:pending, 1:approved 2: reject 3: published 4: project in progress 5: done

    def save_to_db(self):
        db.session.add(self)
        db.session.commit()


# File
class FileModel(db.Model):
    # key: fid
    # foreign
    # key: projid, uid(user.role = 0, 1, 2)
    # file_name, file_url, type, ctime, utime, active

    __tablename__ = 'file'

    fid = db.Column(db.String(256), primary_key=True)
    file_name = db.Column(db.String(120), nullable=False)  # project name
    file_url = db.Column(db.String(256), nullable=True)
    type = db.Column(db.String(120), nullable=True)  # jpg, png, text..
    projid = db.Column(db.String(256), nullable=False)
    uid = db.Column(db.String(256), nullable=False)  # users.uid  where role = 0 , 1 , 2
    ctime = db.Column(db.DateTime, nullable=False)  # create time
    utime = db.Column(db.DateTime, nullable=False)  # update time
    active = db.Column(db.Integer, nullable=False, default=1)  # 0:delete, 1:not delete

    def save_to_db(self):
        db.session.add(self)
        db.session.commit()


class ProjectStudentModel(db.Model):
    # key: psid
    # foreign
    # key: projid, sid（user.role = 1）
    # a_feedback, p_feedback, award(default=0, award=1), ctime, utime, active

    __tablename__ = 'project_student'

    psid = db.Column(db.String(256), primary_key=True)
    projid = db.Column(db.String(256), nullable=False)  # project.projid
    sid = db.Column(db.String(256), nullable=False)  # users.uid  where role = '1' student
    a_feedback = db.Column(db.TEXT, nullable=False)         # authority's feedback
    p_feedback = db.Column(db.TEXT, nullable=False)         # proposer's feedback
    award = db.Column(db.Integer, nullable=False, default=0)  # default: 0  award: 1

    ctime = db.Column(db.DateTime, nullable=False)  # create time
    utime = db.Column(db.DateTime, nullable=False)  # update time
    active = db.Column(db.Integer, nullable=False, default=1)  # 0:delete, 1:not delete

    def save_to_db(self):
        db.session.add(self)
        db.session.commit()


class CommentModel(db.Model):
    # key: cmid
    # foreign key: projid
    #owner_uid, target_uid, parent_id, root_id, content, ctime, utime, active

    __tablename__ = 'comment'

    cmid = db.Column(db.String(256), primary_key=True)
    projid = db.Column(db.String(256), nullable=False)  # project.projid
    owner_uid = db.Column(db.String(256), nullable=False)  # comment poster
    target_uid = db.Column(db.String(256), nullable=False)  # reply who's uid, if poster: None
    parent_id = db.Column(db.String(256), nullable=False)  # comment replier
    root_id = db.Column(db.String(256), nullable=False)  # the level id
    content = db.Column(db.TEXT, nullable=False)         # comment content

    ctime = db.Column(db.DateTime, nullable=False)  # create time
    utime = db.Column(db.DateTime, nullable=False)  # update time
    active = db.Column(db.Integer, nullable=False, default=1)  # 0:delete, 1:not delete

    def save_to_db(self):
        db.session.add(self)
        db.session.commit()


class MessageModel(db.Model):
    # key: mid
    # foreign : uid
    #content, read, ctime, utime, active

    __tablename__ = 'message'

    mid = db.Column(db.String(256), primary_key=True)
    uid = db.Column(db.String(256), nullable=False)  # user.uid
    content = db.Column(db.TEXT, nullable=False)         #  content
    read = db.Column(db.Integer, nullable=False, default=0)  # 0:did not read, 1:read
    ctime = db.Column(db.DateTime, nullable=False)  # create time
    utime = db.Column(db.DateTime, nullable=False)  # update time
    active = db.Column(db.Integer, nullable=False, default=1)  # 0:delete, 1:not delete

    def save_to_db(self):
        db.session.add(self)
        db.session.commit()