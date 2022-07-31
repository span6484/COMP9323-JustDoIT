from flask import jsonify, request, g
from sqlalchemy import exists, or_

from app.login.utils import *
from app.models import *
from app.login.views import add_message


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
        temp_list = UserModel.query.join(CourseUserModel, CourseUserModel.uid == UserModel.uid).filter(
            CourseUserModel.cid == cid, or_(UserModel.role == 0, UserModel.role == 3), UserModel.active == 1).all()
        if temp_list:
            for ca in temp_list:
                ca_list.append(ca.username)
        result = {"course_name": course.name, "description": course.description, "start_time": course.start_time,
                  "close_time": course.close_time, "course_cas": ca_list}
        return jsonify({'code': 200, 'result': result})

    except Exception as e:
        return jsonify({'code': 400, 'msg': 'Get course detail failed.', 'error_msg': str(e)})


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


def get_requirements():
    data = request.get_json(force=True)
    print(data)
    uid = data["uid"]
    user = UserModel.query.filter(UserModel.uid == uid, UserModel.active == 1).first()
    if not user:
        return jsonify({'code': 400, 'msg': 'No such active user in database.'})

    cid = data["cid"]
    course = CourseModel.query.filter(CourseModel.cid == cid, CourseModel.active == 1).first()
    if not course:
        return jsonify({'code': 400, 'msg': 'No such course in database.'})

    try:
        # if user.role == 0 or user.role == 3:
        requirements_list = RequirementModel.query.filter(RequirementModel.cid == cid, RequirementModel.active == 1).all()
        if not requirements_list:
            return jsonify({'code': 200, 'msg': 'There is no requirement in this course.'})
        result_list = []
        for r in requirements_list:
            ca = UserModel.query.filter(UserModel.uid == r.aid, UserModel.active == 1).first()
            if uid == r.aid:
                edit = 1
            else:
                edit = 0
            r_dict = {"rid": r.rid, "content": r.content, "course_authority": ca.username, "edit": edit}
            result_list.append(r_dict)
        result = {"count": len(result_list), "result_list": result_list}
        return jsonify({'code': 200, 'result': result})

    except Exception as e:
        return jsonify({'code': 400, 'msg': 'Get requirements failed.', 'error_msg': str(e)})


def get_requirement_detail():
    data = request.get_json(force=True)
    print(data)
    rid = data["rid"]
    requirement = RequirementModel.query.filter(RequirementModel.rid == rid, RequirementModel.active == 1).first()
    if not requirement:
        return jsonify({'code': 400, 'msg': 'No such requirement in database.'})

    try:
        course = CourseModel.query.filter(CourseModel.cid == requirement.cid, CourseModel.active == 1).first()
        auth = UserModel.query.filter(UserModel.uid == requirement.aid, UserModel.active == 1).first()
        submit_ddl = course.start_time - datetime.timedelta(days=14)
        # print(course.start_time, submit_ddl)
        result = {"content": requirement.content, "submit_ddl": submit_ddl, "course_authority": auth.username}
        return jsonify({'code': 200, 'result': result})

    except Exception as e:
        return jsonify({'code': 400, 'msg': 'Get requirement detail failed.', 'error_msg': str(e)})


def add_proposal():
    data = request.get_json(force=True)
    # uid, rid, proj_name, description, files
    uid = data["uid"]
    user = UserModel.query.filter(UserModel.uid == uid, UserModel.role == 2, UserModel.active == 1).first()
    if not user:
        return jsonify({'code': 400, 'msg': 'No such proposer in database.'})

    rid = data["rid"]
    requirement = RequirementModel.query.filter(RequirementModel.rid == rid, RequirementModel.active == 1).first()
    if not requirement:
        return jsonify({'code': 400, 'msg': 'No such requirement in database.'})

    course = CourseModel.query.filter(CourseModel.cid == requirement.cid, CourseModel.active == 1).first()
    if not course:
        return jsonify({'code': 400, 'msg': 'Course id in requirement does not exist.'})

    proj_name = data["proj_name"]
    description = data["description"]
    files = data["files"]
    # add_files ?
    if not proj_name or not description or not files:
        return jsonify({'code': 400, 'msg': 'Proposal name and description cannot be empty.'})

    try:
        proj_num = ProjectModel.query.count()
        proj_id = generate_id("project", proj_num+1)
        print(proj_id)
        date_time = get_time()[0]
        proposal = ProjectModel(proj_id=proj_id, cid=requirement.cid, aid=requirement.aid, pid=uid, rid=rid,
                                proj_name=proj_name, description=description,
                                start_time=course.start_time, close_time=course.close_time,
                                ctime=date_time, utime=date_time, status=0)

        msg = add_message(requirement.aid, f"Proposer {user.username} add a proposal to your requirement in course {course.name}.")
        if msg:
            db.session.add(proposal)
            db.session.commit()
            return jsonify({'code': 200, 'msg': 'Add proposal and send message to authority successfully.'})
        else:
            return jsonify({'code': 400, 'msg': 'Add proposal and send message to authority failed.'})

    except Exception as e:
        return jsonify({'code': 400, 'msg': 'Add proposal failed.', 'error_msg': str(e)})


