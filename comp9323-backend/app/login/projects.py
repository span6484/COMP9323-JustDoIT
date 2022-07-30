from flask import jsonify, request, g
from sqlalchemy import exists
from datetime import datetime as dt
from app.login.utils import *
from app.models import *
from sqlalchemy import or_, and_, not_
from app.login.views import *
# view project details
def view_project():
    data = request.get_json(force=True)
    result = {}
    proj_id = data["proj_id"]

    proj = ProjectModel.query.filter(ProjectModel.proj_id == proj_id).first()
    if not proj:
        return jsonify({'code': 400, 'msg': 'not related project'})

    cid = proj.cid
    course = CourseModel.query.filter(CourseModel.cid == cid, CourseModel.active == 1).first()
    if not course:
        return jsonify({'code': 400, 'msg': 'not related course'})

    aid = proj.aid
    authority = UserModel.query.filter(UserModel.uid == aid, UserModel.role == 0).first()
    if not authority:
        return jsonify({'code': 400, 'msg': 'no course authority'})

    pid = proj.pid      # proposer_id
    proposer = UserModel.query.filter(UserModel.uid == pid, UserModel.role == 2).first()
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
    user = UserModel.query.filter(UserModel.uid == uid, UserModel.active == 1).first()
    if not user:
        return jsonify({'code': 400, 'msg': 'not related user'})

    course_id = proj.cid
    course = CourseModel.query.filter(CourseModel.cid == course_id, CourseModel.active == 1).first()
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
    course = CourseModel.query.filter(CourseModel.cid == course_id, CourseModel.active == 1).first()
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
    posts = CommentModel.query.filter(CommentModel.proj_id == proj_id, CommentModel.root_id == root_id, CommentModel.cm_id != root_id, CommentModel.active == 1).order_by(CommentModel.utime).all()
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
    proj = ProjectModel.query.filter(ProjectModel.proj_id == proj_id).first()
    if not proj:
        return jsonify({'code': 400, 'msg': 'not related project'})
    comments = CommentModel.query.filter(CommentModel.proj_id == proj_id, CommentModel.active == 1).order_by(CommentModel.utime).all()

    if not comments:
        return jsonify({'code': 400, 'msg': 'no related comment'})
    result = {}
    # 层主
    posts = CommentModel.query.filter(CommentModel.proj_id == proj_id, CommentModel.target_uid == None,CommentModel.parent_id == None, CommentModel.active == 1).order_by(CommentModel.utime).all()
    post_lst = []
    count = 0
    for post in posts:
        post_info = {}
        root_id = post.root_id  # get poster id
        root_usr_info = show_usr_info(post.owner_uid) # username, email, role
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
    proj = ProjectModel.query.filter(ProjectModel.proj_id == proj_id).first()
    if not proj:
        return jsonify({'code': 400, 'msg': 'not related project'})
    cid = proj.cid
    course = CourseModel.query.filter(CourseModel.cid == cid, CourseModel.active == 1).first()
    if not course:
        return jsonify({'code': 400, 'msg': 'not related course'})
    ## users json
    usr = UserModel.query.filter(UserModel.uid == uid, UserModel.active == 1).first()
    if not usr :
        return jsonify({'code': 400, 'msg': 'not related user'})

    user = ProjectModel.query.filter(or_(ProjectModel.aid == uid, ProjectModel.pid == uid)).first()
    is_user_exist = False
    if user:
        is_user_exist = True
    else:
        user = SelectionModel.query.filter(SelectionModel.sid == uid, SelectionModel.proj_id == proj_id, SelectionModel.active == 1).first()
        if user:
            is_user_exist = True
    if not is_user_exist:
        return jsonify({'code': 400, 'msg': 'no related user exist, please check CA, proposer, or student link to this project'})

    ## content json
    if not content or content.isspace():
        return jsonify({'code': 400, 'msg': 'content is empty'})
    try:
        cm_num = CommentModel.query.count()
        cm_id = generate_id("comment", cm_num + 1)
        date_time = get_time()[0]
        comment = CommentModel(cm_id = cm_id ,proj_id = proj_id ,owner_uid = uid,target_uid = None,parent_id = None,root_id = cm_id,content=content,ctime=date_time, utime=date_time, active = 1)
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

    # determine the project json data
    proj = ProjectModel.query.filter(ProjectModel.proj_id == proj_id).first()
    if not proj:
        return jsonify({'code': 400, 'msg': 'not related project'})
    cid = proj.cid
    course = CourseModel.query.filter(CourseModel.cid == cid, CourseModel.active == 1).first()
    if not course:
        return jsonify({'code': 400, 'msg': 'not related course'})
    ## users json
    usr = UserModel.query.filter(UserModel.uid == uid, UserModel.active == 1).first()
    if not usr :
        return jsonify({'code': 400, 'msg': 'not related user'})
    user = ProjectModel.query.filter(or_(ProjectModel.aid == uid, ProjectModel.pid == uid)).first()
    is_user_exist = False
    if user:
        is_user_exist = True
    else:
        user = SelectionModel.query.filter(SelectionModel.sid == uid, SelectionModel.proj_id == proj_id, SelectionModel.active == 1).first()
        if user:
            is_user_exist = True
    if not is_user_exist:
        return jsonify({'code': 400, 'msg': 'no related user exist'})

    ## content json
    if not content or content.isspace():
        return jsonify({'code': 400, 'msg': 'content is empty'})
    print(target_uid)
    ## root exist
    root = CommentModel.query.filter(CommentModel.root_id == root_id, CommentModel.active == 1).order_by(CommentModel.utime).all()
    if not root:
        return jsonify({'code': 400, 'msg': 'no root comment'})
    try:
        cm_num = CommentModel.query.count()
        cm_id = generate_id("comment", cm_num + 1)
        date_time = get_time()[0]
        comment = CommentModel(cm_id = cm_id ,proj_id = proj_id ,owner_uid = uid,target_uid = target_uid,parent_id = parent_id,root_id = root_id,content=content,ctime=date_time, utime=date_time, active = 1)
        db.session.add(comment)
        db.session.commit()
        add_comment()
        msg = add_message(uid, "You have one unread message")

        return jsonify({'code': 200, 'msg': 'reply comment successfully'})
    except Exception as e:
        return jsonify({'code': 400, 'msg': 'reply comment failed.', 'error_msg': str(e)})


