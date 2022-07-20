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

    if not id or not username or not email or not password:
        return jsonify({'code': 400, 'msg': 'Have empty content.'})

    # check if user exist
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


@login_require
def check_login():
    return jsonify({'code': 200, 'msg': 'Already login.', 'user': g.user})
