import React, { useState, useEffect, useImperativeHandle } from 'react'
import {  message, Modal,Input } from 'antd'
import _ from 'lodash'
import { Base64 } from 'js-base64'
const md5 = require('js-md5')
import { EyeInvisibleOutlined, EyeTwoTone } from '@ant-design/icons'
import changePassWordStyle from "./ChangePassword.less"
const ChangePasswordComponent = ({ changePasswordRef,authorId ,userName}) => {
  const [visibleModal,changeVisible] = useState(false)
  const [password, changePassword] = useState('')
  const [passwordCheck, changePasswordCheck] = useState('')
  const [authorMsg] = useState(authorId || "")
  function inputChange(e, type) {
    if (type === 'password') {
      changePassword(e.target.value)
    } else if (type === 'passwordCheck') {
      console.log(e.target.value)
      changePasswordCheck(e.target.value)
    }
  }
  useImperativeHandle(changePasswordRef, () => ({
    showMessage: () => {
      showMessage()
    }
  }))
  function showMessage() {
    changePassword("");
    changePasswordCheck("");
    changeVisible(true)
  }
  return (
    <div>
      <style dangerouslySetInnerHTML={{
        __html : changePassWordStyle
      }}/>
      <Modal
        maskClosable={false}
        visible={visibleModal}
        title={'CHANGE PASSWORD'}
        okText="SUBMIT"
        cancelText="CANCEL"
        onOk={() => {
          if(!password || !(password &&password.trim())){
            message.warn('Please enter your new password')
            return false
          }
          if(password.length < 6){
            message.warn("Password length is less than six digits");
            return;
          }
          if (password !== passwordCheck) {
            message.warn('Entered passwords differ!')
            return false
          }
          const pass = Base64.encode(md5(password.trim()))
          const json = {
            id : authorMsg.id,
            password: pass,
            editType : "2"
          }
        }}
        onCancel={() => {
          changeVisible(false)
          changePassword( '')
          changePasswordCheck( '')
        }}>
        <div className={"AddPageBoxChangePassword"}>
          <div className={"UserAddBox"}>
            <h6 >Password</h6>
            <div className="inputDiv">
              <Input.Password
                placeholder="Please enter your new password"
                onChange={(e) => inputChange(e, 'password')}
                value={password}
                iconRender={(visible) =>
                  visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
                }
              />
            </div>
          </div>
          <div className={"UserAddBox"}>
            <h6 >Check Password</h6>
            <div className="inputDiv">
              <Input.Password
                placeholder="Please enter your new password again"
                onChange={(e) => inputChange(e, 'passwordCheck')}
                value={passwordCheck}
                iconRender={(visible) =>
                  visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
                }
              />
            </div>
          </div>
        </div>
      </Modal>
    </div>
  )
}

export default ChangePasswordComponent
