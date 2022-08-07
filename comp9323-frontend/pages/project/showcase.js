import PageBase from '../basePage';
import projectStyle from "./project.less";
import moment from 'moment';
import React, { useRef, onChange, useState, useEffect } from 'react';
import { viewProject, viewWorks, studentSubmit } from "../MockData"
import { Col, Row, Collapse, Typography, Button, Space, Input, message, Upload, Comment, Avatar, Tooltip } from 'antd';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { MailOutlined, DeleteOutlined, FormOutlined } from "@ant-design/icons"

const { Dragger } = Upload;
import { SP } from 'next/dist/next-server/lib/utils';
const { Title, Paragraph, Text, Link } = Typography;

const TextIndex = ({ USERMESSAGE, urlMsg }) => {
    const ref = useRef();
    const { Panel } = Collapse;
    //console.log(USERMESSAGE);
    const uid = USERMESSAGE.uid;
    // get roles based project users
    var userRole = undefined;
    switch (USERMESSAGE.type) {
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
    const [student, setStudent] = useState([]);
    const [pdfList, changePdfList] = useState([]);
    const [files, changeFiles] = useState([]);

    useEffect(() => {
        setTimeout(() => {
            ref?.current.getTabPane(urlMsg.asPath, `Project Name`)
        }, 0);
        // fetch project info on load
        getProjectWorks();
    }, [pagestate]);

    function getProjectWorks() {
        // fetch project info
        try {
            viewWorks({ "proj_id": pid, "uid": uid, "page_index": 0, "page_size": 200 })
                .then(val => {
                    if (val.code === 200) {
                        console.log(val.result);
                        val.result.start_time = moment(val.result.start_time).format('YYYY-MM-DD');
                        val.result.close_time = moment(val.result.close_time).format('YYYY-MM-DD');
                        setProject(val.result);
                        Object.entries(val.result.student_lst).forEach(studentObj => {
                            const [key, student] = studentObj;
                            if (student.award == 1) {
                                console.log('student', student);
                                setStudent(student);
                            }
                        });

                    }
                })
        } catch (e) {
            console.log(e)
        };
    }
    function Documents(props) {
        var files = props.files;
        if (files != undefined) {
            console.log("display documents", Array.from(files));
            console.log("number of docs", files.length);
            if (files.length > 0) {
                return (
                    <>
                        <Collapse onChange={onChange}>
                            {files.map((item, index) => {
                                return (
                                    <Panel header={item.file_name} key={index}>
                                        <iframe
                                            src={item.file_url}
                                            title={item.file_name}
                                            width="100%"
                                            height="1200"
                                        ></iframe>
                                    </Panel>
                                )
                            })}

                        </Collapse>
                    </>
                )
            }
        }
        return (
            <>
                <Paragraph>No work has been submitted yet.</Paragraph>
            </>
        );

    }
    function FeedBacks(props) {
        let a_list = [];
        if (student.a_feedback) {
            a_list.push(<>
                <Title level={5}>Course Authority Feedback</Title>
                <Paragraph>
                    {student.a_feedback}
                </Paragraph>
                <br />
            </>)

        }
        if (student.p_feedback) {
            a_list.push(<>
                <Title level={5}>Proposer Feedback</Title>
                <Paragraph>
                    {student.p_feedback}
                </Paragraph>
                <br />
            </>)

        }
        if (!student.p_feedback && !student.a_feedback) {
            return (<>
                <Title level={5}>Feedback</Title>
                <Paragraph>
                    No feedbacks yet.
                </Paragraph>
                <br />
            </>)
        }
        return a_list.map((item) => {
            return item
        })
        return null;
    }
    return (
        <PageBase cRef={ref} USERMESSAGE={USERMESSAGE}>
            <>
                <br />
                <Row>
                    <Col span={2}></Col>
                    <Col span={20}>
                        <Row>
                            <Col span={24}>
                                <Space direction="vertical" size="middle" style={{ display: 'flex' }}>
                                    <Title>{project.proj_name}</Title>
                                    <Title level={5}>Course: {project.course_name}</Title>
                                    <Row>
                                        <Col span={24}>
                                            <Title level={5}>
                                                Project Description:
                                            </Title>
                                            <Paragraph>{project.description}</Paragraph>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col span={24}>
                                            <Title level={5}>Duration:</Title>
                                            <Paragraph>From {project.start_time} to {project.close_time}</Paragraph>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col span={24} style={{ display: "flex", alignItems: "center" }}>
                                            <Title level={5}>Course Authority:</Title>
                                            <Comment
                                                style={{ marginLeft: "10px" }}
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
                                        <Col span={24} style={{ display: "flex", alignItems: "center" }}>
                                            <Title level={5}>Project Proposer:</Title>
                                            <Comment
                                                style={{ marginLeft: "10px" }}
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
                        </Row>

                        <Title level={3}>Awarded work to showcase</Title>
                        <br />
                        <Title level={5}>Author of project</Title>
                        <Comment
                            className="comment-box-item"
                            author={<div>
                                {student.student_name}
                            </div>
                            }
                            avatar={<Avatar src="/static/ca.png" />}
                            content={null}
                        >
                        </Comment>
                        <br />
                        <Documents files={student.file} />
                        <br />
                        <Title level={4}>Feedback for this work</Title>
                        <FeedBacks />
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