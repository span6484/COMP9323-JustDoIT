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
        if user.role == 0 or user.role == 1:
            course_list = CourseModel.query.join(CourseUserModel, CourseModel.cid == CourseUserModel.cid).filter(
                        CourseUserModel.uid == uid, CourseModel.active == 1).all()
        elif user.role == 2:
            course_list = CourseModel.query.filter(CourseModel.active == 1).all()
        elif user.role == 3:
            course_list = CourseModel.query.join(CourseUserModel, CourseModel.cid == CourseUserModel.cid).filter(
                        or_(CourseModel.public == 1, CourseUserModel.uid == uid), CourseModel.active == 1).all()
        else:
            return jsonify({'code': 400, 'msg': 'Invalid role.'})

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
    uid = data["uid"]
    user = UserModel.query.filter(UserModel.uid == uid, UserModel.active == 1).first()
    if not user:
        return jsonify({'code': 400, 'msg': 'No such user in database.'})
    course = CourseModel.query.filter(CourseModel.cid == cid, CourseModel.active == 1).first()
    if not course:
        return jsonify({'code': 400, 'msg': 'No such course in database.'})

    ca_list = []
    r_list = []
    temp_list = UserModel.query.join(CourseUserModel, CourseUserModel.uid == UserModel.uid).filter(
        CourseUserModel.cid == cid, or_(UserModel.role == 0, UserModel.role == 3), UserModel.active == 1).all()

    if temp_list:
        for ca in temp_list:
            ca_dict = {"ca_name": ca.username, "email": ca.email}
            ca_list.append(ca_dict)
    if user.role == 0 or user.role == 3:
        reviewers = UserModel.query.filter(UserModel.role == 3, UserModel.active == 1).all()
        if reviewers:
            for r in reviewers:
                r_dict = {"re_name": r.username, "re_email": r.email}
                r_list.append(r_dict)

    result = {"course_name": course.name, "description": course.description, "start_time": course.start_time,
              "close_time": course.close_time, "course_cas": ca_list,"is_public": course.public,"course_res": r_list}
    return jsonify({'code': 200, 'result': result})


def add_requirement():
    data = request.get_json(force=True)
    uid, cid, content = data["uid"], data["cid"], data["content"]

    if not content:
        return jsonify({'code': 400, 'msg': 'Empty content.'})

    user = UserModel.query.filter(UserModel.uid == uid, or_(UserModel.role == 0, UserModel.role == 3), UserModel.active == 1).first()
    if not user:
        return jsonify({'code': 400, 'msg': 'No such active user has access to add requirements.'})

    course = CourseModel.query.filter(CourseModel.cid == cid, CourseModel.active == 1).first()
    if not course:
        return jsonify({'code': 400, 'msg': 'No such course in database.'})

    cu = CourseUserModel.query.filter(CourseUserModel.uid == uid, CourseUserModel.cid == cid, CourseUserModel.active == 1).first()
    if not cu:
        return jsonify({'code': 400, 'msg': 'User is not in this course.'})

    # submit_ddl = course.start_time - datetime.timedelta(days=14)
    # if get_time()[0] > submit_ddl:
    #     return jsonify({'code': 400, 'msg': 'Exceeded the deadline.'})

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
    uid, cid = data["uid"], data["cid"]

    user = UserModel.query.filter(UserModel.uid == uid, UserModel.active == 1).first()
    if not user:
        return jsonify({'code': 400, 'msg': 'No such active user in database.'})

    course = CourseModel.query.filter(CourseModel.cid == cid, CourseModel.active == 1).first()
    if not course:
        return jsonify({'code': 400, 'msg': 'No such course in database.'})
    if user.role == 2:
        cu = CourseUserModel.query.filter(CourseUserModel.cid == cid,
                                          CourseUserModel.active == 1).first()
    else:

        cu = CourseUserModel.query.filter(CourseUserModel.cid == cid, CourseUserModel.uid == uid, CourseUserModel.active == 1).first()
    if not cu and not (user.role == 3 and course.public == 1):
        return jsonify({'code': 400, 'msg': 'User has no access to check requirements in this course.'})

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
            r_dict = {"rid": r.rid, "content": r.content, "course_authority": ca.username, "email": ca.email, "edit": edit}
            result_list.append(r_dict)
        result = {"count": len(result_list), "result_list": result_list}
        return jsonify({'code': 200, 'result': result})

    except Exception as e:
        return jsonify({'code': 400, 'msg': 'Get requirements failed.', 'error_msg': str(e)})


