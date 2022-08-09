import PageBase from '../basePage';
import React, { useRef, useState, useEffect } from 'react';
import { Col, Row, message, Typography, Button, Space, Tooltip, Comment, Avatar, Modal } from 'antd';
import { MailOutlined, FormOutlined, ExclamationCircleOutlined } from "@ant-design/icons"
import { CopyToClipboard } from 'react-copy-to-clipboard';
import CourseDetailStyle from "./CourseDetail.less";
import { getCourseDetail, publicToReviewers, getRequirements ,getProjectsInCourse} from "../MockData";
import {getQueryString,setDay} from "../../util/common";

const { confirm } = Modal;
const { Title, Paragraph } = Typography;

const CourseDetail = ({ USERMESSAGE, urlMsg }) => {
  const ref = useRef();

  // State
  const [courseDetail, changeCourseDetail] = useState({}); // Course Detail
  const [courseAuthorityList, changeCourseAuthorityList] = useState([]); // Course Authority List
  const [requirementList, changeRequirementList] = useState([]); // Requirement List
  const [user, changeUser] = useState(USERMESSAGE || {}); // User Info
  const [projectList, changeProjectList] = useState([]); // Project List
  const [project,changeProject] = useState([]);
  const [courseResList ,changeCourseResList] = useState([]);
  // 初始化
  useEffect(() => {
    handleGetCourseDetail(); // 获取course详情
    if(USERMESSAGE && USERMESSAGE.role === 1){
      handleGetProjectsInCourse();
    }else{
      handleGetRequirements();
    }
    const userType = USERMESSAGE && USERMESSAGE.type;
    let projectStatusList = [];
    if(userType !== 1 && userType !== undefined && userType !== null && userType !== ""){
      projectStatusList = [...projectStatusList,...[{
        key : 0,
        value : "Pending"
      },{
        key : 1,
        value : "Approved"
      },{
        key : 2,
        value : "Not approved"
      }]]
    }
    projectStatusList = [...projectStatusList,...[{
      key : 3,
      value : "Open to join"
    },{
      key : 4,
      value : "In Progress"
    },{
      key : 5,
      value : "Ended"
    }]]
    changeProject(projectStatusList)
  }, []);

  // 获取course详情
  const handleGetCourseDetail = () => {
    let reqBody = {
      uid: USERMESSAGE && USERMESSAGE.uid,
      cid: getQueryString("id") || ""
    };
    getCourseDetail(reqBody).then(res => {
      if(res.code === 200){
        changeCourseDetail(res.result || {});
        const _list = [];
        for(let i = 0 ; i < (res.result?.course_cas || []).length ; i++){
          _list.push({
             name : res.result?.course_cas[i].ca_name,
             email : res.result?.course_cas[i].email
          })
        }
        const _list2 = [];
        for(let i = 0 ; i < (res.result?.course_res || []).length ; i++){
          _list2.push({
            name : res.result?.course_res[i].re_name,
            email : res.result?.course_res[i].re_email
          })
        }
        changeCourseAuthorityList(_list);
        changeCourseResList(_list2);
        ref?.current.getTabPane(urlMsg.asPath, res.result?.course_name || `Course Detail`)
      }

    });
  };
  function handleGetProjectsInCourse(){
    getProjectsInCourse({
      uid: USERMESSAGE && USERMESSAGE.uid,
      cid: getQueryString("id") || "",
    }).then(res => {
      if(res.code === 200) {
        changeProjectList(res.result?.result_list || []);
      }
    });
  }
  function getProjectStatus(statues){
    const filterList = project && project.filter((item) =>{
      return item.key === statues
    })
    if(!filterList || filterList.length === 0){
      return null;
    }
    return filterList[0].value
  }
  // 获取当前课程下的Requirement
  const handleGetRequirements = () => {
    let reqBody = {
      uid: USERMESSAGE && USERMESSAGE.uid,
      cid: getQueryString("id") || "",
    };
    getRequirements(reqBody).then(res => {
      if(res.code === 200) {
        changeRequirementList(res.result?.result_list || []);
      }
    });
  };
  // Public to Reviewers
  const handlePublicToReviewers = () => {
    confirm({
      title: 'Are you sure you want to make all proposals public to reviewers?',
      icon: <ExclamationCircleOutlined />,
      okText: "YES",
      cancelText: "NO",
      onOk() {
        let reqBody = {
          uid: USERMESSAGE && USERMESSAGE.uid,
          cid: getQueryString("id") || "",
        };
        publicToReviewers(reqBody).then(res => {
          if(res.code === 200){
            message.success("Successfully Made Public");
          }else{
            message.error("Failed")
          }
        });
      }
    });
  };
  // Add Requirement
  const handleAddRequirement = (id) => {
    ref.current.setTabPane(`New Requirement`, '', `/Dashboard/NewRequirement?id=${getQueryString("id") || ""}`);
  };
  // To Requirement Detail
  const toRequirementDetail = (rid) => {
    ref.current.setTabPane(`Requirement Detail`, '', `/Dashboard/RequirementDetail?id=${rid}`)
  };
  // Click project name, To project detail
  const handleClickProjectName = (id) => {
    ref.current.setTabPane(`Project Name`, '', `/project/detail?id=${id}`);
  };
  // Click project name, To project detail
  const handleClickRequirementName = (rid) => {
    ref.current.setTabPane(`Requirement Detail`, '', `/Dashboard/RequirementDetail?id=${rid}`);
  };
  return (
    <PageBase cRef={ref} USERMESSAGE={USERMESSAGE}>
      <style dangerouslySetInnerHTML={{ __html: CourseDetailStyle }} />
      <div className={"course-detail-component-box"}>
        <Row>
          <Col span={2} />
          <Col span={20}>
            {/* Top Course Info */}
            <Row>
              <Col span={14}>
                <Space direction="vertical" size="middle" style={{ display: 'flex' }}>
                  <Title>{ courseDetail.course_name }</Title>
                  <Paragraph>
                    <strong>Course Description:</strong>&nbsp;
                    <span>{ courseDetail.description }</span>
                  </Paragraph>
                  <Paragraph>
                    <strong>Duration:</strong>&nbsp;
                    <span> From { setDay(courseDetail.start_time ) } to { setDay(courseDetail.close_time) }</span>
                  </Paragraph>
                </Space>
              </Col>
              <Col span={4} />
              {
                user.role === 0 &&
                <Col span={6} className={"action-button-box"}>
                  <Button onClick={()=>{
                    handleAddRequirement()
                  }}>Add Requirement</Button>
                  {
                    !courseDetail.is_public ?
                        <Button onClick={handlePublicToReviewers}>Public to Reviewers</Button>:
                        <div className={"action-button-box-button"} />
                  }
                  <div className={"action-button-box-button"} />
                  <div className={"action-button-box-button"} />
                  <div className={"action-button-box-button"} />
                </Col>
              }
            </Row>
            <br />

            {/* Course Authority */}
            {
              courseAuthorityList && courseAuthorityList.length > 0 &&
                <Row>
                  <Col span={24}>
                    <Title level={3}>Course Authority</Title>
                    <div className={"comment-box"}>
                      { courseAuthorityList.map((item, index) =>
                          <Comment key={index} className="comment-box-item"
                                   author={
                                     <div>
                                       { item.name }
                                       <Tooltip placement="top" title={
                                         <div className={"email-tool-tip-component"}>
                                           { item.email }
                                           <CopyToClipboard text={ item.email } onCopy={() => { message.success('copy email success'); }}>
                                             <span className={"email-tool-tip-component-copy"}>COPY</span>
                                           </CopyToClipboard>
                                         </div>}
                                       >
                                         <MailOutlined className={"mail-box"} />
                                       </Tooltip>
                                     </div>
                                   }
                                   avatar={<Avatar src="/static/ca.png" alt="Han Solo" />}
                                   content={null}
                          >
                          </Comment>
                      )}
                    </div>
                  </Col>
                </Row>
            }


            {/* Reviewers List */}
            {!!courseResList && courseResList.length > 0 &&
                !!courseDetail.is_public &&
                <Row>
              <Col span={24}>
                <Title level={3}>Reviewers</Title>
                <div className={"comment-box"}>
                  { courseResList && courseResList.map((item, index) =>
                      <Comment key={index} className="comment-box-item"
                               author={
                                 <div>
                                   { item.name }
                                   <Tooltip placement="top" title={
                                     <div className={"email-tool-tip-component"}>
                                       { item.email }
                                       <CopyToClipboard text={ item.email } onCopy={() => { message.success('copy email success'); }}>
                                         <span className={"email-tool-tip-component-copy"}>COPY</span>
                                       </CopyToClipboard>
                                     </div>}
                                   >
                                     <MailOutlined className={"mail-box"} />
                                   </Tooltip>
                                 </div>
                               }
                               avatar={<Avatar src="/static/ca.png" alt="Han Solo" />}
                               content={null}
                      >
                      </Comment>
                  )}
                </div>
              </Col>
            </Row>
            }



            {/* Requirement List */}
            <Row>
              { (user.role === 0 || user.role ===2) &&
                <Col span={24}>
                  <div className={"requirementListBox"}>
                    {
                      requirementList.map((item, index) => {
                        return <div className={"requirement_box"} key={"requirementList_" + index}>
                          {(user.role == 0 && item.edit == 1) &&
                            <div className={"action_box"}>
                              <FormOutlined className={"icon-button"} onClick={()=>{
                                handleClickRequirementName(item.rid)
                              }} />
                            </div>
                          }
                          <p onClick={()=>{
                            toRequirementDetail(item.rid);
                          }}>Requirement Detail</p>
                          <div className={"description"}>
                            <strong>Description:</strong>&nbsp;
                            <span>{ item.content }</span>
                          </div>
                          <div className={"description-comment"}>
                            <Comment className="comment-box-item"
                              author={
                                <div>
                                  { item.course_authority }
                                  <Tooltip placement="top" title={
                                    <div className={"email-tool-tip-component"}>
                                      { item.email }
                                      <CopyToClipboard text={item.email} onCopy={() => { message.success('copy email success'); }}>
                                        <span className={"email-tool-tip-component-copy"}>COPY</span>
                                      </CopyToClipboard>
                                    </div>}
                                  >
                                    <MailOutlined className={"mail-box"} />
                                  </Tooltip>
                                </div>
                              }
                              avatar={<Avatar src="/static/ca.png" alt="Han Solo" />}
                              content={null}
                            >
                            </Comment>
                          </div>
                        </div>
                      })
                    }
                  </div>
                </Col>
              }

              { user.role === 1 &&
                <Col span={24}>
                  <div className={"requirementListBox"}>
                    {
                      projectList.map((item, index) => {
                        return <div className={"requirement_box"} key={"requirementList_" + index}>
                          <p onClick={()=>{
                            handleClickProjectName(item.proj_id)
                          }}>{ item.proj_name }</p>
                          <div className={"description"}>
                            <strong>Status:</strong>&nbsp;
                            <span>{getProjectStatus(item.status)}</span>
                          </div>
                          <div className={"description"}>
                            <strong>Project Capacity:</strong>&nbsp;
                            <span>{ item.cur_num } / { item.max_num }</span>
                          </div>
                          <div className={"description"}>
                            <strong>Duration:</strong>&nbsp;
                            <span>From { setDay(item.start_time) } to { setDay(item.close_time) }</span>
                          </div>
                          <div className={"description"}>
                            <strong>Proposer:</strong>&nbsp;
                            <span>{item.proposer}</span>
                            <Tooltip placement="top" title={<div className={"email-tool-tip-component"}>
                              {item.proposer_email}
                              <CopyToClipboard text={item.proposer_email} onCopy={() => { message.success('copy email success'); }}>
                                <span className={"email-tool-tip-component-copy"}>COPY</span>
                              </CopyToClipboard>
                            </div>}>
                              <MailOutlined className={"mail-box"} />
                            </Tooltip>
                          </div>
                          <div className={"description"}>
                            <strong>Course_authority:</strong>&nbsp;
                            <span>{item.course_authority}</span>
                            <Tooltip placement="top" title={<div className={"email-tool-tip-component"}>
                              {item.ca_email}
                              <CopyToClipboard text={item.ca_email} onCopy={() => { message.success('copy email success'); }}>
                                <span className={"email-tool-tip-component-copy"}>COPY</span>
                              </CopyToClipboard>
                            </div>}>
                              <MailOutlined className={"mail-box"} />
                            </Tooltip>
                          </div>
                          {/*<div className={"comment-box"}>*/}
                          {/*  <Comment*/}
                          {/*    className="comment-box-item"*/}
                          {/*    author={<div>*/}
                          {/*      Proposer name&nbsp;&nbsp;&nbsp;*/}
                          {/*      <Tooltip placement="top" title={<div className={"email-tool-tip-component"}>*/}
                          {/*        {item.proposer}*/}
                          {/*        <CopyToClipboard text={item.email} onCopy={() => { message.success('copy email success'); }}>*/}
                          {/*          <span className={"email-tool-tip-component-copy"}>COPY</span>*/}
                          {/*        </CopyToClipboard>*/}
                          {/*      </div>}>*/}
                          {/*        <MailOutlined className={"mail-box"} />*/}
                          {/*      </Tooltip>*/}
                          {/*    </div>*/}
                          {/*    }*/}
                          {/*    avatar={<Avatar src="/static/ca.png" alt="Han Solo" />}*/}
                          {/*    content={null}*/}
                          {/*  />*/}
                          {/*</div>*/}
                        </div>
                      })
                    }
                  </div>
                </Col>
              }
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
};

export default CourseDetail;