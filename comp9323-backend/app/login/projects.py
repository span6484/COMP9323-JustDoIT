from flask import jsonify, request, g
from sqlalchemy import exists
from datetime import datetime as dt
from app.login.utils import *
from app.models import *
from sqlalchemy import or_, and_, not_
from app.login.views import *
from flask import Flask, flash, request, redirect, url_for
from werkzeug.utils import secure_filename


# view project details
def view_project():
    data = request.get_json(force=True)
    result = {}

    proj_id = data["proj_id"]
    proj = ProjectModel.query.filter(ProjectModel.proj_id == proj_id, ProjectModel.status != -1).first()
    if not proj:
        return jsonify({'code': 400, 'msg': 'not related project'})

    uid = data["uid"]
    user = UserModel.query.filter(UserModel.uid == uid, UserModel.active == 1).first()
    if not user:
        return jsonify({'code': 400, 'msg': 'User does not exist'})

    course = CourseModel.query.filter(CourseModel.cid == proj.cid, CourseModel.active == 1).first()
    if not course:
        return jsonify({'code': 400, 'msg': 'not related course'})

    authority = UserModel.query.filter(UserModel.uid == proj.aid, UserModel.role == 0).first()
    if not authority:
        return jsonify({'code': 400, 'msg': 'no course authority'})

    proposer = UserModel.query.filter(UserModel.uid == proj.pid, UserModel.role == 2).first()
    if not proposer:
        return jsonify({'code': 400, 'msg': 'no proposer'})

    file = FileModel.query.filter(FileModel.proj_id == proj_id, FileModel.type == "project", FileModel.active == 1).first()
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
    is_join, is_edit = 0, 0
    selection = SelectionModel.query.filter(SelectionModel.sid == uid, SelectionModel.proj_id == proj_id, SelectionModel.active == 1).first()
    if (proj.status == 0 and proj.pid == uid) or (proj.aid == uid and (proj.status < 3 and proj.status != 2)):
        is_edit = 1
    elif user.role == 1 and selection:
        is_join = 1
    result["is_join"] = is_join
    result["is_edit"] = is_edit
    # list file
    if file:
        file_info = {"file_name": file.file_name, "file_url": file.file_url, "type": file.type, "utime": file.utime}
        result["files"] = file_info
    else:
        result["files"] = None

    return jsonify({'code': 200, 'result': result})


def res_proj_detail(user, project, course):
    result = {}
    result["proj_id"] = project.proj_id
    result["proj_name"] = project.proj_name
    result["course_id"] = course.cid
    print("project.aid", project.aid)
    ca = UserModel.query.filter(UserModel.uid == project.aid, UserModel.active == 1).first()
    result["CA_name"] = ca.username
    result["CA_id"] = ca.uid
    result["project_capacity"] = project.max_num
    result["status"] = project.status
    result["start_time"] = project.start_time
    result["close_time"] = project.close_time
    return result


