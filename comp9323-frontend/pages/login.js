import { useState, useEffect } from 'react'
import { Input, Button, message ,Modal} from 'antd'
import { UserOutlined, LockOutlined ,MailOutlined} from '@ant-design/icons'
import { Base64 } from 'js-base64'
const md5 = require('js-md5')
import { delCookie ,setCookie} from '../util/cookie'
import {userRegister,userLogin} from "./MockData";
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
     passwordSure : ""
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
    message.success("login was successful");
    window.location.href = "/";
    const time = (new Date()).getTime() + 10*24*60*60*1000;
    setCookie("USER_MESSAGE",JSON.stringify({
      name : _user,
      type : 1,
      token : Base64.encode(`${_user}&&sadasdasdad&&${time}&&1&&${_user}`),
    }),100);
    localStorage.setItem(
      'USER_ACCOUNT',
      Base64.encode(`${_user} || ${_password}`)
    )
    return;
    userLogin({
      userName : _user,
      password : _pass
    }).then(res => {
      if(res.status === 0){
        message.success("login was successful");
         setCookie("USER_MESSAGE",JSON.stringify(res.data || {}),10);
        localStorage.setItem(
          'USER_ACCOUNT',
          Base64.encode(`${_user} || ${_password}`)
        )
      }else{
        message.error(res.msg || "login was fail")
      }
    })
  }
  return (
    <React.Fragment>
      <style dangerouslySetInnerHTML={{ __html: Style }} />
      <div className="login_big_box">
        <div className="loginBox">
          <p>LOGO</p>
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
                changeRegisterVisible(true)
              }}
              className={"register"}>REGISTER</h6>
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
        onOk={() => {
           const {userName,passwordSure,password,email,id} = newUser;
          if(!id || !(id && id.trim())){
            message.warn("Please enter your id");
            return;
          }
          if(!userName || !(userName && userName.trim())){
             message.warn("Please enter your name");
             return;
           }
          if(!email || !(email &&email.trim())){
             message.warn("Please enter your email");
             return;
           }else{
             if(!((email &&email.trim()).match("^([\\w\\.-]+)@([a-zA-Z0-9-]+)(\\.[a-zA-Z\\.]+)$"))){
               message.warn("Please enter a mailbox in the correct format");
               return;
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
           return;
          userRegister({
            id : id.trim(),
            userName : userName.trim(),
            password : _pass,
            email : email.trim()
          }).then(res => {
            if(res.status === 0){
              message.success("register was successful");
              changeRegisterVisible(false);
              changeNewUser({
                id: "",
                userName : "",
                password : "",
                email : "",
                passwordSure : ""
              })
            }else{
              message.error(res.msg)
            }
          })
        }}
        onCancel={() => {
          changeRegisterVisible(false);
          changeNewUser({
            id: "",
            userName : "",
            password : "",
            email : "",
            passwordSure : ""
          })
        }}>
        <div className={"modal_box_login_component"}>
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
                  changeNewUser(_newPageMessage);
                }}
              />
            </div>
          </div>
          <div className="box">
            <h6>Name</h6>
            <div className="switch_box">
              <Input
                value={newUser.userName}
                placeholder="Please enter your username"
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
