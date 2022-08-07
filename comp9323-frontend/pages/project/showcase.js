import PageBase from '../basePage';
import projectStyle from "./project.less";
import moment from 'moment';
import React, { useRef, onChange, useState, useEffect } from 'react';
import { UploadOutlined } from '@ant-design/icons';
import {
    Col,
    Row,
    Collapse,
    Typography,
    Button,
    Space,
    Input,
    message,
    Upload,
    Comment,
    Avatar,
    Tooltip,
    Divider
} from 'antd';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { MailOutlined, DeleteOutlined, FormOutlined } from "@ant-design/icons"

const { Dragger } = Upload;
import { SP } from 'next/dist/next-server/lib/utils';
import {viewProject,getAwardDetail} from "../MockData";
const { Title, Paragraph, Text, Link } = Typography;
import "./detail.less"
const TextIndex = ({ USERMESSAGE, urlMsg }) => {
    const ref = useRef();
    const { Panel } = Collapse;
    //console.log(USERMESSAGE);
    const uid = USERMESSAGE && USERMESSAGE.uid;
    // get roles based project users
    var userRole = undefined;
    switch (USERMESSAGE &&USERMESSAGE.type) {
        case 0:
            userRole = "CA";
            break;
        case 1:
            userRole = "S";
            break;
        case 2:
            userRole = "P";
            break;
        case 3:
            userRole = "R";
            break;
    }
    // get project id from url 
    var selId = urlMsg.asPath.toString().replace('/project/showcase?id=', '');
    const [pagestate, setPageState] = useState(0);
    const [project, setProject] = useState({});
    useEffect(() => {
        setTimeout(() => {
            ref?.current.getTabPane(urlMsg.asPath, `Project Name`)
        }, 0);
        // fetch project info on load
        getProjectDetail();
    }, [pagestate]);

    function getProjectDetail() {
        // fetch project info
        try {
            getAwardDetail({ "sel_id": selId, "uid": uid, }).then(val =>{
                if(val.code === 200){
                    setProject(val.result);
                    ref?.current.getTabPane(urlMsg.asPath, val.result?.project?.proj_name)
                }
            })
        } catch (e) {
            console.log(e)
        };
    }

    return (
        <PageBase cRef={ref} USERMESSAGE={USERMESSAGE}>
            <>
                <br />
                <Row>
                    <Col span={2}></Col>
                    <Col span={20}>
                       <Row>
                            <Col span={14}>
                                <Space direction="vertical" size="middle" style={{ display: 'flex' }}>
                                    <Title>{project?.project?.proj_name}</Title>
                                    <Title level={5}>Course: {project?.course?.course_name}</Title>
                                    <Row>
                                        <Col span={24} style={{display : "flex",alignItems : "center"}}>
                                            <Title level={5}>Course Authority:</Title>
                                            <Comment
                                                style={{marginLeft : "10px"}}
                                                className="comment-box-item"
                                                author={<div>
                                                    {project.ca?.name}
                                                    <Tooltip placement="top" title={<div className={"email-tool-tip-component"}>
                                                        {project.ca?.email}
                                                        <CopyToClipboard
                                                            text={project.ca?.email}
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
                                                avatar={<Avatar src="/static/ca.png" />}
                                                content={null}
                                            >
                                            </Comment>
                                        </Col>
                                        <Col span={24} style={{display : "flex",alignItems : "center"}}>
                                            <Title level={5}>Project Proposer:</Title>
                                            <Comment
                                                style={{marginLeft : "10px"}}
                                                className="comment-box-item"
                                                author={<div>
                                                    {project.p?.name}
                                                    <Tooltip placement="top" title={<div className={"email-tool-tip-component"}>
                                                        {project.p?.email}
                                                        <CopyToClipboard
                                                            text={project.p?.email}
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
                                                avatar={<Avatar src="/static/ca.png" />}
                                                content={null}
                                            >
                                            </Comment>
                                        </Col>
                                    </Row>
                                </Space>
                            </Col>
                            <Col span={4}></Col>
                        </Row>
                        <Divider />
                        <Row>
                            <Col span={24} >
                                <Title level={3}>Awarded work to showcase</Title>
                                <br />
                                <Title level={4}>Author of project</Title>
                                <Comment
                                    className="comment-box-item"
                                    author={<div>
                                        {project.stu?.name}
                                        <Tooltip placement="top" title={<div className={"email-tool-tip-component"}>
                                            {project.stu?.email}
                                            <CopyToClipboard
                                                text={project.stu?.email}
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
                                    avatar={<Avatar src="/static/ca.png" />}
                                    content={null}
                                >
                                </Comment>
                                <br />
                                {!!project.file?.file_url &&
                                    <Collapse defaultActiveKey={['1']} onChange={onChange}>
                                        <Panel header={project.file?.file_name} key="1">
                                            <iframe
                                                src={project.file?.file_url}
                                                title="file"
                                                width="100%"
                                                height="600"
                                            ></iframe>
                                        </Panel>
                                    </Collapse>
                                }

                            </Col>
                        </Row>
                        <br />
                        {
                          !!project.a_feedback &&
                            <>
                                <Title level={4}>Course Authority Feedback</Title>
                                <Paragraph>
                                    {project.a_feedback}
                                </Paragraph>
                            </>

                        }
                        {
                            !!project.p_feedback &&
                            <>
                                <Title level={4}>Proposer Feedback</Title>
                                <Paragraph>
                                    {project.p_feedback}
                                </Paragraph>
                            </>

                        }
                    </Col>
                    <Col span={2}></Col>
                </Row>



            </>    </PageBase>
    )
}
TextIndex.getInitialProps = async (status) => {
    const asPath = status.asPath;
    return {
        urlMsg: {
            asPath
        }
    }
}
export default TextIndex