def get_myProject():
    data = request.get_json(force=True)
    proj_status = data["proj_status"]
    uid, course_id = data["uid"], data["course_id"]
    page_size, page_index = data["page_size"], data["page_index"]

    user = UserModel.query.filter(UserModel.uid == uid, UserModel.active == 1).first()
    if not user:
        return jsonify({'code': 400, 'msg': 'User does not exist.'})

    if course_id:
        # show projects in this course
        course = CourseModel.query.filter(CourseModel.cid == course_id, CourseModel.active == 1).first()
        if not course:
            return jsonify({'code': 400, 'msg': 'Course does not exist.'})

        if user.role == 0:
            if proj_status or proj_status == 0:
                projs = ProjectModel.query.filter(ProjectModel.cid == course_id, ProjectModel.status == proj_status,
                                                  ProjectModel.aid == uid).all()
            else:
                projs = ProjectModel.query.filter(ProjectModel.cid == course_id, ProjectModel.aid == uid,
                                                  ProjectModel.status != -1).all()
        elif user.role == 1:
            if proj_status or proj_status == 0:
                projs = ProjectModel.query.join(SelectionModel, ProjectModel.proj_id == SelectionModel.proj_id).filter(
                    ProjectModel.cid == course_id, SelectionModel.sid == uid, SelectionModel.active == 1, ProjectModel.status == proj_status).all()
            else:
                projs = ProjectModel.query.join(SelectionModel, ProjectModel.proj_id == SelectionModel.proj_id).filter(
                    ProjectModel.cid == course_id, SelectionModel.sid == uid, SelectionModel.active == 1, ProjectModel.status != -1).all()
        elif user.role == 2:
            if proj_status or proj_status == 0:
                projs = ProjectModel.query.filter(ProjectModel.cid == course_id, ProjectModel.status == proj_status,
                                                  ProjectModel.pid == uid).all()
            else:
                projs = ProjectModel.query.filter(ProjectModel.cid == course_id, ProjectModel.status != -1,
                                                  ProjectModel.pid == uid).all()
        elif user.role == 3:
            if proj_status or proj_status == 0:
                projs = ProjectModel.query.filter(ProjectModel.cid == course_id, ProjectModel.status == proj_status,
                                                  or_(ProjectModel.aid == uid, course.public == 1)).all()
            else:
                projs = ProjectModel.query.filter(ProjectModel.cid == course_id, ProjectModel.status != -1,
                                                  or_(ProjectModel.aid == uid, course.public == 1)).all()
        else:
            return jsonify({'code': 400, 'msg': 'Invalid number.'})

    else:
        # show all projects related to user
        if user.role == 0:
            if proj_status or proj_status == 0:
                projs = ProjectModel.query.filter(ProjectModel.status == proj_status, ProjectModel.aid == uid).all()
            else:
                projs = ProjectModel.query.filter(ProjectModel.aid == uid, ProjectModel.status != -1).all()
        elif user.role == 1:
            if proj_status or proj_status == 0:
                projs = ProjectModel.query.join(SelectionModel, ProjectModel.proj_id == SelectionModel.proj_id).filter(
                    SelectionModel.sid == uid, SelectionModel.active == 1, ProjectModel.status == proj_status).all()
            else:
                projs = ProjectModel.query.join(SelectionModel, ProjectModel.proj_id == SelectionModel.proj_id).filter(
                    SelectionModel.sid == uid, SelectionModel.active == 1, ProjectModel.status != -1).all()
        elif user.role == 2:
            if proj_status or proj_status == 0:
                projs = ProjectModel.query.filter(ProjectModel.status == proj_status, ProjectModel.pid == uid).all()
            else:
                projs = ProjectModel.query.filter(ProjectModel.status != -1, ProjectModel.pid == uid).all()
        elif user.role == 3:
            if proj_status or proj_status == 0:
                projs = ProjectModel.query.join(CourseModel, ProjectModel.cid == CourseModel.cid).filter(
                    ProjectModel.status == proj_status, or_(ProjectModel.aid == uid, CourseModel.public == 1)).all()
            else:
                projs = ProjectModel.query.join(CourseModel, ProjectModel.cid == CourseModel.cid).filter(
                    ProjectModel.status != -1, or_(ProjectModel.aid == uid, CourseModel.public == 1)).all()
        else:
            return jsonify({'code': 400, 'msg': 'Invalid number.'})

    result = {}
    proj_list = []
    if not projs:
        return jsonify({'code': 200, 'msg': "Empty projects list."})
    for p in projs:
        ca = UserModel.query.filter(UserModel.uid == p.aid, UserModel.active == 1).first()
        proposer = UserModel.query.filter(UserModel.uid == p.pid, UserModel.active == 1).first()
        course = CourseModel.query.filter(CourseModel.cid == p.cid, CourseModel.active == 1).first()
        if not ca or not proposer or not course:
            return jsonify({'code': 400, 'msg': 'Invalid info in project.'})
        proj_info = {"course_name": course.name, "proj_id": p.proj_id, "proj_name": p.proj_name, "ca_name": ca.username, "ca_email": ca.email,
                     "propser_name": proposer.username, "propser_email": proposer.email, "cur_num": p.cur_num, "max_num": p.max_num,
                     "status": p.status, "start_time": p.start_time, "close_time": p.close_time}
        proj_list.append(proj_info)

    result["proj_count"] = len(proj_list)
    start = page_index * page_size
    end = start + page_size
    if end < result["proj_count"]:
        result["list"] = proj_list[start:end]
    else:
        result["list"] = proj_list[start:]

    return jsonify({'code': 200, 'result': result})


