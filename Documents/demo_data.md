######   

## View_project (     CA & Proposer)





  CA 只有权限将它变成 approved / failed 权限，  没有变成 open to join / in progress / ended 权限

```json
{
  "proj_id": 132123,
}
```



- project name
- Course name
- Start time / end time
- project description
- course authority name
- course authority email
- Proposer name
- Proposer email
- project status (approved:1   not approved: 2)
- documents



```json
{
    "code": 200,
    "result": {
        "authority_email": null,
        "authority_id": "u00001",
        "authority_name": null,
        "close_time": "Sun, 21 Aug 2022 00:00:00 GMT",
        "course_description": "This course allows students to explore principles, techniques, architectures, and enabling technologies for the development of the different components and layers of complex SaaS systems. ",
        "course_name": "Software as a Service Project",
        "cur_num": 1,
        "description": "hello world",
        "files": [
            {
                "file_name": "COM9323.txt",
                "file_url": "www.file.com",
                "type": "txt",
                "utime": "Thu, 21 Jul 2022 00:00:00 GMT"
            }
        ],
        "max_num": 20,
        "proj_name": "COM9323",
        "proposer_email": "yaxin.su@student.unsw.edu.au",
        "proposer_id": "u00009",
        "proposer_name": "Yaxin Su",
        "start_time": "Thu, 21 Jul 2022 00:00:00 GMT",
        "status": 0
    }
}
```





---

## Change_Project_status



![image-20220720233251944](/Users/shao/Library/Application Support/typora-user-images/image-20220720233251944.png)



```json
#传入
{
  "proj_id": "123213",
  "uid": "1213123"
  # 1 代表 approved， 2 代表 failed
  "status": 1
}
```



1. 判断CA 是否有权限， **即ca 有没有关联到这个project， 如果不是则没有权限修改**， project ： CA = 1 ： N	CA ： project =  N ： 1


2. 判断是不是course 有没有被open

​	course 有没有被public, 只有public 的才能被review 

​	if public : reviewer 就能协助ca修改状态

​	else:  only ca

3. 修改pending 只能 approved 变成 not approved, 剩下的 open join, in Progress. ended 都是另外一个接口
4. 返回 pending 状态 (0/1 int)





## Change_project_status2

1. open join in Progress. ended

   根据start_time, end_time

   start: pending

   Open to join : 手动, 学生只能够在open to jion下选课

   End_time: end






```json
#传入
{
    "proj_id": 1
}
```

```
{
    "code": 200,
    "msg": "modify status to 4 (In Progress) successfully"
}
```



----

## View_comment



- username
- useremail
- Comment



```json
# 传入
{
    "uid":  "u10001",
    "cm_id": "cm00006"
}
```





```json
# return value
{
    "code": 200,
    "result": {
        "posts": [
            {
                "reply_comment": [
                    {
                        "content": "明天",
                        "owner_email": "11391@qq,com",
                        "owner_name": "david",
                        "owner_role": 3,
                        "owner_uid": "u00002",
                        "parent_id": "1",
                        "target_email": "1191@qq,com",
                        "target_name": "jacob",
                        "target_role": 0,
                        "target_uid": "u00001",
                        "utime": "Thu, 21 Jul 2022 00:00:00 GMT"
                    },
                    {
                        "content": "别叫了",
                        "parent_id": " 2",
                        "target_email": "11391@qq,com",
                        "target_name": "david",
                        "target_role": 3,
                        "target_uid": "u00002",
                        "utime": "Thu, 21 Jul 2022 00:00:00 GMT"
                    }
                ],
                "reply_count": 2,
                "root_content": "作业哪天交",
                "root_email": "1191@qq,com",
                "root_id": "1",
                "root_name": "jacob",
                "root_role": 0
            },
            {
                "reply_comment": [],
                "reply_count": 0,
                "root_content": "几号开学",
                "root_email": "1191@qq,com",
                "root_id": "6",
                "root_name": "jacob",
                "root_role": 0
            }
        ],
        "posts_count": 2
    }
}
```



## add_comment

Create楼主的帖子

```
# 传入
{
    "proj_id": "1",
    "uid":  "u10001",
    "content": "hello,u10001"
}
```



```json
# return 
{
    "code": 200,
    "msg": "add comment successfully"
}
```





## reply_comment



```
# 传入
{
    "proj_id": "1",
    "uid":  "u10001",
    "content": "hi student_2, i again",
    "target_uid": "cm00002",
    "parent_id": "u10002",
    "root_id": "cm00001"
}
```



```
# 
{
    "code": 200,
    "msg": "reply comment successfully"
}
```





## delete_comment

```json
# 传入
{
    "uid":  "u10001",
    "cm_id": "cm00006"
}
```



```json
{
    "code": 200,
    "msg": "delete comment successfully"
}
```



---

## Edit_project

CA & Proposer 基本同一个





```json
#传入
{
  "proj_id": "123213"     #只有CA 跟 Proposer 能修改
  "user_id": "1213123"
  # 1 代表 approved， 2 代表 failed
  "statue": 1
}
```





