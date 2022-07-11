import React, { useState, useEffect, useImperativeHandle } from 'react'
import {  message, Modal,Input } from 'antd'
import _ from 'lodash'
import { Base64 } from 'js-base64'
const md5 = require('js-md5')
import { EyeInvisibleOutlined, EyeTwoTone } from '@ant-design/icons'
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
      <Modal
        maskClosable={false}
        visible={visibleModal}
        title={'修改密码'}
        okText="确认"
        cancelText="取消"
        onOk={() => {
          if (!password) {
            message.error('请填写密码')
            return false
          }
          if (password !== passwordCheck) {
            message.error('两次密码不一样，请确认')
            return false
          }
          const pass = Base64.encode(md5(password))
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
        <div className={"AddPageBox"}>
          <div className={"UserAddBox"}>
            <h6 className="w2">密码</h6>
            <div className="inputDiv">
              <Input.Password
                placeholder="密码"
                onChange={(e) => inputChange(e, 'password')}
                value={password}
                iconRender={(visible) =>
                  visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
                }
              />
            </div>
          </div>
          <div className={"UserAddBox"}>
            <h6 className="w4">确认密码</h6>
            <div className="inputDiv">
              <Input.Password
                placeholder="再次输入密码"
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