# change project status: pending, approved/not, add to join"
# pending: 0   approved: 1   not approved: 2
def change_project_status():
    data = request.get_json(force=True)
    uid, proj_id, status = data["uid"], data["proj_id"], data["status"]

    user = UserModel.query.filter(UserModel.uid == uid, UserModel.active == 1, or_(UserModel.role == 0, UserModel.role == 3)).first()
    if not user:
        return jsonify({'code': 400, 'msg': 'User has no access to edit status.'})

    project = ProjectModel.query.filter(ProjectModel.proj_id == proj_id, ProjectModel.status != -1).first()
    if not project:
        return jsonify({'code': 400, 'msg': 'No such project can be changed.'})

    course = CourseModel.query.filter(CourseModel.cid == project.cid, CourseModel.active == 1).first()
    if not course:
        return jsonify({'code': 400, 'msg': 'not related course'})

    can_modify, fst_status, sec_status = 0, "", ""
    cur_time = datetime.datetime.now().strftime('%Y-%m-%d %H:%M:%S')
    start_time = project.start_time.strftime('%Y-%m-%d %H:%M:%S')
    close_time = project.close_time.strftime('%Y-%m-%d %H:%M:%S')
    print(cur_time, start_time, close_time)
    if project.aid == uid:
        if project.status == 0 and (status == 1 or status == 2):
            can_modify = 1
            fst_status = "pending"
            if status == 1:
                sec_status = "approved"
            else:
                sec_status = "rejected"
        elif project.status == 1 and status == 3:
            can_modify = 1
            fst_status = "approved"
            sec_status = "open to join"
        elif status == 4 and project.status == 3 and start_time < cur_time < close_time:
            can_modify = 1
            fst_status = "open to join"
            sec_status = "in progress"
        elif status == 5 and (project.status == 4 or project.status == 3) and cur_time > close_time:
            can_modify = 1
            fst_status = "in progress"
            sec_status = "close"
    elif course.public == 1 and user.role == 3 and project.aid != uid:
        if project.status == 0 and (status == 1 or status == 2):
            can_modify = 1
            fst_status = "pending"
            if status == 1:
                sec_status = "approved"
            else:
                sec_status = "rejected"
    else:
        return jsonify({'code': 400, 'msg': 'This Project cannot be changed by this user.'})

    try:
        if can_modify == 1:
            project.status = status
            date_time = get_time()[0]
            project.utime = date_time
            auth_msg = add_message(project.aid,
                                   f"Status of project {project.proj_name} was changed from {fst_status} to {sec_status}.")
            proposer_msg = add_message(project.pid,
                                       f"Status of your project {project.proj_name} was changed from {fst_status} to {sec_status}.")
            if auth_msg and proposer_msg:
                db.session.commit()
                return jsonify({'code': 200, 'msg': 'Change status and send messages successfully.'})
            else:
                return jsonify({'code': 400, 'msg': 'Change status and send messages failed.'})
        else:
            return jsonify({'code': 400, 'msg': 'modify status failed'})
    except Exception as e:
        return jsonify({'code': 400, 'msg': 'modify status failed.', 'error_msg': str(e)})


# [username, email, role]
def show_usr_info(owner_uid):
    user = UserModel.query.filter(UserModel.uid == owner_uid).first()
    if not user:
        return []
    user_lst = []
    user_lst.append(user.username)
    user_lst.append(user.email)
    user_lst.append(user.role)
    user_lst.append(user.uid)
    return user_lst


# all reply comment to comment
def show_reply_comment(root_id, proj_id):
    post_lst = list()
    posts = CommentModel.query.filter(CommentModel.proj_id == proj_id, CommentModel.root_id == root_id,
                                      CommentModel.cm_id != root_id, CommentModel.active == 1).order_by(
        CommentModel.utime).all()
    if not posts:
        return posts
    for post in posts:
        post_dic = dict()
        owner_uid = post.owner_uid
        owner_info = show_usr_info(owner_uid)
        if len(owner_info) != 0:
            post_dic["owner_uid"] = owner_uid
            post_dic["owner_name"] = owner_info[0]
            post_dic["owner_email"] = owner_info[1]
            post_dic["owner_role"] = owner_info[2]
        target_uid = post.target_uid
        target_info = show_usr_info(target_uid)
        if len(target_info) != 0:
            post_dic["target_uid"] = target_uid
            post_dic["target_name"] = target_info[0]
            post_dic["target_email"] = target_info[1]
            post_dic["target_role"] = target_info[2]
        post_dic["cm_id"] = post.cm_id
        post_dic["parent_id"] = post.parent_id
        post_dic["content"] = post.content
        post_dic["utime"] = post.utime
        post_lst.append(post_dic)
    return post_lst


def view_comment():
    data = request.get_json(force=True)
    proj_id = data["proj_id"]
    proj = ProjectModel.query.filter(ProjectModel.proj_id == proj_id, ProjectModel.status >= 3).first()
    if not proj:
        return jsonify({'code': 400, 'msg': 'not related project'})
    comments = CommentModel.query.filter(CommentModel.proj_id == proj_id, CommentModel.active == 1).order_by(
        CommentModel.utime).all()

    if not comments:
        return jsonify({'code': 400, 'msg': 'no related comment'})
    result = {}
    # 层主
    posts = CommentModel.query.filter(CommentModel.proj_id == proj_id, CommentModel.target_uid == None,
                                      CommentModel.parent_id == None, CommentModel.active == 1).order_by(
        CommentModel.utime).all()
    post_lst = []
    count = 0
    for post in posts:
        post_info = {}
        root_id = post.root_id  # get poster id
        root_usr_info = show_usr_info(post.owner_uid)  # username, email, role
        if len(root_usr_info) != 0:
            root_name = root_usr_info[0]
            root_email = root_usr_info[1]
            root_role = root_usr_info[2]
            root_uid = root_usr_info[3]
            post_info["root_id"] = root_id
            post_info["root_name"] = root_name
            post_info["root_email"] = root_email
            post_info["root_role"] = root_role
            post_info["root_uid"] = root_uid
            post_info["root_content"] = post.content
            post_info["reply_comment"] = show_reply_comment(root_id, proj_id)
            post_info["reply_count"] = len(post_info["reply_comment"])
        post_lst.append(post_info)
        count += 1
    result["posts_count"] = count
    result["posts"] = post_lst
    return jsonify({'code': 200, 'result': result})


