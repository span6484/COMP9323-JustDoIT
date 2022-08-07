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
import {viewProject} from "../MockData";
const { Title, Paragraph, Text, Link } = Typography;

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
    var pid = urlMsg.asPath.toString().replace('/project/showcase?id=', '');
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
            viewProject({ "proj_id": pid, "uid": uid, }).then(val =>{
                if(val.code === 200){
                    val.result.start_time = moment(val.result.start_time).format('YYYY-MM-DD');
                    val.result.close_time = moment(val.result.close_time).format('YYYY-MM-DD');
                    setProject(val.result);
                    ref?.current.getTabPane(urlMsg.asPath, val.result?.proj_name)
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
                                    <Title>{project.proj_name}</Title>
                                    <Title level={5}>Course: {project.course_name}</Title>
                                    <Row>
                                        <Col span={24}>
                                            <Title level={5}>Duration:</Title>
                                            <Paragraph>From {project.start_time} to {project.close_time}</Paragraph>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col span={24} style={{display : "flex",alignItems : "center"}}>
                                            <Title level={5}>Course Authority:</Title>
                                            <Comment
                                                style={{marginLeft : "10px"}}
                                                className="comment-box-item"
                                                author={<div>
                                                    {project.authority_name}
                                                    <Tooltip placement="top" title={<div className={"email-tool-tip-component"}>
                                                        {project.authority_email}
                                                        <CopyToClipboard
                                                            text={project.authority_email}
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
                                                    {project.proposer_name}
                                                    <Tooltip placement="top" title={<div className={"email-tool-tip-component"}>
                                                        {project.proposer_email}
                                                        <CopyToClipboard
                                                            text={project.proposer_email}
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
                                <Title level={2}>Awarded work to showcase</Title>
                                <br />

                                <Title level={3}>Author of project</Title>
                                <Comment
                                    className="comment-box-item"
                                    author={<div>
                                        Example author
                                        <Tooltip placement="top" title={<div className={"email-tool-tip-component"}>
                                            ExampleEmail@COMP9323.com
                                            <CopyToClipboard
                                                text={"ExampleEmail@COMP9323.com"}
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
                                <Collapse defaultActiveKey={['1']} onChange={onChange}>
                                    <Panel header="Document 1" key="1">
                                        <iframe
                                            src={"https://www.orimi.com/pdf-test.pdf"}
                                            title="file"
                                            width="100%"
                                            height="1200"
                                        ></iframe>
                                    </Panel>
                                    <Panel header="Document 2" key="2">
                                        <iframe src="https://onedrive.live.com/embed?resid=1B47937AD843C12%2184207&amp;authkey=%21AOztocS2WvBRawc&amp;em=2&amp;wdAr=1.7777777777777777" width="1200px" height="800px" frameborder="0">This is an embedded <a target="_blank" href="https://office.com">Microsoft Office</a> presentation, powered by <a target="_blank" href="https://office.com/webapps">Office</a>.</iframe>
                                    </Panel>
                                    <Panel header="Document 3" key="3">
                                        <iframe
                                            src={"https://www.orimi.com/pdf-test.pdf"}
                                            title="file"
                                            width="100%"
                                            height="1200"
                                        ></iframe>
                                    </Panel>

                                </Collapse>
                            </Col>
                        </Row>
                        <br />
                        <Title level={4}>Feedback for this work</Title>
                        <Paragraph>
                            You showed incredible leadership instincts in your work on that project. I would love to work with you to develop those skills. Amazing work.
                            You have all the qualities we look for in a leader. I hope you might consider taking them to the next level by leading our next big project in this area.
                        </Paragraph>
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