def delete_proposal():
    data = request.get_json(force=True)
    uid = data["uid"]
    user = UserModel.query.filter(UserModel.uid == uid, UserModel.role == 2, UserModel.active == 1).first()
    if not user:
        return jsonify({'code': 400, 'msg': 'No such proposer in database.'})

    proj_id = data["proj_id"]
    proposal = ProjectModel.query.filter(ProjectModel.proj_id == proj_id, ProjectModel.pid == uid, ProjectModel.status == 0).first()
    if not proposal:
        return jsonify({'code': 400, 'msg': 'No such proposal can be deleted by this user.'})

    course = CourseModel.query.filter(CourseModel.cid == proposal.cid, CourseModel.active == 1).first()
    if not course:
        return jsonify({'code': 400, 'msg': 'Course information in this proposal is invalid.'})

    try:
        date_time = get_time()[0]
        proposal.status = -1
        proposal.utime = date_time

        msg = add_message(proposal.aid,
                          f"Proposer {user.username} delete a proposal from your requirement in course {course.name}.")
        if msg:
            db.session.commit()
            return jsonify({'code': 200, 'msg': 'Delete proposal and send message to authority successfully.'})
        else:
            return jsonify({'code': 400, 'msg': 'Delete proposal and send message to authority failed.'})

    except Exception as e:
        return jsonify({'code': 400, 'msg': 'Delete proposal failed.', 'error_msg': str(e)})


def get_proposals():
    data = request.get_json(force=True)
    # proj_id, proj_name, proposer, status
    uid = data["uid"]
    user = UserModel.query.filter(UserModel.uid == uid, UserModel.active == 1).first()
    if not user:
        return jsonify({'code': 400, 'msg': 'No such user in database.'})

    rid = data["rid"]
    requirement = RequirementModel.query.filter(RequirementModel.rid == rid, RequirementModel.active == 1).first()
    if not requirement:
        return jsonify({'code': 400, 'msg': 'No such requirement in database.'})

    if user.role == 0 or user.role == 3:
        proposal_list = ProjectModel.query.filter(ProjectModel.rid == rid, ProjectModel.status == 0).all()
    elif user.role == 2:
        proposal_list = ProjectModel.query.filter(ProjectModel.rid == rid, ProjectModel.pid == uid, ProjectModel.status == 0).all()
    else:
        return jsonify({'code': 400, 'msg': 'User has no access to see proposals.'})
    if not proposal_list:
        return jsonify({'code': 200, 'msg': 'Empty proposal list.'})

    try:
        result_list = []
        for p in proposal_list:
            proposer = UserModel.query.filter(UserModel.uid == p.pid, UserModel.active == 1).first()
            p_dict = {"proj_id": p.proj_id, "proj_name": p.proj_name, "proposer": proposer.username, "status": p.status}
            result_list.append(p_dict)
        result = {"count": len(result_list), "result_list": result_list}
        return jsonify({'code': 200, 'result': result})

    except Exception as e:
        return jsonify({'code': 400, 'msg': 'Add proposal failed.', 'error_msg': str(e)})


def public_course_to_reviewers():
    data = request.get_json(force=True)
    uid = data["uid"]
    user = UserModel.query.filter(UserModel.uid == uid, or_(UserModel.role == 0, UserModel.role == 3), UserModel.active == 1).first()
    if not user:
        return jsonify({'code': 400, 'msg': 'No such authority in database.'})

    cid = data["cid"]
    course = CourseModel.query.join(CourseUserModel, CourseModel.cid == CourseUserModel.cid).filter(
        CourseModel.cid == cid, CourseModel.active == 1, CourseUserModel.uid == uid).first()
    if not course:
        return jsonify({'code': 400, 'msg': 'No such course can be accessed by this user in database.'})

    if course.public == 1:
        return jsonify({'code': 400, 'msg': 'Course has already been public.'})

    try:
        date_time = get_time()[0]
        course.public = 1
        course.utime = date_time
        db.session.commit()

        cas = UserModel.query.join(CourseUserModel, CourseUserModel.uid == UserModel.uid).filter(
            CourseUserModel.cid == cid, or_(UserModel.role == 0, UserModel.role == 3), UserModel.active == 1).all()
        reviewers = UserModel.query.filter(UserModel.role == 3, UserModel.active == 1).all()
        if cas:
            for ca in cas:
                add_message(ca.uid, f"Your course {course.name} has been public to reviewers.")
        if reviewers:
            for r in reviewers:
                add_message(r.uid, f"Course {course.name} has been public to reviewers, please check the proposals.")
        return jsonify({'code': 200, 'msg': 'Public course successfully.'})

    except Exception as e:
        return jsonify({'code': 400, 'msg': 'Public course failed.', 'error_msg': str(e)})

