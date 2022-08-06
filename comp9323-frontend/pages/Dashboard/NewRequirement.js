import PageBase from '../basePage'
import React, { useRef, useState, useEffect } from 'react'
import { Col, Row, message, Typography, Button, Space, Tooltip, Steps, Comment, Avatar, Input, Modal } from 'antd';
const {confirm} = Modal;
import { MailOutlined, ExclamationCircleOutlined } from "@ant-design/icons"
const { Title, Paragraph} = Typography;
import CourseDetailStyle from "./CourseDetail.less"
import { CopyToClipboard } from 'react-copy-to-clipboard';
import {getRequirement, getUserProfile,addRequirement} from '../MockData';
import store from '../../util/store';
import {getQueryString} from "../../util/common";
const { TextArea } = Input
const CourseDetail = ({ USERMESSAGE, urlMsg }) => {
  console.log(store.getState)
  const ref = useRef();
  // const [requirement,changeRequirement] = useState({})
  // 0:CA，1:S，2:P，3:R
  const [contentref, setContentref] = useState(true);
  const [value, setValue] = useState("");
  const [descVal, setDescVal] = useState(value);
  const [userProfile,changeUserProfile] = useState({})
  const getRequireMent = () => {
    getRequirement().then(res => {
      // console.log(res);
      setValue("I need a two-month lab project to improve students'neural network building skills, and I need to use artificial intelligence knowledge in the process.")
    })
  }
  function deleteRequirement() {
    confirm({
      title: 'Are you sure you want to delete requirement?',
      icon: <ExclamationCircleOutlined />,
      okText : "YES",
      cancelText : "NO",
      onOk(){
        setDescVal('')
        message.success("Delete successfully");
      }
    });
  }
  
  useEffect(() => {
    setTimeout(() => {
      ref?.current.getTabPane(urlMsg.asPath, `New Requirement`);
      getUserProfile({
        uid :  USERMESSAGE && USERMESSAGE.uid
      }).then(res => {
        if(res.code === 200){
          changeUserProfile(res.result)
        }else{
          changeUserProfile({})
        }
      })
    }, 0)
    // getRequireMent()
  }, []);
  useEffect(() => {
    setValue(descVal)
  }, [descVal])
  useEffect(() => {
    let content = sessionStorage.getItem("CONTENT")
    setContentref(content)
  }, [])
  return (
    <PageBase cRef={ref} USERMESSAGE={USERMESSAGE}>
      <style dangerouslySetInnerHTML={{
        __html: CourseDetailStyle
      }} />
      <div className={"course-detail-component-box"}>
        <Row>
          <Col span={2} />
          <Col span={20}>
            <Row>
              <Col span={14}>
                <Space direction="vertical" size="middle" style={{ display: 'flex' }}>
                  <Title>Requirement</Title>
                  <Paragraph>
                    {contentref?<span><strong>Description:&nbsp;</strong>{value}</span>
                    :<TextArea
                    value={value}
                    onChange={(e) =>setDescVal(e.target.value)}
                    placeholder="Please enter your requirement here"
                    autoSize={{
                      minRows: 3,
                      maxRows: 5,
                    }}
                  />}
                   
                  </Paragraph>
                </Space>
              </Col>
              <Col span={4} />
              <Col span={6}
                  className={"action-button-box"}>
                  {contentref ?
                    <div/> :
                    <Button onClick={() => {
                      if(!value){
                        message.warning("Please enter your requirement");
                        return;
                      }
                      addRequirement({
                        uid: USERMESSAGE && USERMESSAGE.uid,
                        cid: getQueryString("id") || "",
                        content : value
                      }).then(res => {
                        if(res.code === 200){
                          message.success("Add requirement successfully");
                          setContentref(true);
                        }else{
                          message.error("Add requirement failed")
                        }
                      })
                    }}>Submit</Button>}
                {!contentref && <Button onClick={()=>{
                    setDescVal('')
                  }} >Clear</Button>}
                </Col>
            </Row>
            <br />
            <Row>
              <Col span={24}>
                <Title level={3}>Course Authority</Title>
                <div className={"comment-box"}>
                  <Comment
                    className="comment-box-item"
                    author={<div>
                      {userProfile.username}
                      <Tooltip placement="top" title={<div className={"email-tool-tip-component"}>
                        {userProfile.email}
                        <CopyToClipboard
                          text={"email12131@qq.com"}
                          onCopy={() => {
                            message.success('copy email success');
                          }}
                        >
                          <span className={"email-tool-tip-component-copy"}>COPY</span>
                        </CopyToClipboard>
                      </div>}>
                        <MailOutlined className={"mail-box"} />
                      </Tooltip>
                    </div>
                    }
                    avatar={<Avatar src="/static/ca.png" alt="Han Solo" />}
                    content={null}
                  >
                  </Comment>
                </div>

              </Col>
            </Row>
            <Row>
            </Row>
          </Col>
          <Col span={2} />
        </Row>
      </div>
    </PageBase>
  )
}
CourseDetail.getInitialProps = async (status) => {
  const asPath = status.asPath;
  return {
    urlMsg: {
      asPath
    }
  }
}

export default CourseDetail