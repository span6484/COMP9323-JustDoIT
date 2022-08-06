import PageBase from '../basePage';
import projectStyle from "./project.less";
import moment from 'moment';
import React, { useRef, onChange, useState, useEffect } from 'react';
import { UploadOutlined } from '@ant-design/icons';
import { Col, Row, Collapse, Typography, Button, Space, Input, message, Upload, Comment, Avatar, Tooltip, Tabs, Divider } from 'antd';
const { Dragger } = Upload;
const { TabPane } = Tabs;
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { MailOutlined, DeleteOutlined, FormOutlined } from "@ant-design/icons"
const { Title, Paragraph, Text, Link } = Typography;

const TextIndex = ({ USERMESSAGE, urlMsg }) => {
    const ref = useRef();
    const { Panel } = Collapse;
    // console.log(USERMESSAGE, urlMsg);
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
    var pid = urlMsg.asPath.toString().replace('/project/work?id=', '');
    const [pagestate, setPageState] = useState(0);
    const [project, setProject] = useState({});
    const [studentList, setStudentList] = useState([]);
    useEffect(() => {
        setTimeout(() => {
            ref?.current.getTabPane(urlMsg.asPath, `Project Name`)
        }, 0);
        // fetch project info on load
        getProjectWorks();
    }, [pagestate]);

    function getProjectWorks() {
        // fetch project info
        console.log(JSON.stringify({ "proj_id": pid, "uid": uid, "student_index": 0 }));
        try {
            fetch('http://localhost:5000/view_works', {
                method: 'POST',
                headers: {
                    "content": 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                body: JSON.stringify({ "proj_id": pid, "uid": uid, "student_index": 0 })
            }).then(res => {
                res.json().then((val) => {
                    console.log('works:', val.result);
                    // convert datetime
                    val.result.start_time = moment(val.result.start_time).format('YYYY-MM-DD');
                    val.result.close_time = moment(val.result.close_time).format('YYYY-MM-DD');
                    var studentList = [];
                    Object.entries(val.result.student_lst).forEach(studentObj => {
                        const [key, student] = studentObj;
                        console.log(student);
                        // const newfile = {
                        //     'uid': key,
                        //     'name': value.file_name,
                        //     'url': value.file_url,
                        //     'status': 'done'
                        // }
                        studentList.push(student);
                    });
                    setStudentList(studentList);
                    setProject(val.result);
                    // console.log('project val:', val.result);
                });
            });
        } catch (e) {
            console.log(e)
        };
    }
    function sendFeedback(pid, uid, sid, feedback) {
        try {
            fetch('http://localhost:5000/give_feedback', {
                method: 'POST',
                headers: {
                    "content": 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                body: JSON.stringify({
                    "proj_id": pid,
                    "uid": uid,
                    "sid": sid,
                    "feedback": feedback
                })
            }).then(res => {
                res.json().then((val) => {
                    console.log("sendFeedback res = ", val);
                    setPageState(pagestate + 1);
                });
            });
        } catch (e) {
            console.log(e)
        }
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

        return null;

    }
    function ProjectWorks(props) {
        <style dangerouslySetInnerHTML={{
            __html: projectStyle
        }} />

        // for CA P Submitted
        if (props.userRole != "S") {
            return (
                <>
                    <Title level={3}>Submissions by students</Title>
                    <Tabs
                        defaultActiveKey="1"
                        style={{

                        }}
                    >
                        {studentList.map((student, index) => (
                            <TabPane tab={<Comment
                                className="comment-box-item"
                                author={<div>
                                    {student.student_name}
                                    {/* <Tooltip placement="top" title={<div className={"email-tool-tip-component"}>
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
                                    </Tooltip> */}
                                </div>
                                }
                                avatar={<Avatar src="/static/ca.png" />}
                                content={null}
                            >
                            </Comment>} key={index} disabled={false}>


                                <Title level={5}>Submitted documents</Title>
                                <Documents files={student.file} />
                                <br />
                                <br />
                                <Feedbacks student={student} />
                            </TabPane>
                        ))}
                    </Tabs>




                </>
            )
        }
        else {
            // for S, work not reviewed
            if (props.submitted) {
                return null;
            } else {
                return (
                    <>
                        <Title level={3}>Upload documents here:</Title>
                        <Upload
                            action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
                            listType="picture"
                            className="upload-list-inline"
                        >
                            <Button icon={<UploadOutlined />}>Upload</Button>
                        </Upload>
                        <br />
                        <br />
                        <br />
                        <Space direction="horizontal" size="middle" style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-around' }}>

                            <Button type='primary' style={{ width: 300, marginTop: 20 }}>Submit</Button>
                            <Button style={{ width: 300, marginTop: 20 }}>Back</Button>

                        </Space>
                    </>
                )
            }

        }
        return null;
    }
    function Feedbacks(props) {
        const [feedback, setFeedback] = useState('');

        const student = props.student
        if (student.file.length == 0) {
            return null;
        }
        if (student.a_feedback) {
            return (
                <>
                    <Title level={5}>Project work feedback</Title>
                    <Paragraph>
                        {student.a_feedback}
                    </Paragraph>
                    <br />
                </>
            )
        } else {
            if (userRole != "CA") {
                return (
                    <>
                        <Title level={5}>Project work feedback</Title>
                        <Paragraph>
                            No feedbacks yet
                        </Paragraph>
                    </>
                )
            } else {
                return (
                    <>
                        <Title level={5}>Enter feedback</Title>
                        <Input
                            key={project.proj_name}
                            placeholder="Enter your project work feedback here"
                            onChange={(e) => {
                                setFeedback(e.target.value);
                            }}
                        />
                        <br />
                        <Button type='primary' onClick={() => {
                            console.log(pid, uid, student.sid, feedback);
                            sendFeedback(pid, uid, student.sid, feedback);
                        }}
                            style={{ width: 300, marginTop: 20 }}>Submit Feedback</Button>
                    </>
                )
            }
        }
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
                                    <Title>{project.project_name}</Title>
                                    <Title level={2}>A project for {project.course_name}</Title>
                                    <Row>
                                        <Col span={12}>
                                            <Title level={4}>Start Time</Title>
                                            <Paragraph>{project.start_time}</Paragraph>
                                        </Col>
                                        <Col span={12}>
                                            <Title level={4}>End time</Title>
                                            <Paragraph>{project.close_time}</Paragraph>
                                        </Col>
                                    </Row>
                                    <Title level={4}>Project Description</Title>
                                    <Paragraph>
                                        {project.description}
                                    </Paragraph>
                                    <Row>
                                        <Col span={12}>
                                            <Title level={4}>Course Authority:</Title>
                                            <Comment
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
                                        <Col span={12}>
                                            <Title level={4}>Project Proposer:</Title>
                                            <Comment
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
                        <Divider />
                        <Row>
                            <Col span={24} >
                                <ProjectWorks />
                            </Col>
                        </Row>
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