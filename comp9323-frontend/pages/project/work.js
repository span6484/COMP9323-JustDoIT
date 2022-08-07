import PageBase from '../basePage';
import projectStyle from "./project.less";
import moment from 'moment';
import React, { useRef, onChange, useState, useEffect } from 'react';
import { UploadOutlined } from '@ant-design/icons';
import { Col, Row, Collapse, Typography, Popconfirm,
    Button, Space, Input, message, Upload, Comment, Avatar, Tooltip, Tabs, Divider } from 'antd';
const { Dragger } = Upload;
const { TabPane } = Tabs;
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { MailOutlined, DeleteOutlined, FormOutlined } from "@ant-design/icons"
const { Title, Paragraph, Text, Link } = Typography;
import {giveFeedback, viewWorks,studentSubmit,giveAward} from "../MockData"
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
    }, [pagestate]);
    function getProjectWorks() {
        // fetch project info
        try {
            viewWorks({ "proj_id": pid, "uid": uid, "page_index": 0 , "page_size" : 200 })
                .then(val =>{
                if(val.code === 200){
                    val.result.start_time = moment(val.result.start_time).format('YYYY-MM-DD');
                    val.result.close_time = moment(val.result.close_time).format('YYYY-MM-DD');
                    var studentList = [];
                    Object.entries(val.result.student_lst).forEach(studentObj => {
                        const [key, student] = studentObj;
                        studentList.push(student);
                    });
                    setProject(val.result);
                    ref?.current.getTabPane(urlMsg.asPath, val.result?.proj_name)
                    setStudentList(studentList);
                    const _uid = USERMESSAGE && USERMESSAGE.uid;
                    const index = studentList && studentList.findIndex((item) => {
                        return item.sid === _uid && item.file && item.file.file_url
                    })
                    const list = [];
                    if(index >= 0){
                        const _file = studentList[index];
                        Object.entries([_file.file]).forEach(file => {
                            const [key, value] = file;
                            const newfile = {
                                'uid': key,
                                'name': value.file_name,
                                'url': value.file_url,
                                'status': 'done'
                            }
                            list.push(newfile);
                        });
                    }
                    changeFileList(list);
                }
            })
        } catch (e) {
            console.log(e)
        };
    }
    function sendFeedback(pid, uid, sid, feedback) {
        try {
            giveFeedback({
                "proj_id": pid,
                "uid": uid,
                "sid": sid,
                "feedback": feedback
            }).then(res => {
                if(res.code === 200){
                    message.success("Feedback successfully");
                    setPageState(pagestate + 1);
                }else{
                    message.error("Feedback failed");
                }
            })
        } catch (e) {
            console.log(e)
        }
    }
    function Documents(props) {
        var files = props.files;
        if (files != undefined) {
            return  <Collapse onChange={onChange}>
                        <Panel header={files.file_name}>
                            <iframe
                                src={files.file_url}
                                title={files.file_name}
                                width="100%"
                                height="1200"
                            ></iframe>
                        </Panel>
                    </Collapse>
        }

        return null;

    }
    const [pdfList ,changePdfList] = useState([]);
    const [fileList,changeFileList] = useState([])
    function userIsSubmit(){
        console.log("studentList",studentList,USERMESSAGE && USERMESSAGE.uid);
        const _uid = USERMESSAGE && USERMESSAGE.uid;
        const index = studentList && studentList.findIndex((item) => {
            return item.sid === _uid && item.file && item.file.file_url
        })
        return index >= 0
    }
    function ProjectWorks() {
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
                                {
                                    checkISFeed(student.a_feedback) &&
                                    checkISFeed(student.p_feedback) &&
                                    userRole === "CA" &&
                                    <div style={{
                                        marginTop : "10px"
                                    }}>
                                        <Popconfirm
                                            placement="top"
                                            title={student.award === 0 ? "Are you sure award?" :
                                                "Are you sure cancel award"}
                                            okText="Yes"
                                            cancelText="No"
                                            onConfirm={() => {
                                                giveAward({
                                                    "uid": uid,
                                                    "proj_id": pid,
                                                    "sid": student.sid,
                                                    "award": student.award === 0 ? 1 : 0
                                                }).then(res => {
                                                    if(res.code === 200){
                                                        message.success(`${student.award === 0 ? "Award" : "Cancel award"} successfully`);
                                                        setPageState(pagestate + 1);
                                                    }else{
                                                        message.error(`${student.award === 0 ? "Award" : "Cancel award"} failed`);
                                                    }
                                                })
                                            }}
                                        >
                                         <Button
                                             type={student.award === 0 ?'primary' : null}>
                                             {student.award === 0 ? "AWARD" : "CANEL AWARD"}
                                         </Button>
                                        </Popconfirm>
                                    </div>
                                }
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
                        disabled={!!userIsSubmit()}
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
                                changePdfList([pdf_url]);

                            }else{
                                changePdfList([])
                            }
                            changeFileList(fileList)
                        }}
                        fileList={fileList}
                        action="http://127.0.0.1:5000/upload_file"
                        className="upload-list-inline">
                        <Button   disabled={!!userIsSubmit()}
                                  icon={<UploadOutlined />}>Upload (Max: 1)</Button>
                    </Upload>
                    <br />
                    {
                      !userIsSubmit() &&
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
                                            setPageState(pagestate + 1);
                                        }else{
                                            message.error("Submit failed");
                                        }
                                    })
                                }}
                                type='primary' style={{ width: 300, marginTop: 20 }}>Submit</Button>
                        </Space>
                    }
                    {
                        !!userIsSubmit() &&
                        getFeedBackForUser()

                    }
                </div>
            )


        }
        return null;
    }
    function checkISFeed(feed){
        return feed && feed !== "None"
    }
    function getFeedBackForUser(){
        const _uid = USERMESSAGE && USERMESSAGE.uid;
        const index = studentList && studentList.findIndex((item) => {
            return item.sid === _uid && item.file && item.file.file_url
        })
        if(index >= 0){
           const _lst =  studentList[index];
           const {a_feedback,p_feedback} = _lst;
           let a_list = [];
           if(checkISFeed(a_feedback)){
               a_list.push(<>
                           <Title level={5}>Course Authority Feedback</Title>
                           <Paragraph>
                               {a_feedback}
                           </Paragraph>
                           <br />
                       </>)

           }
            if(checkISFeed(p_feedback)){
                a_list.push(<>
                    <Title level={5}>Proposer Feedback</Title>
                    <Paragraph>
                        {p_feedback}
                    </Paragraph>
                    <br />
                </>)

            }
            return a_list.map((item) => {
                return item
            })
        }
        return null
    }
    function Feedbacks(props) {
        const [feedback, setFeedback] = useState('');

        const student = props.student
        if (!student.file || !student.file.file_url) {
            return null;
        }
        const _list = [];
        if (checkISFeed(student.a_feedback)) {
            _list.push (
                <>
                    <Title level={5}>Course Authority Feedback</Title>
                    <Paragraph>
                        {student.a_feedback}
                    </Paragraph>
                    <br/>
                </>
            )
        }
        if (checkISFeed(student.p_feedback)) {
            _list.push (
                <>
                    <Title level={5}>Proposer Feedback</Title>
                    <Paragraph>
                        {student.p_feedback}
                    </Paragraph>
                    <br/>
                </>
            )
        }
        if ((userRole === "CA" && !checkISFeed(student.a_feedback)) ||
            (userRole === "P" && !checkISFeed(student.p_feedback))) {
            _list.push (
                <>
                    <Title level={5}>Enter feedback</Title>
                    <Input
                        key={project.proj_name}
                        placeholder="Enter your project work feedback here"
                        onChange={(e) => {
                            setFeedback(e.target.value);
                        }}
                    />
                    <br/>
                    <Button type='primary' onClick={() => {
                        console.log(pid, uid, student.sid, feedback);
                        sendFeedback(pid, uid, student.sid, feedback);
                    }}
                            style={{width: 300, marginTop: 20}}>Submit Feedback</Button>
                </>
            )
        }
        return _list.map(item => item)
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