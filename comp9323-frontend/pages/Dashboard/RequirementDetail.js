import PageBase from '../basePage'
import React, { useRef, useState, useEffect } from 'react'
import { Col, Row, message, Typography, Button, Space, Tooltip, Steps, Comment, Avatar, Input, Modal } from 'antd';
const {confirm} = Modal;
import { MailOutlined, DeleteOutlined, FormOutlined, ExclamationCircleOutlined } from "@ant-design/icons"
const { Title, Paragraph, Text, Link } = Typography;
import CourseDetailStyle from "./CourseDetail.less"
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { getRequirement } from '../MockData';
import {connect}  from 'react-redux';
import store from '../../util/store';
const CourseDetail = ({ USERMESSAGE, urlMsg }) => {
  console.log(store.getState)
  const ref = useRef();
  // const [requirement,changeRequirement] = useState({})
  const [projectList, changeProjectList] = useState([{}, {}])
  // 0:CA，1:S，2:P，3:R
  const [user, changeUser] = useState({ role: 0 })
  const [contentref, setContentref] = useState(true);
  const { TextArea } = Input
  const [value, setValue] = useState("I need a two-month lab project to improve students'neural network building skills, and I need to use artificial intelligence knowledge in the process.");
  const [descVal, setDescVal] = useState(value)
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
      // onOk() {
      //   clearHistory({uid}).then(res => {
      //      if(res.code === 200){
      //         message.success("Clear successfully");
      //         fetchData();
      //      }else{
      //        message.error("Clear failed");
      //      }
      //   })
      // }
      onOk(){
        setDescVal('')
        message.success("Delete successfully");
      }
    });
  }
  function publishAllProjects() {
    confirm({
      title: 'Are you sure you want to publish all approved proposals?',
      icon: <ExclamationCircleOutlined />,
      okText : "YES",
      cancelText : "NO",
      // onOk() {
      //   clearHistory({uid}).then(res => {
      //      if(res.code === 200){
      //         message.success("Clear successfully");
      //         fetchData();
      //      }else{
      //        message.error("Clear failed");
      //      }
      //   })
      // }
      onOk(){
        message.success("Publish successfully");
      }
    });
  }
  useEffect(() => {
    setTimeout(() => {
      ref?.current.getTabPane(urlMsg.asPath, `Requirement Detail`)
    }, 0)
    // getRequireMent()
  }, []);
  useEffect(() => {
    setValue(descVal)
  }, [descVal])
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
                    placeholder="Controlled autosize"
                    autoSize={{
                      minRows: 3,
                      maxRows: 5,
                    }}
                  />}
                   
                  </Paragraph>
                </Space>
              </Col>
              <Col span={4} />
              {user.role == 0 &&
                <Col span={6}
                  className={"action-button-box"}>
                  {contentref ?
                    <Button onClick={() => setContentref(false)}>Edit</Button> :
                    <Button onClick={() => {
                      setContentref(true)
                      //todo 发起请求
                    }}>Confrim</Button>}
                  {/* <Button onClick={contentref?()=>{setContentref(true)}:()=>{
                                  setContentref(false)
                                  //todo 发请求
                                  setValue('netrrstr')
                                  }}>{contentref?'Edit':'Confrim'}</Button> */}
                  <Button onClick={()=>deleteRequirement()} disabled={!value&&true}>Delete</Button>
                  {/* <Button>Add Proposal</Button> */}
                  <Button onClick={()=>publishAllProjects()}>Publish All Approved Proposals</Button>
                  {/* <div className={"action-button-box-button"}/> */}
                  {/* <div className={"action-button-box-button"}/> */}
                </Col>
              }
              {user.role == 2 &&
                <Col span={6}
                  className={"action-button-box"}>
                  <Button>Add Proposal</Button>
                  <div className={"action-button-box-button"} />
                  {/* <div className={"action-button-box-button"}/> */}
                </Col>
              }
            </Row>
            <br />
            <Row>
              <Col span={24}>
                <Title level={3}>Course Authority</Title>
                <div className={"comment-box"}>
                  <Comment
                    className="comment-box-item"
                    author={<div>
                      Authority Name
                      <Tooltip placement="top" title={<div className={"email-tool-tip-component"}>
                        email12131@qq.com
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
              <Col span={24}>
                <div className={"requirementListBox"}>
                  {
                    projectList && projectList.map((item, index) => {
                      // 改了这儿
                      return <div className={"requirement_box"} key={"requirementList_" + index}>
                        <p onClick={() => {
                          ref.current.setTabPane(
                            `Project Name`,
                            '',
                            `/project/detail?id=12444432`
                          )
                        }}>Project Name</p>
                        <div className={"description"}>
                          <strong>Proposer:</strong>&nbsp;I need two-months projects to empower students around creating a website. Students need to have knowledge of front-end, back-end, database, system architecture and recommendation algorithm.
                        </div>
                        <div className={"description"}>
                          <strong>Status:</strong>&nbsp;Pending
                        </div>
                        <div className={"description"}>
                          <strong>Project Capacity:</strong>&nbsp;1 / 100
                        </div>
                        <div className={"description"}>
                          <strong>Duration:</strong>&nbsp;09/01/2022 - 03/02/2022
                        </div>
                      </div>
                    })
                  }
                </div>

              </Col>
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

let mapToProps=(state)=>{
  console.log(state);
    return {
      editReducer
    }
}
export default CourseDetail