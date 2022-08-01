from flask import jsonify, request, g
from sqlalchemy import exists
from app.login.utils import *
from app.models import *


def login():
    data = request.get_json(force=True)
    id_or_email = data["id_or_email"]
    password = data["password"]

    if not id_or_email:
        return jsonify({'code': 400, 'msg': 'Please enter id or email.'})
    if not password:
        return jsonify({'code': 400, 'msg': 'Please enter password.'})
    if '@' in id_or_email:
        user = UserModel.query.filter(UserModel.email == id_or_email).first()
    else:
        user = UserModel.query.filter(UserModel.id == id_or_email).first()
    if not user:
        return jsonify({'code': 400, 'msg': 'Wrong id or email.'})

    # 使用hash256加密密码
    en_pass = encode_password(password)
    if en_pass != user.password:
        return jsonify({'code': 400, 'msg': 'Wrong password.'})
    # token = generate_token(user)
    result = {"uid": user.uid, "role": user.role, "username":user.username, "email": user.email}
    return jsonify({'code': 200, 'msg': 'Login successfully.', 'result': result})


def register():
    data = request.get_json(force=True)
    id = data["id"]
    username = data["username"]
    if not check_username(username):
        return jsonify({'code': 400, 'msg': 'Invalid username, which can only contains A-Z, a-z, _, -, and space.'})
    email = data["email"]
    if not check_email(email):
        return jsonify({'code': 400, 'msg': 'Invalid email.'})
    same_email = db.session.query(exists().where(UserModel.email == email, UserModel.active == 1)).scalar()
    if same_email:
        return jsonify({'code': 400, 'msg': 'This email address has been used.'})
    password = data["password"]
    detail = data["detail"]
    if not username or not email or not password:
        return jsonify({'code': 400, 'msg': 'Have empty content.'})
    print(data)
    if id:
        # student or authority
        print("role == 0 or 1")
        user = UserModel.query.filter(UserModel.id == id, UserModel.active == 0).first()
        if not user:
            return jsonify({'code': 400, 'msg': 'User has no access to this system.'})
        try:
            en_pass = encode_password(password)
            user.username = username
            user.email = email
            user.password = en_pass
            date_time = get_time()[0]
            user.ctime = date_time
            user.utime = date_time
            user.active = 1
            db.session.commit()
            return jsonify({'code': 200, 'msg': 'Register successfully.'})

        except Exception as e:
            return jsonify({'code': 400, 'msg': 'Register failed.', 'error_msg': str(e)})
    else:
        # proposer
        print("role == 2")
        if not detail:
            return jsonify({'code': 400, 'msg': 'Please introduce your organization or company.'})
        try:
            # check username and email
            en_pass = encode_password(password)
            date_time = get_time()[0]
            p_num = UserModel.query.filter(UserModel.role == 2).count()
            u_num = UserModel.query.count()
            uid = generate_id("user", u_num+1)
            print("uid", uid)
            temp = random_string(7 - len(str(p_num + 1)))
            pid = "p" + temp + str(p_num + 1)
            print("pid", pid)

            user = UserModel(uid=uid, id=pid, role=2, username=username, email=email, password=en_pass,
                             detail=detail, ctime=date_time, utime=date_time, active=1)
            db.session.add(user)
            db.session.commit()
            return jsonify({'code': 200, 'msg': 'Register successfully.'})
        except Exception as e:
            return jsonify({'code': 400, 'msg': 'Register failed.', 'error_msg': str(e)})


@login_require
def check_login():
    return jsonify({'code': 200, 'msg': 'Already login.', 'user': g.user})


def check_role():
    data = request.get_json(force=True)
    id = data["id"]
    user = UserModel.query.filter(UserModel.id == id, UserModel.active == 1).first()
    if not user:
        return jsonify({'code': 400, 'msg': 'No such user in database.'})
    return jsonify({'code': 200, 'role': user.role})


def add_message(uid, content):
    user = UserModel.query.filter(UserModel.uid == uid, UserModel.active == 1).first()
    if not user or not content:
        return 0

    msg_num = MessageModel.query.count()
    msg_id = generate_id("message", msg_num+1)
    data_time = get_time()[0]

    msg = MessageModel(msg_id=msg_id, uid=uid, content=content, read=0, ctime=data_time, utime=data_time, active=1)
    db.session.add(msg)
    db.session.commit()
    return 1


