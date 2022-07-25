from flask import jsonify, request, g
from sqlalchemy import exists

from app.login.utils import *
from app.models import *


# 登陆函数，登陆逻辑判断
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
    token = generate_token(user)
    return jsonify({'code': 200, 'msg': 'Login successfully.', 'token': token})


def register():
    data = request.get_json(force=True)
    id = data["id"]
    username = data["username"]
    email = data["email"]
    password = data["password"]
    detail = data["detail"]
    print(data)
    if id:
        # student or authority
        print("role == 0 or 1")
        if not username or not email or not password:
            return jsonify({'code': 400, 'msg': 'Have empty content.'})
        user = UserModel.query.filter(UserModel.id == id).first()
        if not user:
            return jsonify({'code': 400, 'msg': 'User has no access to this system.'})
        try:
            # check username and email
            if check_username(username) and check_email(email):
                en_pass = encode_password(password)
                user.username = username
                user.email = email
                user.password = en_pass
                date_time = get_time()[0]
                user.ctime = date_time
                user.utime = date_time
                db.session.commit()
                return jsonify({'code': 200, 'msg': 'Register successfully.'})
            else:
                return jsonify({'code': 400, 'msg': 'Invalid username or email.'})
        except Exception as e:
            return jsonify({'code': 400, 'msg': 'Register failed.', 'error_msg': str(e)})
    else:
        # proposer
        print("role == 2")
        if not username or not email or not password or not detail:
            return jsonify({'code': 400, 'msg': 'Have empty content.'})
        try:
            # check username and email
            if check_username(username) and check_email(email):
                en_pass = encode_password(password)
                date_time = get_time()[0]
                p_num = UserModel.query.filter(UserModel.role == 2).count()
                u_num = UserModel.query.count()
                uid = generate_id("user", u_num+1)
                print("uid", uid)
                temp = random_string(7 - len(str(p_num + 1)))
                pid = "p" + temp + str(p_num + 1)
                print("pid", pid)

                user = UserModel(uid=uid, id=pid, role=2, username=username, email=email, password=en_pass, detail=detail, ctime=date_time, utime=date_time)
                db.session.add(user)
                db.session.commit()
                return jsonify({'code': 200, 'msg': 'Register successfully.'})
            else:
                return jsonify({'code': 400, 'msg': 'Invalid username or email.'})
        except Exception as e:
            return jsonify({'code': 400, 'msg': 'Register failed.', 'error_msg': str(e)})


@login_require
def check_login():
    return jsonify({'code': 200, 'msg': 'Already login.', 'user': g.user})


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
    user = UserModel.query.filter(UserModel.uid == uid, UserModel.active == 1).first()
    if not user:
        return jsonify({'code': 400, 'msg': 'No such user in database.'})

    try:
        msg_list = MessageModel.query.filter(MessageModel.uid == uid, MessageModel.active == 1).all()
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
    msg_id = data["msg_id"]
    msg = MessageModel.query.filter(MessageModel.msg_id == msg_id, MessageModel.read == 0, MessageModel.active == 1).first()
    if not msg:
        return jsonify({'code': 400, 'msg': 'No such unread message in database.'})

    try:
        date_time = get_time()[0]
        msg.read = 1
        msg.utime = date_time
        db.session.commit()
        return jsonify({'code': 200, 'msg': 'Set message read successfully.'})

    except Exception as e:
        return jsonify({'code': 400, 'msg': 'Get messages failed.', 'error_msg': str(e)})