def delete_comment() :
    data = request.get_json(force=True)
    uid = data["uid"]
    cm_id = data["cm_id"]
    comments = CommentModel.query.filter(CommentModel.cm_id == cm_id,CommentModel.owner_uid == uid, CommentModel.active == 1).order_by(CommentModel.utime).first()
    if not comments:
        return jsonify({'code': 400, 'msg': 'not related comments'})
    usr = UserModel.query.filter(UserModel.uid == uid, UserModel.active == 1).first()
    if not usr :
        return jsonify({'code': 400, 'msg': 'not related user'})
    # poster
    date_time = get_time()[0]
    if comments.target_uid is None and comments.parent_id is None :
        reply_comments = CommentModel.query.filter(CommentModel.root_id == cm_id ,CommentModel.active == 1).all()

        if reply_comments :
            for reply_comment in reply_comments:
                reply_comment.active = 0
                reply_comment.utime = date_time
                db.session.commit()

    related_comments = CommentModel.query.filter(CommentModel.parent_id == cm_id ,CommentModel.active == 1).all()
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
    result = {}
    proj_id = data["proj_id"]
    proj_name = data["proj_name"]
    description = data["description"]
    start_time = data["start_time"]
    close_time = data["close_time"]
    uid = data["uid"]
    status = data["status"]
    proj = ProjectModel.query.filter(ProjectModel.proj_id == proj_id).first()
    if not proj:
        return jsonify({'code': 400, 'msg': 'not related project'})

    user = UserModel.query.filter(UserModel.uid == uid, UserModel.active == 1).first()
    if not user :
        return jsonify({'code': 400, 'msg': 'not related user'})

    cid = proj.cid
    course = CourseModel.query.filter(CourseModel.cid == cid, CourseModel.active == 1).first()
    if not course:
        return jsonify({'code': 400, 'msg': 'not related course'})

    user = ProjectModel.query.filter(or_(ProjectModel.aid == uid, ProjectModel.pid == uid)).first()
    if not user:
        return jsonify({'code': 400, 'msg': 'no related user exist, Only CA or proposer has access'})

    # files = FileModel.query.filter(FileModel.proj_id == proj_id, FileModel.active == 1).all()
    try:
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
            proj.start_time = dt(start_time_lst[0],start_time_lst[1], start_time_lst[2])
            is_changed = True
        if end_time:
            end_time_lst = time_list(end_time)
            proj.start_time = dt(end_time_lst[0],end_time_lst[1], end_time_lst[2])
            is_changed = True
        if status:
            proj.status = status
            is_changed = True
        if is_changed:
            date_time = get_time()[0]
            proj.utime = date_time
        db.session.commit()
        return jsonify({'code': 200, 'msg': 'modify successfully'})

    except Exception as e:
        return jsonify({'code': 400, 'msg': 'edit project failed.', 'error_msg': str(e)})