def add_comment():
    data = request.get_json(force=True)
    proj_id = data["proj_id"]
    uid = data["uid"]
    content = data["content"]

    # determine the project json data
    proj = ProjectModel.query.filter(ProjectModel.proj_id == proj_id, ProjectModel.status >= 3).first()
    if not proj:
        return jsonify({'code': 400, 'msg': 'not related project'})
    cid = proj.cid
    course = CourseModel.query.filter(CourseModel.cid == cid, CourseModel.active == 1).first()
    if not course:
        return jsonify({'code': 400, 'msg': 'not related course'})
    ## users json
    usr = UserModel.query.filter(UserModel.uid == uid, UserModel.active == 1).first()
    if not usr:
        return jsonify({'code': 400, 'msg': 'not related user'})

    user = ProjectModel.query.filter(or_(ProjectModel.aid == uid, ProjectModel.pid == uid)).first()
    is_user_exist = False
    if user:
        is_user_exist = True
    else:
        user = SelectionModel.query.filter(SelectionModel.sid == uid, SelectionModel.proj_id == proj_id,
                                           SelectionModel.active == 1).first()
        if user:
            is_user_exist = True
    if not is_user_exist:
        return jsonify(
            {'code': 400, 'msg': 'no related user exist, please check CA, proposer, or student link to this project'})

    ## content json
    if not content or content.isspace():
        return jsonify({'code': 400, 'msg': 'content is empty'})
    try:
        cm_num = CommentModel.query.count()
        cm_id = generate_id("comment", cm_num + 1)
        date_time = get_time()[0]
        comment = CommentModel(cm_id=cm_id, proj_id=proj_id, owner_uid=uid, target_uid=None, parent_id=None,
                               root_id=cm_id, content=content, ctime=date_time, utime=date_time, active=1)
        db.session.add(comment)
        db.session.commit()
        return jsonify({'code': 200, 'msg': 'add comment successfully'})
    except Exception as e:
        return jsonify({'code': 400, 'msg': 'add comment failed.', 'error_msg': str(e)})


def reply_comment():
    data = request.get_json(force=True)
    proj_id = data["proj_id"]
    uid = data["uid"]
    content = data["content"]
    target_uid = data["target_uid"]
    parent_id = data["parent_id"]
    root_id = data["root_id"]
    user = UserModel.query.filter(UserModel.uid == uid, UserModel.active == 1).first()
    if not user:
        return jsonify({'code': 400, 'msg': 'not related user'})
    # determine the project json data
    proj = ProjectModel.query.filter(ProjectModel.proj_id == proj_id, ProjectModel.status >= 3).first()
    if not proj:
        return jsonify({'code': 400, 'msg': 'No project can reply comment.'})
    course = CourseModel.query.filter(CourseModel.cid == proj.cid, CourseModel.active == 1).first()
    if not course:
        return jsonify({'code': 400, 'msg': 'not related course'})
    ## users json
    user = ProjectModel.query.filter(or_(ProjectModel.aid == uid, ProjectModel.pid == uid)).first()
    is_user_exist = False
    if user:
        is_user_exist = True
    else:
        user = SelectionModel.query.filter(SelectionModel.sid == uid, SelectionModel.proj_id == proj_id,
                                           SelectionModel.active == 1).first()
        if user:
            is_user_exist = True
    if not is_user_exist:
        return jsonify({'code': 400, 'msg': 'no related user exist'})

    ## content json
    if not content or content.isspace():
        return jsonify({'code': 400, 'msg': 'content is empty'})
    print(target_uid)
    username = (UserModel.query.filter(UserModel.uid == uid, UserModel.active == 1).first()).username
    target_usr = UserModel.query.filter(UserModel.uid == target_uid, UserModel.active == 1).first()
    if not target_usr:
        return jsonify({'code': 400, 'msg': 'target user not exist'})
    ## root exist
    root = CommentModel.query.filter(CommentModel.root_id == root_id, CommentModel.active == 1).order_by(
        CommentModel.utime).all()
    if not root:
        return jsonify({'code': 400, 'msg': 'no root comment'})
    try:
        cm_num = CommentModel.query.count()
        cm_id = generate_id("comment", cm_num + 1)
        date_time = get_time()[0]
        comment = CommentModel(cm_id=cm_id, proj_id=proj_id, owner_uid=uid, target_uid=target_uid, parent_id=parent_id,
                               root_id=root_id, content=content, ctime=date_time, utime=date_time, active=1)
        db.session.add(comment)
        # add_comment()
        msg = add_message(target_usr.uid, f"{username} replied your comment in project {proj.proj_name}.")
        if msg:
            db.session.commit()
            return jsonify({'code': 200, 'msg': 'reply comment successfully and send message successfully.'})
        else:
            return jsonify({'code': 200, 'msg': 'reply comment successfully and send message failed.'})
    except Exception as e:
        return jsonify({'code': 400, 'msg': 'reply comment failed.', 'error_msg': str(e)})


