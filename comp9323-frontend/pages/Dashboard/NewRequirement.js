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
import { Content } from 'antd/lib/layout/layout';
const CourseDetail = ({ USERMESSAGE, urlMsg }) => {
  console.log(store.getState)
  const ref = useRef();
  // const [requirement,changeRequirement] = useState({})
  const [projectList, changeProjectList] = useState([{}, {}])
  // 0:CA，1:S，2:P，3:R
  const [user, changeUser] = useState({ role: 0 })
  const [contentref, setContentref] = useState(true);
  const { TextArea } = Input
  const [value, setValue] = useState("");
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
  
  useEffect(() => {
    setTimeout(() => {
      ref?.current.getTabPane(urlMsg.asPath, `New Requirement`)
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
              <Col span={6}
                  className={"action-button-box"}>
                  {contentref ?
                    <Button onClick={() => setContentref(false)}>Edit</Button> :
                    <Button onClick={() => {
                      setContentref(true)
                      //todo 发起请求
                    }}>Confrim</Button>}
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