def get_requirement_detail():
    data = request.get_json(force=True)
    uid, rid = data["uid"], data["rid"]

    user = UserModel.query.filter(UserModel.uid == uid, UserModel.active == 1).first()
    if not user:
        return jsonify({'code': 400, 'msg': 'No such active user in database.'})

    requirement = RequirementModel.query.filter(RequirementModel.rid == rid, RequirementModel.active == 1).first()
    if not requirement:
        return jsonify({'code': 400, 'msg': 'No such requirement in database.'})

    is_operation = 0
    if requirement.aid == uid:
        is_operation = 1

    try:
        course = CourseModel.query.filter(CourseModel.cid == requirement.cid, CourseModel.active == 1).first()
        auth = UserModel.query.filter(UserModel.uid == requirement.aid, UserModel.active == 1).first()
        submit_ddl = course.start_time - datetime.timedelta(days=14)
        result = {"content": requirement.content, "submit_ddl": submit_ddl,
                  "course_authority": auth.username, "email": auth.email, "is_operation": is_operation}
        return jsonify({'code': 200, 'result': result})

    except Exception as e:
        return jsonify({'code': 400, 'msg': 'Get requirement detail failed.', 'error_msg': str(e)})


def add_proposal():
    data = request.get_json(force=True)
    uid, rid, proj_name, description, file_url = data["uid"], data["rid"], data["proj_name"], data["description"], data["file"]

    user = UserModel.query.filter(UserModel.uid == uid, UserModel.role == 2, UserModel.active == 1).first()
    if not user:
        return jsonify({'code': 400, 'msg': 'No such proposer in database.'})

    requirement = RequirementModel.query.filter(RequirementModel.rid == rid, RequirementModel.active == 1).first()
    if not requirement:
        return jsonify({'code': 400, 'msg': 'No such requirement in database.'})

    course = CourseModel.query.filter(CourseModel.cid == requirement.cid, CourseModel.active == 1).first()
    if not course:
        return jsonify({'code': 400, 'msg': 'Course id in requirement does not exist.'})

    # submit_ddl = course.start_time - datetime.timedelta(days=14)
    # if get_time()[0] > submit_ddl:
    #     return jsonify({'code': 400, 'msg': 'Exceeded the deadline.'})

    if not proj_name or not description:
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
        db.session.add(proposal)
        if file_url:
            date_time = get_time()[0]
            file_name = file_url.split(".com/")[1]
            file_num = FileModel.query.count()
            fid = generate_id("file", file_num+1)
            file = FileModel(fid=fid, proj_id=proj_id, uid=uid, file_name=file_name, file_url=file_url,
                             type="project", ctime=date_time, utime=date_time)
            db.session.add(file)

        auth_msg = add_message(requirement.aid, f"Proposer {user.username} add a proposal {proposal.proj_name} to your requirement in course {course.name}.")
        proposer_msg = add_message(uid, f"Your proposal {proj_name} was added successfully.")
        if auth_msg and proposer_msg:
            db.session.commit()
            return jsonify({'code': 200, 'msg': 'Add proposal and send messages successfully.'})
        else:
            return jsonify({'code': 400, 'msg': 'Add proposal and send messages failed.'})

    except Exception as e:
        return jsonify({'code': 400, 'msg': 'Add proposal failed.', 'error_msg': str(e)})


def delete_proposal():
    data = request.get_json(force=True)
    uid, proj_id = data["uid"], data["proj_id"]
    user = UserModel.query.filter(UserModel.uid == uid, UserModel.role == 2, UserModel.active == 1).first()
    if not user:
        return jsonify({'code': 400, 'msg': 'No such proposer in database.'})

    proposal = ProjectModel.query.filter(ProjectModel.proj_id == proj_id, ProjectModel.pid == uid, ProjectModel.status == 0).first()
    if not proposal:
        return jsonify({'code': 400, 'msg': 'No such proposal can be deleted by this user.'})

    course = CourseModel.query.filter(CourseModel.cid == proposal.cid, CourseModel.active == 1).first()
    if not course:
        return jsonify({'code': 400, 'msg': 'Course information in this proposal is invalid.'})

    # submit_ddl = course.start_time - datetime.timedelta(days=14)
    # if get_time()[0] > submit_ddl:
    #     return jsonify({'code': 400, 'msg': 'Exceeded the deadline.'})

    try:
        date_time = get_time()[0]
        proposal.status = -1
        proposal.utime = date_time
        file = FileModel.query.filter(FileModel.proj_id == proj_id, FileModel.uid == uid, FileModel.active == 1).first()
        if file:
            file.utime = date_time
            file.active = 0
        auth_msg = add_message(proposal.aid,
                          f"Proposer {user.username} delete proposal {proposal.proj_name} from your requirement in course {course.name}.")
        pro_msg = add_message(uid, f"Your proposal {proposal.proj_name} delete successfully.")
        if auth_msg and pro_msg:
            db.session.commit()
            return jsonify({'code': 200, 'msg': 'Delete proposal and send messages successfully.'})
        else:
            return jsonify({'code': 400, 'msg': 'Delete proposal and send messages failed.'})

    except Exception as e:
        return jsonify({'code': 400, 'msg': 'Delete proposal failed.', 'error_msg': str(e)})