def delete_comment():
    data = request.get_json(force=True)
    uid = data["uid"]
    cm_id = data["cm_id"]
    comments = CommentModel.query.filter(CommentModel.cm_id == cm_id, CommentModel.owner_uid == uid,
                                         CommentModel.active == 1).order_by(CommentModel.utime).first()
    if not comments:
        return jsonify({'code': 400, 'msg': 'not related comments'})
    usr = UserModel.query.filter(UserModel.uid == uid, UserModel.active == 1).first()
    if not usr:
        return jsonify({'code': 400, 'msg': 'not related user'})
    # poster
    date_time = get_time()[0]
    if comments.target_uid is None and comments.parent_id is None:
        reply_comments = CommentModel.query.filter(CommentModel.root_id == cm_id, CommentModel.active == 1).all()

        if reply_comments:
            for reply_comment in reply_comments:
                reply_comment.active = 0
                reply_comment.utime = date_time
                db.session.commit()

    related_comments = CommentModel.query.filter(CommentModel.parent_id == cm_id, CommentModel.active == 1).all()
    if related_comments:
        for related_comment in related_comments:
            related_comment.active = 0
            related_comment.utime = date_time
            db.session.commit()

    comments.active = 0
    comments.utime = date_time
    return jsonify({'code': 200, 'msg': 'delete comment successfully'})


def edit_project():
    data = request.get_json(force=True)
    proj_id = data["proj_id"]
    proj_name = data["proj_name"]
    description = data["description"]
    start_time = data["start_time"]
    close_time = data["close_time"]
    max_num = data["max_num"]
    uid = data["uid"]
    # status = data["status"]
    file_url = data["file"]
    user = UserModel.query.filter(UserModel.uid == uid, UserModel.active == 1).first()
    if not user:
        return jsonify({'code': 400, 'msg': 'User does not exist.'})
    proj = ProjectModel.query.filter(ProjectModel.proj_id == proj_id).first()
    if not proj:
        return jsonify({'code': 400, 'msg': 'not related project'})

    can_modify = 0
    if (proj.status == 0 and proj.pid == uid) or (proj.aid == uid and (proj.status < 3 and proj.status != 2)):
        can_modify = 1
    if can_modify == 0:
        return jsonify({'code': 400, 'msg': 'this project cannot be modified'})

    cid = proj.cid
    course = CourseModel.query.filter(CourseModel.cid == cid, CourseModel.active == 1).first()
    if not course:
        return jsonify({'code': 400, 'msg': 'not related course'})

    # user = ProjectModel.query.filter(or_(ProjectModel.aid == uid, ProjectModel.pid == uid)).first()
    # if not user:
    #     return jsonify({'code': 400, 'msg': 'no related user exist, Only CA or proposer has access'})

    try:
        date_time = get_time()[0]
        is_changed = False
        if proj_name:
            proj_name = proj_name.strip()
            proj.proj_name = proj_name
            is_changed = True
        if description:
            description = description.strip()
            proj.description = description
            is_changed = True
        if start_time:
            start_time_lst = time_list(start_time)
            proj.start_time = dt(start_time_lst[0], start_time_lst[1], start_time_lst[2])
            is_changed = True
        if close_time:
            end_time_lst = time_list(close_time)
            proj.close_time = dt(end_time_lst[0], end_time_lst[1], end_time_lst[2])
            is_changed = True
        if is_changed:
            proj.utime = date_time
        if file_url:
            file = FileModel.query.filter(FileModel.proj_id == proj_id, FileModel.type == "project",
                                          FileModel.active == 1).first()
            if file:
                file_name = file_url.split('.com/')[1]
                file.file_name = file_name
                file.file_url = file_url
                file.uid = uid
                file.utime = date_time
            else:
                file_name = file_url.split('.com/')[1]
                file_num = FileModel.query.count()
                fid = generate_id("file", file_num + 1)
                new_file = FileModel(fid=fid, proj_id=proj_id, uid=uid, file_name=file_name, file_url=file_url,
                                     type="project", ctime=date_time, utime=date_time)
                db.session.add(new_file)

        proj.max_num = max_num
        auth_msg = add_message(proj.aid,
                               f"Project {proj.proj_name} was edited by {user.username}.")
        proposer_msg = add_message(proj.pid, f"Your project {proj.proj_name} was edited by {user.username}.")
        if auth_msg and proposer_msg:
            db.session.commit()
            return jsonify({'code': 200, 'msg': 'Edit proposal and send messages successfully.'})
        else:
            return jsonify({'code': 400, 'msg': 'Edit proposal and send messages failed.'})

    except Exception as e:
        return jsonify({'code': 400, 'msg': 'edit project failed.', 'error_msg': str(e)})


