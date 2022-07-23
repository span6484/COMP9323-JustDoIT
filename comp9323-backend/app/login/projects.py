from flask import jsonify, request, g
from sqlalchemy import exists
from datetime import datetime as dt
from app.login.utils import *
from app.models import *

# view project details
def view_project():
    data = request.get_json(force=True)
    result = {}
    proj_id = data["projid"]

    proj = ProjectModel.query.filter(ProjectModel.proj_id == proj_id).first()
    if not proj:
        return jsonify({'code': 400, 'msg': 'not related project'})

    cid = proj.cid
    course = CourseModel.query.filter(CourseModel.cid == cid and CourseModel.active == 1).first()
    if not cid:
        return jsonify({'code': 400, 'msg': 'not related course'})

    aid = proj.aid
    authority = UserModel.query.filter(UserModel.uid == aid and UserModel.role == 0).first()
    if not authority:
        return jsonify({'code': 400, 'msg': 'no course authority'})

    pid = proj.pid      # proposer_id
    proposer = UserModel.query.filter(UserModel.uid == pid and UserModel.role == 2).first()
    if not proposer:
        return jsonify({'code': 400, 'msg': 'no proposer'})

    files = FileModel.query.filter(FileModel.proj_id == proj_id, FileModel.active == 1).all()
    result["proj_name"] = proj.proj_name
    result["description"] = proj.description
    result["start_time"] = proj.start_time
    result["close_time"] = proj.close_time
    result["status"] = proj.status
    result["cur_num"] = proj.cur_num
    result["max_num"] = proj.max_num
    result["course_name"] = course.name
    result["course_description"] = course.description
    result["proposer_id"] = proposer.uid
    result["proposer_name"] = proposer.username
    result["proposer_email"] = proposer.email
    result["authority_name"] = authority.username
    result["authority_email"] = authority.email
    result["authority_id"] = authority.uid
    ##list file
    if files:
        file_lst = list()
        file = dict()
        for f in files:
            file["file_name"] = f.file_name
            file["file_url"] = f.file_url
            file["type"] = f.type
            file["utime"] = f.utime
            file_lst.append(file)
        result["files"] = file_lst
    else :
        result["files"] = None

    return jsonify({'code': 200, 'result': result})

# change project status: pending, approved/not, add to join"
def change_project_status():
    data = request.get_json(force=True)
    proj_id = data["proj_id"]
    uid = data["uid"]
    status = data["status"] #pending: 0   approved: 1   not approved:2
    proj = ProjectModel.query.filter(ProjectModel.proj_id == proj_id).first()
    if not proj:
        return jsonify({'code': 400, 'msg': 'not related project'})
    user = UserModel.query.filter(UserModel.uid == uid and UserModel.active == 1).first()
    if not user:
        return jsonify({'code': 400, 'msg': 'not related user'})

    course_id = proj.cid
    course = CourseModel.query.filter(CourseModel.cid == course_id and CourseModel.active == 1).first()
    if not course:
        return jsonify({'code': 400, 'msg': 'not related course'})

    role = user.role
    #reviewer
    if role == 3:
        if course.public == 0:
            return jsonify({'code': 400, 'msg': 'This reviewer has not access to edit because the course is private'})

    if role == 0:
        if proj.aid != uid:
            return jsonify({'code': 400, 'msg': 'This CA has not access to modify'})
    if role == 0 or role == 3:
        if status < 0 or status > 3:
            return jsonify({'code': 400, 'msg': 'You only could modify status from 0 to 3, 0 : pending, 1: approved, 2: reject 3: join'})
        else:
            proj.status = status
            db.session.commit()
            return jsonify({'code': 200, 'msg': 'modify status successfully'})
    else:
        return jsonify({'code': 400, 'msg': 'You have no access to modify'})

# change_project status according to start_time
def change_project_status2():
    data = request.get_json(force=True)
    proj_id = data["proj_id"]
    proj = ProjectModel.query.filter(ProjectModel.proj_id == proj_id).first()
    if not proj:
        return jsonify({'code': 400, 'msg': 'not related project'})
    course_id = proj.cid
    course = CourseModel.query.filter(CourseModel.cid == course_id and CourseModel.active == 1).first()
    if not course:
        return jsonify({'code': 400, 'msg': 'not related course'})

    if proj.status < 3:
        return jsonify({'code': 400, 'msg': 'this project is still not open to join'})
    else:
        now = dt.now()
        current_time = now.strftime("%Y-%m-%d %H:%M:%S")
        start_time = proj.start_time
        close_time = proj.close_time
        print("current time: ", current_time)
        print("start time: ", start_time)
        print("close time: ",close_time)
        if now > close_time:
            proj.status = 5     # close
            db.session.commit()
            return jsonify({'code': 200, 'msg': 'modify status to 5 (Close) successfully'})
        if now > start_time:
            proj.status = 4     # in progress
            db.session.commit()
            return jsonify({'code': 200, 'msg': 'modify status to 4 (In Progress) successfully'})
        else:
            return jsonify({'code': 200, 'msg': 'Wait the start time'})
