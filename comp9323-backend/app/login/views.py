from flask import jsonify, request, g
from sqlalchemy import exists

from app.login.utils import login_require, EnPassWord, GenToken
from app.models import UserModel, db


# 登陆函数，登陆逻辑判断
def login():
    username = request.json.get('username')
    password = request.json.get('password')
    if not username or not password:
        return jsonify({'code': 400, 'msg': '请输入帐号密码'})
    user = UserModel.query.filter(UserModel.username == username).first()
    if not user:
        return jsonify({'code': 400, 'msg': '用户不存在'})

    # 使用hash256加密密码
    en_pass = EnPassWord(password)
    if en_pass != user.password:
        return jsonify({'code': 400, 'msg': '用户密码错误'})
    token = GenToken(user)
    return jsonify({'code': 200, 'msg': '登陆成功', 'token': token})


def register():
    username = request.json.get('username')
    password = request.json.get('password')
    if not username or not password:
        return jsonify({'code': 400, 'msg': '请输入帐号密码'})

    # 检查用户是否存在
    check = db.session.query(
        exists().where(UserModel.username == username)
    ).scalar()
    if check:
        return jsonify({'code': 400, 'msg': '用户已存在'})
    try:
        en_pass = EnPassWord(password)
        user = UserModel(username=username, password=en_pass)
        db.session.add(user)
        db.session.commit()
        return jsonify({'code': 200, 'msg': '注册成功'})
    except Exception as e:
        return jsonify({'code': 400, 'msg': '注册异常', 'error_msg': str(e)})


@login_require
def check_login():
    return jsonify({'code': 200, 'msg': '已登陆', 'user': g.user})

