import PageBase from '../basePage';
import React, { useRef, useState, useEffect } from 'react';
import {Col, Row, message, Typography, Button, Space,Popconfirm,
  Tooltip, Comment, Avatar, Input, Modal, Empty} from 'antd';
import { MailOutlined, ExclamationCircleOutlined ,DeleteOutlined} from "@ant-design/icons";

import CourseDetailStyle from "./CourseDetail.less";
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { getRequirementDetail,getProposals,editRequirement,deleteRequirement ,deleteProposal} from "../MockData";
import {getQueryString,setDay} from "../../util/common";

const { confirm } = Modal;
const { Title, Paragraph } = Typography;
const { TextArea } = Input
import _ from "lodash"
const CourseDetail = ({ USERMESSAGE, urlMsg }) => {
  const ref = useRef();

  // State
  const [requirementDetail, changeRequirementDetail] = useState({}); // 
  const [projectList, changeProjectList] = useState([]); // Project List
  const [user] = useState(USERMESSAGE); // User Info
  const [descVal, setDescVal] = useState(null); // Description Value
  const [editConent,changeEditConent] = useState(false);
  const [project,changeProject] = useState([])
  // Init
  useEffect(() => {
    setTimeout(() => {
      ref?.current.getTabPane(urlMsg.asPath, `Requirement Detail`)
    }, 0);
    handleGetRequirementDetail();
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

  // Get Requirement Detail
  const handleGetRequirementDetail = () => {
    let reqBody = {
      uid :USERMESSAGE && USERMESSAGE.uid,
      rid: getQueryString("id") || ""
    };
    getRequirementDetail(reqBody).then(res => {
      if(res.code === 200){
        setDescVal(res.result || {});
      }
    });
    getProposals(reqBody).then(res => {
      if(res.code === 200){
        changeProjectList(res.result?.result_list || []);
      }
    })
  };
  function getProjectStatus(statues){
    const filterList = project && project.filter((item) =>{
      return item.key === statues
    })
    if(!filterList || filterList.length === 0){
      return null;
    }
    return filterList[0].value
  }
  // Edit
  const handleEdit = () => {};
  // Submit
  const handleSubmit = () => {
    editRequirement({
      uid :USERMESSAGE && USERMESSAGE.uid,
      rid: getQueryString("id") || "",
      content : descVal.content || ""
    }).then(res => {
      if(res.code === 200){
        message.success("Edit requirement successfully");
        changeEditConent(false);
      }else{
        message.error("Edit requirement failed");
      }
    })
  };
  // Delete Requirement
  const handleDeleteRequirement = () => {
    confirm({
      title: 'Are you sure you want to delete requirement?',
      icon: <ExclamationCircleOutlined />,
      okText : "YES",
      cancelText : "NO",
      onOk(){
        deleteRequirement({
          uid :USERMESSAGE && USERMESSAGE.uid,
          rid: getQueryString("id") || "",
        }).then(res => {
          if(res.code === 200){
            message.success("Delete successfully");
            setDescVal(null);
          }else{
            message.success("Delete failed");
          }
        })
      },
    });
  };
  // Publish All Approved Proposals
  const handlePublishAllProjects = () => {
    confirm({
      title: 'Are you sure you want to publish all approved proposals?',
      icon: <ExclamationCircleOutlined />,
      okText : "YES",
      cancelText : "NO",
      onOk(){
        message.success("Publish successfully");
      }
    });
  };
  // Add Proposal
  const handleAddProposal = (id) => {
    ref.current.setTabPane(`New Proposal`, '', `/Dashboard/NewProposal?id=${id}`);
  };
  // Click Project Name, To Project Detail
  const handleClickProjectName = (id) => {
    ref.current.setTabPane(`Project Name`, '', `/project/detail?id=${id}`);
  };
  function delProposal(id,index){
    deleteProposal({
      "uid": USERMESSAGE && USERMESSAGE.uid,
      "proj_id": id
    }).then(res => {
      if(res.code === 200){
        message.success("Delete project successfully");
        const _projectList = _.cloneDeep(projectList);
        _projectList.splice(index,1);
        changeProjectList(_projectList)
      }else{
        message.error("Delete project failed");
      }
    })
  }
  return (
    <PageBase cRef={ref} USERMESSAGE={USERMESSAGE}>
      <style dangerouslySetInnerHTML={{ __html: CourseDetailStyle }} />
      <div className={"course-detail-component-box"}>
        <Row>
          <Col span={2} />
          <Col span={20}>
            {
              !!descVal ?
                <>
                  <Row>
                    <Col span={14}>
                      <Space direction="vertical" size="middle" style={{ display: 'flex' }}>
                        <Title>Requirement</Title>
                        <Paragraph>
                          {
                            !editConent ?
                                <div>
                                  <strong>Description:&nbsp;</strong><span>{descVal.content}</span>
                                </div>:
                                <>
                                  <strong>Description:&nbsp;</strong>
                                  <TextArea
                                      style={{marginTop : "10px"}}
                                      value={descVal.content}
                                      onChange={(e) =>{
                                        const _descVal = _.cloneDeep(descVal);
                                        _descVal.content = e.target.value;
                                        setDescVal(_descVal)
                                      }}
                                      placeholder="Please enter your requirement here"
                                      autoSize={{ minRows: 3, maxRows: 5 }}
                                  />
                                </>
                          }




                        </Paragraph>
                        <Paragraph>
                          <strong>Proposal submitted deadline:</strong> &nbsp;
                          <span>{setDay(descVal.submit_ddl)}</span>
                        </Paragraph>
                      </Space>
                    </Col>
                    <Col span={4} />
                    { user.role === 0 && !!descVal.is_operation &&
                        <Col span={6} className={"action-button-box"}>
                          {
                            !editConent ? <Button onClick={()=>{
                                  changeEditConent(true)
                                }}>Edit</Button> :
                                <Button onClick={handleSubmit}>Submit</Button>
                          }
                          {
                            !projectList || projectList.length === 0 ?
                                <Button onClick={handleDeleteRequirement}>Delete</Button> :
                                <div className={"action-button-box-button"} />
                          }
                          <div className={"action-button-box-button"} />
                          {/*<Button onClick={handlePublishAllProjects}>Publish All Approved Proposals</Button>*/}
                        </Col>
                    }
                    { user.role === 2 &&
                        <Col span={6} className={"action-button-box"}>
                          <Button onClick={()=>{
                            handleAddProposal(getQueryString("id") || "");
                          }}>Add Proposal</Button>
                          <div className={"action-button-box-button"} />
                        </Col>
                    }
                  </Row>
                  <br />
                </> : <Empty
                      description={"No Message"}
                      style={{
                    marginTop:"80px"
                  }}/>

            }
            
            {/* Course Authority */}
            {!!descVal && !!descVal.course_authority &&
                <Row>
              <Col span={24}>
                <Title level={3}>Course Authority</Title>
                <div className={"comment-box"}>
                  <Comment className="comment-box-item" author={
                      <div>
                        {descVal.course_authority}
                        <Tooltip placement="top" title={<div className={"email-tool-tip-component"}>
                          {descVal.email}
                          <CopyToClipboard text={descVal.email} onCopy={() => { message.success('copy email success'); }}>
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
            </Row>}
            
            {/* Project List */}
            <Row>
              <Col span={24}>
                <div className={"requirementListBox"}>
                  {
                    projectList && projectList.map((item, index) => {
                      return <div className={"requirement_box"} key={"requirementList_" + index}>
                        {
                          item.is_delete === 1 &&
                            item.status === 0 &&
                            <Popconfirm placement="top" title={"Are you sure delete this project?"}
                                        onConfirm={()=>{
                                          delProposal(item.proj_id,index);
                                        }} okText="SURE" cancelText="CANCEL">
                                <DeleteOutlined className={"cancel-icon"}/>
                            </Popconfirm>
                        }

                        <p onClick={()=>{
                          handleClickProjectName(item.proj_id);
                        }}>{ item.proj_name }</p>
                        <div className={"description"}>
                          <strong>Proposer:</strong>&nbsp;
                          <span>{item.proposer}</span>
                          <Tooltip placement="top" title={<div className={"email-tool-tip-component"}>
                            {item.email}
                            <CopyToClipboard text={item.email} onCopy={() => { message.success('copy email success'); }}>
                              <span className={"email-tool-tip-component-copy"}>COPY</span>
                            </CopyToClipboard>
                          </div>}>
                            <MailOutlined className={"mail-box"} />
                          </Tooltip>
                        </div>
                        <div className={"description"}>
                          <strong>Status:</strong>&nbsp;
                          <span>{ getProjectStatus(item.status) }</span>
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
};

export default CourseDetail