if project_statues != 0 （ 不是pending）: 不能edit

else: 	 



```json
- proj_id
- project_name
- project_description
- Start_time
- End_time
```



- project_name
- project_description
- Start_time
- End_time
- Update_document





## View Works





除了project 信息外， 还有学生交了哪些作业， 针对每个学生给出feedback（feedback单独接口）

- project name
- Course name
- Start time / end time
- project description
- course authority name
- course authority email
- Proposer name
- Proposer email
- project status (approved:1   not approved: 2)
- student_id
- Student_file



## Feedback




针对每个学生给出feedback



```json
{
  "student_id"
  "comment"
  
}
```









------

# Student



##  join / Quit

- join / quit 一个接口就ok
- 0 是 join， 1是quit

```json
#前端传入
{
  "join" ： 0 / 1
}
```



## join / Quit



- join / quit 一个接口就ok
- 0 是 join， 1是quit



```json
#前端传入
{
  "join" ： 0 / 1
}
```





---






### creat a database
```shell
mysql -u root -p
create database pmsys
```
### install package
```shell
pip3 install -r requirement.txt
```

### create tables
```shell
flask db migrate
flask db upgrade
```

### run this project
```shell
python3 app.py runserver
```




# Data



## project

```mysql
INSERT INTO projects
(proj_id,cid,aid,pid,proj_name,description,start_time,close_time,max_num, cur_num, ctime, utime, status)
VALUES
('1','c001','u00001','u00009','COMP9900','hello world2','2022-7-23 08:03:00','2022-7-23 08:05:00',20,1,'2022-7-21','2022-7-21',0);
```

```sql
UPDATE projects SET start_time = '2022-7-23 08:40:00', close_time = '2022-7-23 08:45:00' where proj_id = '1';
```

## course

```mysql
INSERT INTO courses
(cid,name,description,start_time, close_time, public, ctime, utime, active)
VALUES
('c001','comp9900','it project','2022-7-23 08:03:00','2022-7-24 08:03:00',0,'2022-7-23 08:03:00','2022-7-23 08:05:00',0);
```



## file

```mysql
INSERT INTO files
(fid,proj_id,uid,file_name,file_url,type, ctime, utime, active)
VALUES
('1','1','u00001','COM9323.txt','www.file.com','txt','2022-7-21','2022-7-21',1);
```

```mysql
INSERT INTO files
(fid,proj_id,uid,file_name,file_url,type, ctime, utime, active)
VALUES
('2','2','u00001','COM9900.txt','www.file.com','txt','2022-7-23 08:00:00','2022-7-23 08:05:00',1);
```



## USER

```json
UPDATE users SET role = 3 where uid = 'u00008';
```

```mysql
INSERT INTO users
(uid,id,role,username,email, password,detail,ctime, utime, active)
VALUES
('u00001','1','0','jacob','1191@qq,com','0000','wtf','2022-7-21','2022-7-21',1);
```

```mysql
INSERT INTO users
(uid,id,role,username,email, password,detail,ctime, utime, active)
VALUES
('u00009','9','2','randProposer','randProposer@qq,com','0000','wtf','2022-7-21','2022-7-21',1);
```

```mysql
INSERT INTO users
(uid,id,role,username,email, password,detail,ctime, utime, active)
VALUES
('u10001','3','1','student_1','student1@qq,com','0000','wtf','2022-7-21','2022-7-21',1);
```

```
INSERT INTO users
(uid,id,role,username,email, password,detail,ctime, utime, active)
VALUES
('u10002','4','1','student_2','student2@qq,com','0000','wtf','2022-7-21','2022-7-21',1);
```



## Forum

```mysql
INSERT INTO comments
(cm_id,proj_id,owner_uid,target_uid,parent_id,root_id,content, ctime, utime, active)
VALUES
('1','1','u00001',NULL,NULL, '1','作业哪天交','2022-7-21','2022-7-21',1);
```

```
INSERT INTO comments
(cm_id,proj_id,owner_uid,target_uid,parent_id,root_id,content, ctime, utime, active)
VALUES
('2','1','u00002','u00001','1', '1','明天','2022-7-21','2022-7-21',1);
```

```
INSERT INTO comments
(cm_id,proj_id,owner_uid,target_uid,parent_id,root_id,content, ctime, utime, active)
VALUES
('3','1',         'u00003','u00002',  ' 2',   '1','别叫了','2022-7-21','2022-7-21',1);
```

```
INSERT INTO comments
(cm_id,proj_id,owner_uid,target_uid,parent_id,root_id,content, ctime, utime, active)
VALUES
('6','1','u00001',NULL,NULL, '6','几号开学','2022-7-21','2022-7-21',1);
```



## Select

```
INSERT INTO selections
(sel_id,proj_id,sid,a_feedback,p_feedback,award, ctime, utime, active)
VALUES
('1','1','u10001','a: good','p: agrese', 0,'2022-7-21','2022-7-21',1);
```







#### 