def get_sel_Info(selection, proj):
    user = UserModel.query.filter(UserModel.uid == selection.sid, UserModel.active == 1).first()
    file = FileModel.query.filter(FileModel.proj_id == proj.proj_id, FileModel.active == 1,
                                  FileModel.uid == selection.sid).first()
    if not user or not selection or not proj or not file:
        return {}
    file_info = {"file_id": file.fid, "file_name": file.file_name, "file_url": file.file_url}
    result = {"sid": selection.sid, "student_name": user.username, "uid": user.uid, "utime": selection.utime, "file": file_info,
              "a_feedback": selection.a_feedback, "p_feedback": selection.p_feedback, "award": selection.award}
    return result


def view_works():
    data = request.get_json(force=True)
    uid, proj_id = data["uid"], data["proj_id"]
    page_size, page_index = data["page_size"], data["page_index"]
    user = UserModel.query.filter(UserModel.uid == uid, UserModel.active == 1).first()
    if not user:
        return jsonify({'code': 400, 'msg': 'User does not exist.'})
    proj = ProjectModel.query.filter(ProjectModel.proj_id == proj_id, or_(ProjectModel.status == 4, ProjectModel.status == 5)).first() #
    if not proj:
        return jsonify({'code': 400, 'msg': 'Project does not exist.'})

    course = CourseModel.query.filter(CourseModel.cid == proj.cid, CourseModel.active == 1).first()
    if not course:
        return jsonify({'code': 400, 'msg': 'not related course'})

    authority = UserModel.query.filter(UserModel.uid == proj.aid, UserModel.role == 0, UserModel.active == 1).first()
    if not authority:
        return jsonify({'code': 400, 'msg': 'no course authority'})

    proposer = UserModel.query.filter(UserModel.uid == proj.pid, UserModel.role == 2, UserModel.active == 1).first()
    if not proposer:
        return jsonify({'code': 400, 'msg': 'no proposer'})

    selection = SelectionModel.query.filter(SelectionModel.sid == uid, SelectionModel.proj_id == proj_id,
                                            SelectionModel.active == 1).first()
    if user.role == 1 and not selection:
        return jsonify({'code': 400, 'msg': 'Student did not select this project.'})

    all_selections = SelectionModel.query.filter(SelectionModel.proj_id == proj_id, SelectionModel.active == 1).all()
    if not all_selections:
        return jsonify({'code': 200, 'msg': 'No students select this project'})

    is_award = 0
    if uid == proj.aid:
        is_award = 1

    result = {}
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
    result["is_award"] = is_award

    selection_List = []
    if uid == proj.aid or uid == proj.pid:
        for s in all_selections:
            temp = get_sel_Info(s, proj)
            if temp:
                selection_List.append(temp)
        result["student_count"] = len(selection_List)

        start = page_index * page_size
        end = start + page_size
        if end < result["student_count"]:
            result["student_lst"] = selection_List[start:end]
        else:
            result["student_lst"] = selection_List[start:]

        return jsonify({'code': 200, 'result': result})
    elif user.role == 1 and selection:
        work_info = get_sel_Info(selection, proj)
        if work_info:
            selection_List.append(work_info)
        result["student_count"] = len(selection_List)
        result["student_lst"] = selection_List
        return jsonify({'code': 200, 'result': result})
    else:
        return jsonify({'code': 400, 'msg': "get works failed"})