def get_proposals():
    data = request.get_json(force=True)
    uid, rid = data["uid"], data["rid"]

    user = UserModel.query.filter(UserModel.uid == uid, UserModel.active == 1).first()
    if not user:
        return jsonify({'code': 400, 'msg': 'No such user in database.'})

    requirement = RequirementModel.query.filter(RequirementModel.rid == rid, RequirementModel.active == 1).first()
    if not requirement:
        return jsonify({'code': 400, 'msg': 'No such requirement in database.'})

    course = CourseModel.query.filter(CourseModel.cid == requirement.cid, CourseModel.active == 1).first()
    if not course:
        return jsonify({'code': 400, 'msg': 'Course info in this requirement is invalid.'})

    if user.role == 0 or (user.role == 3 and course.public == 1):
        proposal_list = ProjectModel.query.filter(ProjectModel.rid == rid, ProjectModel.status != -1).all()
    elif user.role == 2:
        proposal_list = ProjectModel.query.filter(ProjectModel.rid == rid, ProjectModel.pid == uid, ProjectModel.status != -1).all()
    else:
        return jsonify({'code': 400, 'msg': 'User has no access to see proposals.'})
    if not proposal_list:
        return jsonify({'code': 200, 'msg': 'Empty proposal list.'})

    try:
        result_list = []
        for p in proposal_list:
            is_delete = 0
            proposer = UserModel.query.filter(UserModel.uid == p.pid, UserModel.active == 1).first()
            if p.pid == uid:    is_delete = 1
            p_dict = {"proj_id": p.proj_id, "proj_name": p.proj_name, "is_delete": is_delete,
                      "proposer": proposer.username, "email": proposer.email, "status": p.status}
            result_list.append(p_dict)
        result = {"count": len(result_list), "result_list": result_list}
        return jsonify({'code': 200, 'result': result})

    except Exception as e:
        return jsonify({'code': 400, 'msg': 'Add proposal failed.', 'error_msg': str(e)})


def public_course_to_reviewers():
    data = request.get_json(force=True)
    uid, cid = data["uid"], data["cid"]

    user = UserModel.query.filter(UserModel.uid == uid, or_(UserModel.role == 0, UserModel.role == 3), UserModel.active == 1).first()
    if not user:
        return jsonify({'code': 400, 'msg': 'No such authority in database.'})

    course = CourseModel.query.join(CourseUserModel, CourseModel.cid == CourseUserModel.cid).filter(
        CourseModel.cid == cid, CourseModel.active == 1, CourseUserModel.uid == uid).first()
    if not course:
        return jsonify({'code': 400, 'msg': 'No such course can be accessed by this user in database.'})

    if course.public == 1:
        return jsonify({'code': 400, 'msg': 'Course has been public already.'})

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


