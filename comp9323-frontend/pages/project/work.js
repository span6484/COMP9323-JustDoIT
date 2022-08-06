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
import {viewProject, viewWorks,studentSubmit} from "../MockData"
const TextIndex = ({ USERMESSAGE, urlMsg }) => {
    const ref = useRef();
    const { Panel } = Collapse;
    // console.log(USERMESSAGE, urlMsg);
    const uid = USERMESSAGE && USERMESSAGE.uid;
    // get roles based project users
    var userRole = undefined;
    switch (USERMESSAGE && USERMESSAGE.type) {
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
        getProjectDetail();
    }, [pagestate]);
    function getProjectDetail(){
        viewProject({ "proj_id": pid, "uid": uid, }).then(val =>{
            if(val.code === 200){
                val.result.start_time = moment(val.result.start_time).format('YYYY-MM-DD');
                val.result.close_time = moment(val.result.close_time).format('YYYY-MM-DD');
                setProject(val.result);
                ref?.current.getTabPane(urlMsg.asPath, val.result?.proj_name)
            }
        })
    }
    function getProjectWorks() {
        // fetch project info
        console.log(JSON.stringify({ "proj_id": pid, "uid": uid, "student_index": 0 }));
        try {
            viewWorks({ "proj_id": pid, "uid": uid, "student_index": 0 })
                .then(val =>{
                if(val.code === 200){
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
                }
            })
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
    const [pdfList ,changePdfList] = useState([])
    function ProjectWorks(props) {
        if (userRole != "S") {
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

            return (
                <div>
                    <Title level={4}>Upload documents here:</Title>
                    <Upload
                        maxCount={1}
                        beforeUpload={(file)=>{
                            let fileType = file.name.split('.');
                            const fileDate = fileType.slice(-1);
                            const isLt200M = file.size / 1024 / 1024 < 0.5;
                            if (!isLt200M) {
                                message.error('File size cannot be greater than 500kb');
                                return
                            }
                            return isLt200M;
                        }}
                        onChange={({file,fileList})=>{
                            if(fileList && fileList.length > 0){
                                const _file = fileList[0];
                                const pdf_url = _file?.response?.result?.pdf_url || "";
                                changePdfList([pdf_url])
                            }else{
                                changePdfList([])
                            }
                        }}
                        action="http://127.0.0.1:5000/upload_file"
                        className="upload-list-inline">
                        <Button icon={<UploadOutlined />}>Upload (Max: 1)</Button>
                    </Upload>
                    <br />
                    <br />
                    <br />
                    <Space direction="horizontal" size="middle" style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-around' }}>
                        <Button
                            onClick={()=>{
                                if(!pdfList ||pdfList.length === 0){
                                    message.warning("Please submit your work");
                                    return;
                                }
                                studentSubmit({
                                    uid : USERMESSAGE && USERMESSAGE.uid,
                                    proj_id : pid,
                                    file : pdfList && pdfList[0]
                                }).then(res => {
                                    if(res.code === 200){
                                        message.success("Submit successfully");
                                    }else{
                                        message.error("Submit failed");
                                    }
                                })
                            }}
                            type='primary' style={{ width: 300, marginTop: 20 }}>Submit</Button>
                    </Space>
                </div>
            )


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
                        {!!project && <Row>
                                <Col span={14}>
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
                       }
                        <Divider />
                        <Row>
                            <Col span={24} >
                                {
                                    ProjectWorks()
                                }
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