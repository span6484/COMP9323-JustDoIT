import React, { useImperativeHandle, useRef, useState } from 'react'
import { Menu, message, Modal, Popover } from 'antd'
import IconFont from '../IconFont'
import { ExclamationCircleOutlined } from '@ant-design/icons'
import ChangePasswordComponent from  "../ChangePassword"
import TabTopStyle from "./TabTop.less"
const getMenuDom = (subMenuJSon) => {
  if (!subMenuJSon || subMenuJSon.length === 0) {
    return ''
  }
  return (
    subMenuJSon &&
    subMenuJSon.map((item) => {
      return (
        <Menu.Item
          key={item.value}
          icon={<IconFont type={item.type} style={null} />}>
          {item.name}
        </Menu.Item>
      )
    })
  )
}
const initLab = (tabPaneInit) => {
  tabPaneInit('/courseSelection/list')
}
const seletedChange = (e, fatherSubMenu, tabPaneInit) => {
  const { key } = e
  for (let i = 0; i < fatherSubMenu.length; i++) {
    const _fatherSubMenu = fatherSubMenu[i]
    const _value = _fatherSubMenu.value
    if (key === _value) {
      tabPaneInit(_fatherSubMenu.page || _fatherSubMenu.child[0].page)
      break
    }
  }
}

const IndexTabTop = ({ msg, tabPaneInit, loginOut , topRef }) => {
  const changePasswordRef = useRef();
  const { defaultOpenKeysList, userMessage, fatherSubMenu, reward } = msg;
  const [initMsg,changeInitMsg] = useState(userMessage)
  const { loginType, name ,nameText} = initMsg
  function login(type) {
    if (loginType === 'loginOut' || type === 'loginOut') {
      loginOut()
    }
  }
  function getCount() {
    if (!reward) {
      return 0
    }
    let count = 0
    for (let i = 0; i < reward.length; i++) {
      count += reward[i].count || 0
    }
    return count
  }
  function setWidth() {
    if (typeof window !== 'undefined') {
      return window.innerWidth * 0.15
    }
    return 0
  }
  useImperativeHandle(topRef, () => ({
    changeUserMsg: (userMsg) => {
      changeInitMsg(userMsg)
    },
  }))
  return (
    <React.Fragment>
      <style dangerouslySetInnerHTML={{ __html: TabTopStyle }} />
    <div className="lineTopStyle">
      <div className={"ImageDivStyle"} onClick={() => initLab(tabPaneInit)}>
        <p>LOGO</p>
      </div>
      <Menu
        mode="horizontal"
        defaultOpenKeys={defaultOpenKeysList}
        onClick={(e) => seletedChange(e, fatherSubMenu, tabPaneInit)}
        selectedKeys={defaultOpenKeysList}
        style={{ borderBottom: 'none', width: '75%' }}>
        {getMenuDom(fatherSubMenu)}
      </Menu>
      <Popover
        placement="bottom"
        title={() => {
          return <span>个人信息</span>
        }}
        content={() => {
          return (
            <ul className={"PopoverRightTop"}>
              <ul style={{
                width: setWidth()+ 'px',
                margin : 0,
                padding:0,
                border:"none"
              }}>
                <li
                  style={{
                    border: 'none'
                  }}
                  key={'userReward'}
                >
                  {' '}
                  积分：
                  <span
                    style={{
                      color: '#1890ff',
                    }}>
                    {getCount()}
                  </span>
                  分
                  <div style={{
                    width:"90%",
                    marginLeft : "5%",
                    height:"1px",
                    backgroundColor: "#efefef"
                  }}/>
                </li>
                <li
                  onClick={()=>{
                    changePasswordRef.current?.showMessage()
                  }}
                  style={{
                  border: 'none'
                }}>
                  修改密码
                </li>
              </ul>
            </ul>
          )
        }}
        trigger="click">
        <div className={"LoginDivStyle"} title="个人信息" onClick={() => login(null)}>
          <h6>
            {loginType === 'loginOut'
              ? '请登录，谢谢'
              : loginType === 'loginIn'
              ? `欢迎登陆，${nameText || name}`
              : ''}
          </h6>
        </div>
      </Popover>
      <div className={"LoginOut"}
        onClick={() => {
          Modal.confirm({
            title: '提示',
            icon: <ExclamationCircleOutlined />,
            content: `确认退出吗`,
            okText: '确认',
            cancelText: '取消',
            onOk: (e) => {
              login('loginOut')
            }
          })
        }}>
        <div style={{ textAlign: 'center' }}>
          <IconFont
            type="loginOut"
            style={{ fontSize: '18px', color: '#fff' }}
          />
          <h6>退出</h6>
        </div>
      </div>
      <ChangePasswordComponent authorId={msg.authorId} userName={name}
                               changePasswordRef={changePasswordRef}/>
      <style>
        {`
          .lineTopStyle {
            position: fixed;
            top: 0;
            height: 50px;
            left: 0;
            width: 100%;
            overflow: hidden;
            display: flex;
            border-bottom: 1px solid #f0f0f0;
            box-sizing: border-box;
          }
        `}
      </style>
    </div>
    </React.Fragment>
  )
}
export default IndexTabTop
