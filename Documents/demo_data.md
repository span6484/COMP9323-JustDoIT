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