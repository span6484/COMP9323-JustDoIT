import pymysql
import xlrd
import datetime
from openpyxl.reader.excel import load_workbook
from builtins import int

import random
import time
conn = pymysql.connect(host='localhost', user='root', passwd='qwer1234', db="pmsys")
cur = conn.cursor()
# cur.execute(sql)
# conn.commit()


def random_string(num) -> str:
    a = random.sample('0123456789', num)
    return ''.join(a)


def get_time():

    time_stamp = time.localtime(time.time())  # 132131232434
    time_form = time.strftime('%Y-%m-%d %H:%M:%S', time_stamp)  # 2022-6-27 12:13:00

    time_stamp = int(time.mktime(time_stamp))
    return [time_form, time_stamp]


def get_unique_id():
    time_stamp = get_time()[1]
    uniqueId = str(random_string(10)) + str(time_stamp)
    return uniqueId


workbook = load_workbook("./cu_data.xlsx")
sheets = workbook.get_sheet_names()
print(sheets)

# insert courses
courses_sheet = workbook.get_sheet_by_name(sheets[0])
print(courses_sheet)
for row in courses_sheet.rows:
    attr_temp = []
    for cell in row:
        attr_temp.append(cell.value)
    # print(attr_temp)
    datetime = get_time()[0]
    # key: cid
    # name, description, start_time, close_time, public(默认0，找reviewer设置1), ctime, utime, active
    course_attrs = [attr_temp[0], attr_temp[1], attr_temp[2], attr_temp[3], attr_temp[4], 0, datetime, datetime, 1]
    print(course_attrs)
    cur.execute(
        "insert into courses(cid, name, description, start_time, close_time, public, ctime, utime, active)"
        "value(%s, %s, %s, %s, %s, %s, %s, %s, %s)",
        course_attrs)

# insert users
users_sheet = workbook.get_sheet_by_name(sheets[1])
print(users_sheet)
i = 0
for row in users_sheet.rows:
    attr_temp = []
    for cell in row:
        attr_temp.append(cell.value)
    datetime = get_time()[0]
    role = int(attr_temp[1])
    if role == 0 or role == 3:
        r = 'a'
    elif role == 1:
        r = 's'
    else:
        print("Wrong role.")
        break
    # key: uid
    # id, role, username, email, password, detail, ctime, utime, active
    i = i + 1
    temp = random_string(7 - len(str(i)))
    id = r + temp + str(i)
    user_attrs = [attr_temp[0], id, role, None, None, None, None, datetime, datetime, 0]
    print(user_attrs)
    cur.execute(
        "insert into users(uid, id, role, username, email, password, detail, ctime, utime, active)"
        "value(%s, %s, %s, %s, %s, %s, %s, %s, %s, %s)",
        user_attrs)

# insert course-user
cu_sheet = workbook.get_sheet_by_name(sheets[2])
print(cu_sheet)
for row in cu_sheet.rows:
    attr_temp = []
    for cell in row:
        attr_temp.append(cell.value)
    # print(attr_temp)
    datetime = get_time()[0]
    # key: cuid
    # foreign key: cid, uid(user.role = 0, 1)
    # ctime, utime, active

    cu_attrs = [attr_temp[0], attr_temp[1], attr_temp[2], datetime, datetime, 1]
    # print(cu_attrs)
    cur.execute(
        "insert into course_user(cu_id, cid, uid, ctime, utime, active)"
        "value(%s, %s, %s, %s, %s, %s)",
        cu_attrs)

cur.close()
conn.commit()
conn.close()
