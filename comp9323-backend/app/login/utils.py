# 使用hash256 对密码进行加密
import datetime
import functools
import hashlib

import jwt
from flask import request, jsonify, g
from jwt import ExpiredSignatureError, PyJWTError

from config import SECRET_KEY


def EnPassWord(password: str) -> str:
    return hashlib.sha256(password.encode('utf-8')).hexdigest()


# 生成Token
def GenToken(user) -> str:
    dic = {
        'exp': datetime.datetime.now() + datetime.timedelta(hours=2),  # 设置过期时间
        'iat': datetime.datetime.now(),  # 开始时间
        'data': {  # 内容，一般存放该用户id和开始时间
            'id': user.id,
            'username': user.username,
        },
    }
    # 生成token
    token = jwt.encode(dic, SECRET_KEY, algorithm='HS256')
    return token


# 登陆装饰器，用来设置那些需要登陆才能使用
def login_require(func):
    @functools.wraps(func)
    def wrapper(*args, **kwargs):
        # 获取header中的token
        token = request.headers.get('Token')
        # 判断token是否为空
        if not token:
            return jsonify({'code': 401, 'msg': '请传入Token'})
        try:
            # 解析token
            data = jwt.decode(token, SECRET_KEY, algorithms=['HS256'])
        except ExpiredSignatureError as e:
            return jsonify({'code': 401, 'msg': 'token已失效'})
        except PyJWTError as e:
            return jsonify({'code': 401, 'msg': 'token异常'})
        # 将token中的user存入全局变量中
        g.user = data['data']
        return func(*args, **kwargs)

    return wrapper
