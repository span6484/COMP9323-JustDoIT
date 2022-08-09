import { useState, useEffect } from 'react'
import { Input, Button, message ,Modal} from 'antd'
import { UserOutlined, LockOutlined ,MailOutlined} from '@ant-design/icons'
import { Base64 } from 'js-base64'
const md5 = require('js-md5')
import { delCookie ,setCookie} from '../util/cookie'
import {userRegister,userLogin,checkRole} from "./MockData";
import Style from "./login.less"
import _ from "lodash"
const UgcLogin = ({}) => {
  const [user, changeUser] = useState('');
  const [password, changePassword] = useState('');
  const [newUser,changeNewUser] = useState({
     id: "",
     userName : "",
     password : "",
     email : "",
     passwordSure : "",
     detail : "",
     role : "",
     type : 1,
  });
  const [registerVisible, changeRegisterVisible] = useState(false)
  useEffect(() => {
    sessionStorage.removeItem('TAB_PANE')
    delCookie('USER_MESSAGE', null)
    let account = localStorage.getItem('USER_ACCOUNT')
    if (!!account) {
      try {
        account = Base64.decode(account)
        const accountList = account.split(' || ')
        changeUser(accountList[0])
        changePassword(accountList.length > 1 && accountList[1])
      } catch (e) {
        console.log('e', e)
      }
    }
  }, [])
  function inputChange(e, type) {
    if (type === 'user') {
      changeUser(e.target.value)
    } else if (type === 'password') {
      changePassword(e.target.value)
    }
  }
  function login() {
    const _user = user && user.trim() || "";
    const _password = password && password.trim() || "";
    if (!_user) {
      message.error("enter your email or id");
      return false
    }
    if (!_password) {
      message.error('enter your password');
      return false
    }
    const _pass = Base64.encode(md5(_password));
    userLogin({
      id_or_email : _user,
      password : _pass
    }).then(res => {
      if(res.code === 200){
          message.success("login was successful");
          const time = (new Date()).getTime() + 10*24*60*60*1000;
          const {username,email,role,uid} = res.result;
          setCookie("USER_MESSAGE",JSON.stringify({
            name : username,
            type : role,
            role : role,
            uid,
            token : Base64.encode(`${username}&&sadasdasdad&&${time}&&1&&${username}`),
          }),100);
        localStorage.setItem(
          'USER_ACCOUNT',
          Base64.encode(`${_user} || ${_password} || ${username}`)
        )
          window.location.href = "/Dashboard/CourseOverview"
      }else{
        message.error(res.msg || "login was fail")
      }
    })
  }
  function getRole(type){
      switch (type){
          case 0:
              return "Course Authority";
          case 1:
              return "Student";
          case 2:
              return "Proposer";
          case 3:
              return "Reviewer";
          default:
              return  "";
      }
  }
  return (
    <React.Fragment>
      <style dangerouslySetInnerHTML={{ __html: Style }} />
      <div className="login_big_box">
        <div className="loginBox">
          <p>PMSYS</p>
          <div className="loginInputBox">
            <div className="loginImage"/>
            <div>
              <Input
                placeholder="enter your email or id"
                onChange={(e) => inputChange(e, 'user')}
                prefix={<UserOutlined />}
                value={user}
              />
              <Input.Password
                placeholder="enter your password"
                onChange={(e) => inputChange(e, 'password')}
                prefix={<LockOutlined />}
                value={password}
              />
            </div>
            <h6
              onClick={()=>{
                changeRegisterVisible(true);
                  const _newPageMessage = _.clone(newUser);
                  _newPageMessage.type = 1;
                  changeNewUser(_newPageMessage);
              }}
              className={"register"}>STUDENT AND AUTHORITY REGISTER</h6>
              <h6
                  onClick={()=>{
                      changeRegisterVisible(true);
                      const _newPageMessage = _.clone(newUser);
                      _newPageMessage.type = 2;
                      changeNewUser(_newPageMessage);
                  }}
                  className={"register"}>PROPOSER REGISTER</h6>
            <Button type="primary" onClick={() => login()}>
              LOGIN
            </Button>
          </div>
        </div>
      </div>
      <Modal
        visible={registerVisible}
        title={`REGISTER`}
        okText="SUBMIT"
        zIndex={2}
        cancelText="CANCEL"
        width={700}
        onOk={() => {
           const {userName,passwordSure,password,email,id,detail,type} = newUser;
           if(type === 1){
               if(!id || !(id && id.trim())){
                   message.warn("Please enter your id");
                   return;
               }
           }
          if(!userName || !(userName && userName.trim())){
             message.warn("Please enter your name");
             return;
           }
          if(!email || !(email &&email.trim())){
             message.warn("Please enter your email");
             return;
           }else{
              if(!(/^([a-zA-Z0-9_.-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/.test((email &&email.trim())))){
                  message.warn("Please enter your email in the correct format");
                  return
              }
           }
          if(!password || !(password &&password.trim())){
             message.warn("Please enter your password");
             return;
           }
            if(password.length < 6){
              message.warn("Password length is less than six digits");
              return;
            }
           if(password !== passwordSure){
             message.warn("Entered passwords differ!");
             return;
           }
          const _pass = Base64.encode(md5(password.trim()));
          userRegister({
              id : id.trim(),
              username : userName.trim(),
              email : email.trim(),
              password : _pass,
              detail : !!id.trim() ? "" : detail.trim()
          }).then(res => {
            if(res.code === 200){
              message.success("register was successful");
              changeRegisterVisible(false);
              if(newUser.type === 1){
                  changeUser(newUser.id);
              }else{
                  changeUser(newUser.email);
              }
              changePassword("");
              changeNewUser({
                id: "",
                userName : "",
                password : "",
                email : "",
                passwordSure : "",
                detail : "",
                role : "",
                  type : 1
              })
            }else{
              message.error(res.msg)
            }
          })
        }}
        okButtonProps={{
            disabled : !(((newUser.type === 1 && (newUser.role !== undefined && newUser.role !== null &&
            newUser.role !== "")) || (newUser.type === 2 && newUser.detail)) && newUser.userName &&
                newUser.password && newUser.passwordSure && newUser.email )
        }}
        onCancel={() => {
          changeRegisterVisible(false);
          changeNewUser({
            id: "",
            userName : "",
            password : "",
            email : "",
            passwordSure : "",
              detail : "",
              role : ""
          })
        }}>
        <div className={"modal_box_login_component"}>
            {newUser.type === 1 &&
                <div className="box">
                    <h6>ID</h6>
                    <div className="switch_box">
                      <Input
                        value={newUser.id}
                        placeholder="Please enter your ID"
                        prefix={<UserOutlined />}
                        onChange={(e) => {
                          const _value = e.target.value;
                          const _newPageMessage = _.clone(newUser);
                          _newPageMessage.id = _value;
                            _newPageMessage.role = "";
                          changeNewUser(_newPageMessage);
                        }}
                      />
                        <Button
                            onClick={()=>{
                                checkRole({
                                    id : newUser.id
                                }).then(res => {
                                    const _newPageMessage = _.clone(newUser);
                                    if(res.code === 200){
                                        _newPageMessage.role = res.role;
                                    }else{
                                        _newPageMessage.role = "";
                                        message.error(res.msg);
                                    }
                                    changeNewUser(_newPageMessage)
                                }).catch(err => {
                                    const _newPageMessage = _.clone(newUser);
                                    _newPageMessage.role = "";
                                    changeNewUser(_newPageMessage)
                                })
                            }}
                            disabled={!newUser.id}
                            style={{
                                marginLeft : "10px"
                            }}
                            type={"primary"}>CHECK</Button>
                    </div>
                      {
                          newUser.role !== undefined && newUser.role !== null &&
                          newUser.role !== "" &&
                          <div className={"role-type"}>
                              {getRole(newUser.role)}
                          </div>
                      }
                  </div>
            }
          <div className="box">
            <h6>Name</h6>
            <div className="switch_box">
              <Input
                value={newUser.userName}
                placeholder="Please enter your username,example : Jerry Jackson"
                prefix={<UserOutlined />}
                onChange={(e) => {
                  const _value = e.target.value;
                  const _newPageMessage = _.clone(newUser);
                  _newPageMessage.userName = _value;
                  changeNewUser(_newPageMessage);
                }}
              />
            </div>
          </div>
          <div className="box">
            <h6>Email</h6>
            <div className="switch_box">
              <Input
                prefix={<MailOutlined />}
                value={newUser.email}
                placeholder="Please enter your email"
                onChange={(e) => {
                  const _value = e.target.value;
                  const _newPageMessage = _.clone(newUser);
                  _newPageMessage.email = _value;
                  changeNewUser(_newPageMessage)
                }}
              />
            </div>
          </div>
            {newUser.type === 2 &&
                <div className="box">
                <h6>Detail</h6>
                <div className="switch_box">
                    <Input.TextArea

                        value={newUser.detail}
                        placeholder="Please enter your detail"
                        onChange={(e) => {
                            const _value = e.target.value;
                            const _newPageMessage = _.clone(newUser);
                            _newPageMessage.detail = _value;
                            changeNewUser(_newPageMessage)
                        }}
                    />
                </div>
            </div>}
          <div className="box">
            <h6>Password</h6>
            <div className="switch_box">
              <Input.Password
                prefix={<LockOutlined />}
                value={newUser.password}
                placeholder="Please enter your password"
                onChange={(e) => {
                  const _value = e.target.value;
                  const _newPageMessage = _.clone(newUser);
                  _newPageMessage.password = _value;
                  changeNewUser(_newPageMessage)
                }}
              />
            </div>
          </div>
          <div className="box">
            <h6>Check Password</h6>
            <div className="switch_box">
              <Input.Password
                prefix={<LockOutlined />}
                value={newUser.passwordSure}
                placeholder="Please check your password"
                onChange={(e) => {
                  const _value = e.target.value;
                  const _newPageMessage = _.clone(newUser);
                  _newPageMessage.passwordSure = _value;
                  changeNewUser(_newPageMessage);
                }}
              />
            </div>
          </div>
        </div>
      </Modal>
      </React.Fragment>
  )
}

UgcLogin.getInitialProps = async (status) => {
  return {
    stateMessage: {}
  }
}

export default UgcLogin
