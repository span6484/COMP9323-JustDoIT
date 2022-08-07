# 使用hash256 对密码进行加密
import datetime
import functools
import hashlib
import time
import re
import jwt
import random
from flask import request, jsonify, g
from jwt import ExpiredSignatureError, PyJWTError

from config import SECRET_KEY


def encode_password(password: str) -> str:
    return hashlib.sha256(password.encode('utf-8')).hexdigest()


# 生成Token
def generate_token(user) -> str:
    dic = {
        'exp': datetime.datetime.now() + datetime.timedelta(hours=2),  # 设置过期时间
        'iat': datetime.datetime.now(),  # 开始时间
        'data': {  # 内容，一般存放该用户id和开始时间
            'id': user.uid,
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


def get_time():

    time_stamp = time.localtime(time.time())  # 132131232434
    time_form = time.strftime('%Y-%m-%d %H:%M:%S', time_stamp)  # 2022-6-27 12:13:00

    time_stamp = int(time.mktime(time_stamp))
    return [time_form, time_stamp]


def check_email(email):
    pattern = re.compile("^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$")
    if 7 < len(email) < 60:
        if pattern.match(email) is not None:
            return 1
    return 0


def check_username(username):
    # pattern = re.compile("^[A-Z][a-z]+[ ]([A-Z][a-z]+[ ])*[A-Z][a-z]+$")
    pattern = re.compile("^[A-Za-z0-9_ -]+$")
    if 3 < len(username) < 200:
        if pattern.match(username) is not None:
            return 1
    return 0


def generate_id(type, num):
    if type == "user":
        uid = "u" + "%05d" % num
        return uid
    elif type == "requirement":
        rid = "r" + "%05d" % num
        return rid
    elif type == "project":
        proj_id = "proj" + "%05d" % num
        return proj_id
    elif type == "file":
        fid = "f" + "%05d" % num
        return fid
    elif type == "comment":
        cm_id = "cm" + "%05d" % num
        return cm_id
    elif type == "selection":
        sel_id = "sel" + "%05d" % num
        return sel_id
    elif type == "message":
        msg_id = "msg" + "%05d" % num
        return msg_id
    else:
        return None


def random_string(num):
    a = random.sample('0123456789', num)
    return ''.join(a)


# list(year, month, day) list:int
# argv: string  "2021-07-08"
def time_list(time):
    st_lst = time.split('-')
    result = list()
    for i in st_lst:
        result.append(int(i))
    return result

def check_release(release_data):
    time_stamp = time.localtime(time.time())  # 132131232434
    now = time.strftime('%Y-%m-%d', time_stamp)
    # now = getTime[0]
    nowlist = now.split("-")
    release_data.strip()
    if " " in release_data:
        new_release = release_data.split(" ")[0]
        release_data = new_release
    release_datalist = release_data.split("-")

    #check year
    if int(nowlist[0]) < int(release_datalist[0]):
        return 0
    elif int(nowlist[0]) == int(release_datalist[0]):
        # check month
        if int(nowlist[1]) < int(release_datalist[1]):
            return 0
        elif int(nowlist[1]) == int(release_datalist[1]):
            # check day
            if int(nowlist[2]) < int(release_datalist[2]):
                return 0
            else:
                return 1
        else:
            return 1
    else:
        return 1
