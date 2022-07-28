from flask import jsonify, request, g
from sqlalchemy import exists

from app.login.utils import *
from app.models import *


def get_courses():
    data = request.get_json(force=True)
    print(data)
    uid = data["uid"]
    user = UserModel.query.filter(UserModel.uid == uid, UserModel.active == 1).first()
    if not user:
        return jsonify({'code': 400, 'msg': 'No such user in database.'})

    try:
        # proposer 不用查这个表
        cu_list = CourseUserModel.query.filter(CourseUserModel.uid == uid, CourseUserModel.active == 1).all()
        course_list = []
        for c in cu_list:
            course_list.append(CourseModel.query.filter(CourseModel.cid == c.cid, CourseUserModel.active == 1).first())
        if user.role == 0:
            print("CA")
        elif user.role == 1:
            print("Student")
        elif user.role == 2:
            print("Proposer")
            course_list = CourseModel.query.filter(CourseModel.active == 1).all()
        elif user.role == 3:
            print("Reviewer")
            review_list = CourseModel.query.filter(CourseModel.public == 1, CourseModel.active == 1).all()
            course_list.extend(review_list)
        print(course_list)
        result_list = []
        for c in course_list:
            c_dict = {"cid": c.cid, "name": c.name, "start_time": c.start_time, "close_time": c.close_time}
            result_list.append(c_dict)
        result = {"count": len(result_list), "c_list": result_list}
        return jsonify({'code': 200, 'result': result})

    except Exception as e:
        return jsonify({'code': 400, 'msg': 'Get course failed.', 'error_msg': str(e)})


def get_course_detail():
    data = request.get_json(force=True)
    print(data)
    cid = data["cid"]
    course = CourseModel.query.filter(CourseModel.cid == cid, CourseModel.active == 1).first()
    if not course:
        return jsonify({'code': 400, 'msg': 'No such course in database.'})

    try:
        ca_list = []
        cu_list = CourseUserModel.query.filter(CourseUserModel.cid == cid, CourseUserModel.active == 1).all()
        for cu in cu_list:
            print(cu.uid)
            user = UserModel.query.filter(UserModel.uid == cu.uid, UserModel.active == 1).first()
            if user and (user.role == 0 or user.role == 3):
                print(user.username)
                ca_list.append(user.username)
        result = {"course_name": course.name, "description": course.description, "start_time": course.start_time,
                  "close_time": course.close_time, "course_cas": ca_list}
        return jsonify({'code': 200, 'result': result})

    except Exception as e:
        return jsonify({'code': 400, 'msg': 'Add requirement failed.', 'error_msg': str(e)})


def add_requirement():
    data = request.get_json(force=True)
    print(data)
    content = data["content"]
    if not content:
        return jsonify({'code': 400, 'msg': 'Empty content.'})

    uid = data["uid"]
    user = UserModel.query.filter(UserModel.uid == uid, UserModel.active == 1).first()
    if not user:
        return jsonify({'code': 400, 'msg': 'No such active user in database.'})

    if user.role != 0 and user.role != 3:
        return jsonify({'code': 400, 'msg': 'User has no access to add requirement.'})

    cid = data["cid"]
    course = CourseModel.query.filter(CourseModel.cid == cid, CourseModel.active == 1).first()
    if not course:
        return jsonify({'code': 400, 'msg': 'No such course in database.'})

    cu = CourseUserModel.query.filter(CourseUserModel.uid == uid, CourseUserModel.cid == cid, CourseUserModel.active == 1).first()
    if not cu:
        return jsonify({'code': 400, 'msg': 'User is not in this course.'})

    try:
        r_num = RequirementModel.query.count()
        rid = generate_id("requirement", r_num+1)
        date_time = get_time()[0]
        requirement = RequirementModel(rid=rid, cid=cid, aid=uid, content=content, ctime=date_time, utime=date_time, active=1)
        db.session.add(requirement)
        db.session.commit()
        return jsonify({'code': 200, 'msg': 'Add requirement successfully.'})

    except Exception as e:
        return jsonify({'code': 400, 'msg': 'Add requirement failed.', 'error_msg': str(e)})


# def get_requirements():
#