def give_feedback():
    data = request.get_json(force=True)
    uid = data["uid"]  # give feedback
    sid = data["sid"]
    feedback = data["feedback"]
    proj_id = data["proj_id"]
    proj = ProjectModel.query.filter(ProjectModel.proj_id == proj_id).first()
    if not proj:
        return jsonify({'code': 400, 'msg': 'not related project'})
    user = UserModel.query.filter(UserModel.uid == uid, UserModel.active == 1).first()
    if not user:
        return jsonify({'code': 400, 'msg': 'User does not exist'})
    cid = proj.cid
    course = CourseModel.query.filter(CourseModel.cid == cid, CourseModel.active == 1).first()
    if not course:
        return jsonify({'code': 400, 'msg': 'not related course'})

    aid = proj.aid
    authority = UserModel.query.filter(UserModel.uid == aid, UserModel.role == 0, UserModel.active == 1).first()
    if not authority:
        return jsonify({'code': 400, 'msg': 'no course authority'})
    pid = proj.pid  # proposer_id
    proposer = UserModel.query.filter(UserModel.uid == pid, UserModel.role == 2, UserModel.active == 1).first()
    if not proposer:
        return jsonify({'code': 400, 'msg': 'no proposer'})
    if user != authority and user != proposer:
        return jsonify({'code': 400, 'msg': 'this user has no access'})
    student = UserModel.query.filter(UserModel.uid == sid, UserModel.active == 1).first()
    if not student:
        return jsonify({'code': 400, 'msg': 'no student'})

    selection = SelectionModel.query.filter(SelectionModel.proj_id == proj_id, SelectionModel.sid == sid,
                                            SelectionModel.active == 1).first()
    if not selection:
        return jsonify({'code': 400, 'msg': 'no selections'})
    if feedback:
        date_time = get_time()[0]
        if user == authority:
            selection.a_feedback = feedback
        if user == proposer:
            selection.p_feedback = feedback
        selection.utime = date_time
        role = ""
        if uid == proj.aid:
            role = "Course authority"
        elif uid == proj.pid:
            role = "Proposer"
        stu_msg = add_message(sid, f"{role} {user.username} gave you a feedback in project {proj.proj_name}.")
        if stu_msg:
            db.session.commit()
            return jsonify({'code': 200, 'msg': 'Give feedback and send messages successfully.'})
        else:
            return jsonify({'code': 400, 'msg': 'Give feedbac and send messages failed.'})

    return jsonify({'code': 400, 'msg': 'give feedback fail'})


def join_quit_project():
    data = request.get_json(force=True)
    sid = data["sid"]
    proj_id = data["proj_id"]
    join_state = data["join_state"]  # 0：quit    1： join
    student = UserModel.query.filter(UserModel.uid == sid, UserModel.active == 1).first()
    if not student:
        return jsonify({'code': 400, 'msg': 'student not exist'})

    selection = SelectionModel.query.filter(SelectionModel.proj_id == proj_id, SelectionModel.sid == sid,
                                            SelectionModel.active == 1).first()

    proj = ProjectModel.query.filter(ProjectModel.proj_id == proj_id).first()
    if not proj:
        return jsonify({'code': 400, 'msg': 'not related project'})
    select_num = SelectionModel.query.count()
    sel_id = generate_id("selection", select_num+1)
    date_time = get_time()[0]
    if join_state == 1:
        if not selection and proj.cur_num < proj.max_num:
            add_selection = SelectionModel(sel_id=sel_id, proj_id=proj_id, sid=sid, a_feedback=None, p_feedback=None,
                                           ctime=date_time, utime=date_time, active=1)
            proj.cur_num += 1
            db.session.add(add_selection)
            db.session.commit()
            return jsonify({'code': 200, 'msg': 'join successfully'})
    if join_state == 0:
        if selection:
            selection.active = 0
            selection.utime = date_time
            proj.cur_num -= 1
            db.session.commit()
            return jsonify({'code': 200, 'msg': 'quit successfully'})
    return jsonify({'code': 400, 'msg': 'operate fail'})


