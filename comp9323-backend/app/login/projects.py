from flask import jsonify, request, g
from sqlalchemy import exists

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
    course = CourseModel.query.filter(CourseModel.cid == cid).first()
    if not cid:
        return jsonify({'code': 400, 'msg': 'not related course'})

    aid = proj.aid
    authority = UserModel.query.filter(UserModel.uid == aid and UserModel.role == 0).first()
    if not authority:
        return jsonify({'code': 400, 'msg': 'no course authority'})

    pid = proj.pid
    proposer = UserModel.query.filter(UserModel.uid == pid and UserModel.role == 2).first()
    if not proposer:
        return jsonify({'code': 400, 'msg': 'no proposer'})

    result["proj_name"] = proj.proj_name
    result["description"] = proj.description
    result["start_time"] = proj.start_time
    result["close_time"] = proj.close_time
    result["status"] = proj.status
    result["cur_num"] = proj.cur_num
    result["max_num"] = proj.max_num
    result["course_name"] = course.name
    result["course_description"] = course.description
    result["course_name"] = proposer.username
    result["proposer_name"] = proposer.username
    ##lack file

    return jsonify({'code': 200, 'result': result})
