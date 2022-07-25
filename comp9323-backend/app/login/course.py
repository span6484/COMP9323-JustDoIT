from flask import jsonify, request, g
from sqlalchemy import exists

from app.login.utils import *
from app.models import *


def get_courses():
    data = request.get_json(force=True)
    uid = data[0]
    user = UserModel.query.filter(UserModel.uid == uid, UserModel.active == 1).first()
    if not user:
        return jsonify({'code': 400, 'msg': 'No such user in database.'})

    try:
        # proposer 不用查这个表
        course_list = CourseUserModel.query.filter(CourseUserModel.uid == uid, CourseUserModel.active == 1).all()
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

        result = {"count": len(course_list)}
        result_list = []
        for c in course_list:
            c_dict = {"cid": c.cid, "name": c.name, "start_time": c.start_time, "close_time": c.closetime}
            result_list.append(c_dict)
        result["c_list"] = result_list
        return jsonify({'code': 200, 'result': result})

    except Exception as e:
        return jsonify({'code': 400, 'msg': 'Get course failed.', 'error_msg': str(e)})