# for students only
def get_projects_in_course():
    data = request.get_json(force=True)
    uid, cid = data["uid"], data["cid"]

    user = UserModel.query.filter(UserModel.uid == uid, UserModel.role == 1, UserModel.active == 1).first()
    if not user:
        return jsonify({'code': 400, 'msg': 'No such student in database.'})

    course = CourseModel.query.join(CourseUserModel, CourseModel.cid == CourseUserModel.cid).filter(
        CourseModel.cid == cid, CourseModel.active == 1, CourseUserModel.uid == uid).first()
    if not course:
        return jsonify({'code': 400, 'msg': 'Student has not selected in this course.'})

    proj_list = ProjectModel.query.filter(ProjectModel.cid == cid, ProjectModel.status > 2).all()
    if not proj_list:
        return jsonify({'code': 200, 'msg': 'There is no published projects in this course.'})

    try:
        result_list = []
        for proj in proj_list:
            ca = UserModel.query.filter(UserModel.uid == proj.aid, UserModel.active == 1).first()
            proposer = UserModel.query.filter(UserModel.uid == proj.pid, UserModel.active == 1).first()
            if not ca or not proposer:
                print("Wrong information of ca or proposer in this project")
                continue
            proj_dict = {"proj_name": proj.proj_name, "proj_id": proj.proj_id, "description": proj.description,
                         "course_authority": ca.username, "ca_email": ca.email,
                         "proposer": proposer.username, "proposer_email": proposer.email,
                         "status": proj.status, "cur_num": proj.cur_num, "max_num": proj.max_num,
                         "start_time": proj.start_time, "close_time": proj.close_time}
            result_list.append(proj_dict)
        result = {"count": len(result_list), "result_list": result_list}
        return jsonify({'code': 200, 'result': result})

    except Exception as e:
        return jsonify({'code': 400, 'msg': 'Get projects in course failed.', 'error_msg': str(e)})


def edit_requirement():
    data = request.get_json(force=True)
    uid, rid, content = data["uid"], data["rid"], data["content"]

    if not content:
        return jsonify({'code': 400, 'msg': 'Empty content.'})

    user = UserModel.query.filter(UserModel.uid == uid, or_(UserModel.role == 0, UserModel.role == 3),
                                  UserModel.active == 1).first()
    if not user:
        return jsonify({'code': 400, 'msg': 'No such active user has access to edit requirements.'})

    requirement = RequirementModel.query.filter(RequirementModel.rid == rid, RequirementModel.active == 1).first()
    if not requirement:
        return jsonify({'code': 400, 'msg': 'No such requirement in database.'})

    if requirement.aid != uid:
        return jsonify({'code': 400, 'msg': 'User cannot edit this requirement.'})

    proposals = ProjectModel.query.filter(ProjectModel.rid == rid, ProjectModel.status != -1).all()
    if proposals:
        return jsonify({'code': 400, 'msg': 'User cannot edit this requirement, since there are proposals.'})

    course = CourseModel.query.filter(CourseModel.cid == requirement.cid, CourseModel.active == 1).first()
    if not course:
        return jsonify({'code': 400, 'msg': 'Wrong course info in this requirement.'})

    # submit_ddl = course.start_time - datetime.timedelta(days=14)
    # if get_time()[0] > submit_ddl:
    #     return jsonify({'code': 400, 'msg': 'Exceeded the deadline.'})

    try:
        date_time = get_time()[0]
        requirement.content = content
        requirement.utime = date_time
        db.session.commit()
        return jsonify({'code': 200, 'msg': 'edit requirement successfully.'})

    except Exception as e:
        return jsonify({'code': 400, 'msg': 'edit requirement failed.', 'error_msg': str(e)})


def delete_requirement():
    data = request.get_json(force=True)
    uid, rid = data["uid"], data["rid"]

    user = UserModel.query.filter(UserModel.uid == uid, or_(UserModel.role == 0, UserModel.role == 3),
                                  UserModel.active == 1).first()
    if not user:
        return jsonify({'code': 400, 'msg': 'No such active user has access to delete requirements.'})

    requirement = RequirementModel.query.filter(RequirementModel.rid == rid, RequirementModel.active == 1).first()
    if not requirement:
        return jsonify({'code': 400, 'msg': 'No such requirement in database.'})

    if requirement.aid != uid:
        return jsonify({'code': 400, 'msg': 'User cannot delete this requirement.'})

    proposals = ProjectModel.query.filter(ProjectModel.rid == rid, ProjectModel.status != -1).all()
    if proposals:
        return jsonify({'code': 400, 'msg': 'User cannot delete this requirement, since there are proposals.'})

    course = CourseModel.query.filter(CourseModel.cid == requirement.cid, CourseModel.active == 1).first()
    if not course:
        return jsonify({'code': 400, 'msg': 'Wrong course info in this requirement.'})

    # submit_ddl = course.start_time - datetime.timedelta(days=14)
    # if get_time()[0] > submit_ddl:
    #     return jsonify({'code': 400, 'msg': 'Exceeded the deadline.'})

    try:
        date_time = get_time()[0]
        requirement.active = 0
        requirement.utime = date_time
        db.session.commit()
        return jsonify({'code': 200, 'msg': 'Delete requirement successfully.'})

    except Exception as e:
        return jsonify({'code': 400, 'msg': 'Delete requirement failed.', 'error_msg': str(e)})