def get_message():
    data = request.get_json(force=True)
    uid = data["uid"]
    read = data["read"]
    user = UserModel.query.filter(UserModel.uid == uid, UserModel.active == 1).first()
    if not user:
        return jsonify({'code': 400, 'msg': 'No such user in database.'})

    try:
        if read == 0:
            msg_list = MessageModel.query.filter(MessageModel.uid == uid, MessageModel.active == 1).all()
        elif read == 1:
            msg_list = MessageModel.query.filter(MessageModel.uid == uid, MessageModel.read == 1,
                                                 MessageModel.active == 1).all()
        elif read == 2:
            msg_list = MessageModel.query.filter(MessageModel.uid == uid, MessageModel.read == 0,
                                                 MessageModel.active == 1).all()
        else:
            return jsonify({'code': 400, 'msg': 'Invalid read number.'})
        if not msg_list:
            return jsonify({'code': 200, 'msg': 'Empty message list.'})
        result_list = []
        for msg in msg_list:
            msg_dict = {"msg_id":msg.msg_id, "content": msg.content, "read": msg.read, "ctime": msg.ctime}
            result_list.append(msg_dict)
        result = {"count": len(result_list), "list": result_list}
        return jsonify({'code': 200, 'result': result})

    except Exception as e:
        return jsonify({'code': 400, 'msg': 'Get messages failed.', 'error_msg': str(e)})


def set_message_read():
    data = request.get_json(force=True)

    uid = data["uid"]
    user = UserModel.query.filter(UserModel.uid == uid, UserModel.active == 1).first()
    if not user:
        return jsonify({'code': 400, 'msg': 'No such user in database.'})

    msg_id = data["msg_id"]
    msg = MessageModel.query.filter(MessageModel.msg_id == msg_id, MessageModel.uid == uid, MessageModel.read == 0,
                                    MessageModel.active == 1).first()
    if not msg:
        return jsonify({'code': 400, 'msg': 'No such unread message for this user.'})

    try:
        date_time = get_time()[0]
        msg.read = 1
        msg.utime = date_time
        db.session.commit()
        return jsonify({'code': 200, 'msg': 'Set message read successfully.'})

    except Exception as e:
        return jsonify({'code': 400, 'msg': 'Set message read failed.', 'error_msg': str(e)})


def delete_message():
    data = request.get_json(force=True)

    uid = data["uid"]
    user = UserModel.query.filter(UserModel.uid == uid, UserModel.active == 1).first()
    if not user:
        return jsonify({'code': 400, 'msg': 'No such user in database.'})

    msg_id = data["msg_id"]
    msg = MessageModel.query.filter(MessageModel.msg_id == msg_id, MessageModel.uid == uid, MessageModel.active == 1).first()
    if not msg:
        return jsonify({'code': 400, 'msg': 'No such message for this user.'})

    try:
        date_time = get_time()[0]
        msg.active = 0
        msg.utime = date_time
        db.session.commit()
        return jsonify({'code': 200, 'msg': 'Delete message successfully.'})

    except Exception as e:
        return jsonify({'code': 400, 'msg': 'Delete messages failed.', 'error_msg': str(e)})


def get_awards():
    data = request.get_json(force=True)
    uid = data["uid"]
    user = UserModel.query.filter(UserModel.uid == uid, UserModel.active == 1).first()
    if not user:
        return jsonify({'code': 400, 'msg': 'No such user in database.'})

    awards = SelectionModel.query.filter(SelectionModel.award == 1, SelectionModel.active == 1).all()
    if not awards:
        return jsonify({'code': 200, 'msg': 'No awarded projects.'})
    try:
        # Course_name, Proj_name, Course_auth, Proposer, Student, Work_id
        result_list = []
        recent_awards = awards
        if len(awards) > 10:
            recent_awards = awards[len(awards)-10:]
        for a_p in recent_awards:
            proj = ProjectModel.query.filter(ProjectModel.proj_id == a_p.proj_id, ProjectModel.status == 5).first()
            if proj:
                course = CourseModel.query.filter(CourseModel.cid == proj.cid, CourseModel.active == 1).first()
                a = UserModel.query.filter(UserModel.uid == proj.aid, UserModel.active == 1).first()
                p = UserModel.query.filter(UserModel.uid == proj.pid, UserModel.active == 1).first()
                s = UserModel.query.filter(UserModel.uid == a_p.sid, UserModel.active == 1).first()
                work = FileModel.query.filter(FileModel.proj_id == a_p.proj_id, FileModel.uid == a_p.sid, FileModel.active == 1).first()
                if not course or not a or not p or not s or not work:
                    print(f"{a_p.proj_id} has invalid attribute.")
                    continue
                temp_dict = {"proj_name": proj.proj_name, "course_name": course.name, "course_auth": a.username,
                             "proposer": p.username, "student": s.username, "work_id": work.fid}
                result_list.append(temp_dict)
            else:
                print(f"Invalid proj_id {a_p.proj_id}.")
                continue
        result = {"count": len(result_list), "result_list": result_list}
        return jsonify({'code': 200, 'result': result})

    except Exception as e:
        return jsonify({'code': 400, 'msg': 'Get awards failed.', 'error_msg': str(e)})