def student_submit():
    data = request.get_json(force=True)
    uid, proj_id, file_url = data["uid"], data["proj_id"], data["file"]
    user = UserModel.query.filter(UserModel.uid == uid, UserModel.role == 1, UserModel.active == 1).first()
    if not user:
        return jsonify({'code': 400, 'msg': 'Student does not exist.'})
    proj = ProjectModel.query.filter(ProjectModel.proj_id == proj_id, ProjectModel.status == 4).first()
    if not proj:
        return jsonify({'code': 400, 'msg': 'Project cannot upload files by students.'})
    selection = SelectionModel.query.filter(SelectionModel.sid == uid, SelectionModel.proj_id == proj_id, SelectionModel.active == 1).first()
    if not selection:
        return jsonify({'code': 400, 'msg': 'Student did not select this project.'})

    try:
        date_time = get_time()[0]
        file_name = file_url.split('.com/')[1]
        file_num = FileModel.query.count()
        fid = generate_id("file", file_num + 1)
        new_file = FileModel(fid=fid, proj_id=proj_id, uid=uid, file_name=file_name, file_url=file_url,
                             type="work", ctime=date_time, utime=date_time)
        db.session.add(new_file)
        stu_msg = add_message(uid, f"Your work {file_name} uploded to project {proj.proj_name} successfully.")
        auth_msg = add_message(proj.aid,
                               f"Student {user.username} has uploaded a work to project {proj.proj_name}.")
        proposer_msg = add_message(proj.pid, f"Student {user.username} has uploaded a work to project {proj.proj_name}.")
        if stu_msg and auth_msg and proposer_msg:
            db.session.commit()
            return jsonify({'code': 200, 'msg': 'Submit and send messages successfully.'})
        else:
            return jsonify({'code': 400, 'msg': 'Submit and send messages failed.'})

    except Exception as e:
        file_name = file_url.split('.com/')[1]
        stu_msg = add_message(uid, f"Your work {file_name} uploded to project {proj.proj_name} successfully.")
        if stu_msg:
            db.session.commit()
            return jsonify({'code': 400, 'msg': 'Submit work failed and send message.', 'error_msg': str(e)})
        else:
            return jsonify({'code': 400, 'msg': 'Submit work and send message failed.', 'error_msg': str(e)})


def give_award():
    data = request.get_json(force=True)
    uid, proj_id, sid, award = data["uid"], data["proj_id"], data["sid"], data["award"]
    proj = ProjectModel.query.filter(ProjectModel.proj_id == proj_id,
                                     or_(ProjectModel.status == 4, ProjectModel.status == 5)).first()
    if not proj:
        return jsonify({'code': 400, 'msg': 'Project cannot give awards.'})
    user = UserModel.query.filter(UserModel.uid == uid, UserModel.uid == proj.aid, UserModel.active == 1).first()
    if not user:
        return jsonify({'code': 400, 'msg': 'Not this project auth.'})
    student = UserModel.query.filter(UserModel.uid == sid, UserModel.role == 1, UserModel.active == 1).first()
    if not student:
        return jsonify({'code': 400, 'msg': 'Student does not exist.'})
    proj = ProjectModel.query.filter(ProjectModel.proj_id == proj_id, or_(ProjectModel.status == 4, ProjectModel.status == 5)).first()
    if not proj:
        return jsonify({'code': 400, 'msg': 'Project cannot give awards.'})
    # if uid != proj.aid:
    #     return jsonify({'code': 400, 'msg': 'Not auth of this proj.'})
    selection = SelectionModel.query.filter(SelectionModel.sid == sid, SelectionModel.proj_id == proj_id,
                                            SelectionModel.active == 1).first()
    if not selection:
        return jsonify({'code': 400, 'msg': 'Student did not select this project.'})
    file = FileModel.query.filter(FileModel.proj_id == proj_id, FileModel.uid == sid, FileModel.active == 1).first()
    if not file:
        return jsonify({'code': 400, 'msg': 'No file, cannot award.'})
    if not selection.a_feedback and not selection.p_feedback:
        return jsonify({'code': 400, 'msg': 'No feedbacks.'})
    try:
        date_time = get_time()[0]
        if award == 1 and selection.award == 0:
            selection.award = award
            selection.utime = date_time
            stu_msg = add_message(sid, f"Congratulations! Your work in {proj.proj_name} got an award!.")
        elif award == 0 and selection.award == 1:
            selection.award = award
            selection.utime = date_time
            stu_msg = add_message(sid, f"Your award of {proj.proj_name} was canceled.")
        else:
            return jsonify({'code': 400, 'msg': 'No need to change.'})
        auth_msg = add_message(proj.aid,
                               f"Student {student.username} has received award change in project {proj.proj_name}.")
        proposer_msg = add_message(proj.pid,
                                   f"Student {student.username} has received award change in project {proj.proj_name}.")
        if stu_msg and auth_msg and proposer_msg:
            db.session.commit()
            return jsonify({'code': 200, 'msg': 'Change award and send messages successfully.'})
        else:
            return jsonify({'code': 400, 'msg': 'Change award and send messages failed.'})
    except Exception as e:
        return jsonify({'code': 400, 'msg': 'Give award failed.', 'error_msg': str(e)})



def proj_start_end():

    projs = ProjectModel.query.filter(or_(ProjectModel.status == 3, ProjectModel.status == 4)).all()
    if projs:
        for p in projs:
            start = str(p.start_time)
            start_date = start.split(" ")[0]
            end = str(p.close_time)
            end_data = end.split(" ")[0]
            if p.status == 3:
                if check_release(start_date) == 1:
                    p.status = 4
                    db.session.commit()
            else:
                if check_release(end_data) == 1:
                    p.status = 5
                    db.session.commit()

    return jsonify({'code': 200})






