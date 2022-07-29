import PageBase from '../basePage'
import React, { useRef, onChange, useState, useEffect } from 'react'
import { Col, Row, Button, Typography, Tooltip, Space, Collapse, Steps, Select, Statistic, Comment, Avatar, Popconfirm } from 'antd';
import { MailOutlined, DeleteOutlined, FormOutlined } from "@ant-design/icons"
import { CopyToClipboard } from 'react-copy-to-clipboard';
const { Title, Paragraph, Text, Link } = Typography;
const { Step } = Steps;



const TextIndex = ({ USERMESSAGE, urlMsg }) => {
    const ref = useRef();
    console.log(USERMESSAGE);
    // get project id from url 
    var pid = urlMsg.asPath.toString().replace('/project/detail?id=', '');
    console.log(pid);
    const { Panel } = Collapse;
    const onChange = (key) => {
        console.log(key);
    };
    var useRole;
    const [project, setProject] = useState({});
    function approveProject(pid, uid) {
        sendChangeProjectStatus(pid, uid, 1);
    }
    function disapproveProject(pid, uid) {
        sendChangeProjectStatus(pid, uid, 2);
    }
    function sendChangeProjectStatus(pid, uid, status) {
        try {
            fetch('http://localhost:5000/change_project_status', {
                method: 'POST',
                headers: {
                    "content": 'application/json',
                },
                body: JSON.stringify({ "proj_id": pid, "uid": uid, "status": status })
            }).then(res => {
                res.json().then((val) => {
                    console.log(val);
                    window.location.reload();
                });
            });
        } catch (e) {
            console.log(e)
        }
    }
    // fetch project info on load
    try {
        fetch('http://localhost:5000/view_project', {
            method: 'POST',
            headers: {
                "content": 'application/json',
                'Access-Control-Allow-Origin':'*'
            },
            body: JSON.stringify({ "proj_id": pid })
        }).then(res => {
            res.json().then((val) => {
                //console.log(val);
                setProject(val.result);
                console.log(project);
            });
        });
    } catch (e) {
        console.log(e)
    }
    // uid = USERMESSAGE.id
    // userRole = USERMESSAGE.userRole;
    // ========================================

    //======= comment out this to test
    // mock data
    // const val = {
    //     "code": 200,
    //     "result": {
    //         "authority_email": "heyheyname@somemail.com",
    //         "authority_id": "u00001",
    //         "authority_name": "heyheyname",
    //         "close_time": "Sun, 21 Aug 2022 00:00:00 GMT",
    //         "course_description": "This course allows students to explore principles, techniques, architectures, and enabling technologies for the development of the different components and layers of complex SaaS systems. ",
    //         "course_name": "Software as a Service Project",
    //         "cur_num": 1,
    //         "description": "hello world",
    //         "files": [
    //             {
    //                 "file_name": "test.pdf",
    //                 "file_url": "",
    //                 "type": "pdf",
    //                 "utime": "Thu, 21 Jul 2022 00:00:00 GMT"
    //             },
    //             {
    //                 "file_name": "COM9323.txt",
    //                 "file_url": "",
    //                 "type": "txt",
    //                 "utime": "Thu, 21 Jul 2022 00:00:00 GMT"
    //             }
    //         ],
    //         "max_num": 20,
    //         "proj_name": "COM9323",
    //         "proposer_email": "yaxin.su@student.unsw.edu.au",
    //         "proposer_id": "u00002",
    //         "proposer_name": "Yaxin Su",
    //         "start_time": "Thu, 21 Jul 2022 00:00:00 GMT",
    //         "status": 0
    //     }
    // };
    //project = val.result;
    const uid = "u00001";
    // ========================================

    
    console.log(project);
    // convert datetime
    project.start_time = (new Date(project.start_time)).toLocaleDateString();
    project.close_time = (new Date(project.close_time)).toLocaleDateString();

    // get roles based project users

    var useRole = "S";
    switch (uid) {
        case project.authority_id:
            useRole = "CA";
            break;
        case project.proposer_id:
            useRole = "P";
            break;
        case project.reviewer_id:
            useRole = "R";
            break;
    }
    var joined = true;
    //joined = false;

    // 0待审核Pending, 1已通过approved, 2已发布open to join 
    // 3进行中in progress 4已结束ended 5未通过not approved 
    var status = project.status;

    useEffect(() => {
        setTimeout(() => {
            ref?.current.getTabPane(urlMsg.asPath, `Project Name`)
        }, 0)
    }, [])
    // var userRole = ("CA", "S", "P","R");
    function Buttons(props) {
        const userRole = props.userRole;
        if (userRole == "CA") {
            return <CAButtons status={status} />;
        }
        else if (userRole == "R") {
            return <RButtons status={status} />;
        }
        else if (userRole == "P") {
            return <PButtons status={status} />;
        }
        return <SButtons status={status} />;
    }
    function CAButtons(props) {
        const status = props.status;
        if (status == 0) {
            return (
                <>
                    <Button type="primary" onClick={() => {
                        ref.current.setTabPane(
                            `Project Edit`,
                            '',
                            `/project/edit?id=${pid}`
                        )
                    }}>Edit Project</Button>
                    <br />
                    <Button type="primary" onClick={() => {
                        approveProject(pid, uid);
                    }}>Approve Project</Button>
                    <br />
                    <Button type="primary" onClick={() => {
                        disapproveProject(pid, uid);
                    }}>Disapprove Project</Button>
                </>
            )
        } else if (status == 2) {
            return (
                <>
                    <Button type="primary">Open Project To Join</Button>
                </>
            )
        } else if (status == 3 || status == 4) {
            return (
                <>
                    <br />
                    <Button type="primary" onClick={() => {
                        ref.current.setTabPane(
                            `Project Work`,
                            '',
                            `/project/work?id=${pid}`
                        )
                    }}>View works</Button>

                </>
            )
        } else {
            return;
        }

    }
    function RButtons(props) {
        if (props.status = 0) {
            return (
                <>
                    <Button type="primary" onClick={() => {
                        approveProject(pid, uid);
                    }}>Approve Project</Button>
                    <br />
                    <Button type="primary" onClick={() => {
                        disapproveProject(pid, uid);
                    }}>Disapprove Project</Button>
                </>
            )
        }
        return;
    }
    function PButtons(props) {
        const status = props.status;
        if (status == 0) {
            return (
                <>
                    <Button type="primary" onClick={() => {
                        ref.current.setTabPane(
                            `Project Edit`,
                            '',
                            `/project/edit?id=${pid}`
                        )
                    }}>Edit Project</Button>
                </>
            )
        } else if (status == 3 || status == 4) {
            return (
                <>
                    <br />
                    <Button type="primary" onClick={() => {
                        ref.current.setTabPane(
                            `Project Work`,
                            '',
                            `/project/work?id=${pid}`
                        )
                    }}>View works</Button>

                </>
            )
        } else {
            return;
        }
    }
    function SButtons(props) {
        if (props.status < 5) {
            if (joined) {
                return (
                    <>
                        <Popconfirm
                            placement="bottomRight"
                            title={"Quit this project now?"}
                            okText="Yes"
                            cancelText="No"
                        >
                            <Button type="primary">Quit Project</Button>
                        </Popconfirm>


                    </>
                )
            } else {
                return (
                    <>

                        <Popconfirm
                            placement="bottomRight"
                            title={"Join this project now?"}
                            okText="Yes"
                            cancelText="No"
                        >
                            <Button type="primary">Join Project</Button>
                        </Popconfirm>
                    </>
                )
            }
        }
        else {
            return null;
        }
    }

    function SubmitWorkButton(props) {
        if (props.userRole == "S" && props.status == 3) {
            return (
                <>
                    <br />
                    <Button type="primary" onClick={() => {
                        ref.current.setTabPane(
                            `Project Work`,
                            '',
                            `/project/work?id=${pid}`
                        )
                    }}>Submit Work</Button>
                </>
            )
        }
        return null;
    }
    function ProgressBars(props) {
        const userRole = props.userRole;

        if (status < 5) {
            if (userRole != "S") {

                return (
                    <>
                        <Steps current={status}>
                            <Step title="Pending" description="Project being reviewed" />
                            <Step title="Approved" description="Approved by course authority" />
                            <Step title="Open to join" description="Open to student to join" />
                            <Step title="In Progress" description="Project in progress" />
                            <Step title="Ended" description="Student works are submitted" />
                        </Steps>
                    </>
                );
            } else {
                return (
                    <>
                        <Steps current={status - 2}>
                            <Step title="Open to join" description="Open to student to join" />
                            <Step title="In Progress" description="Project in progress" />
                            <Step title="Ended" description="Student works are submitted" />
                        </Steps>
                    </>
                );
            }
        }
        return (
            <>
                <Steps current={1}>
                    <Step title="Pending" description="Project being reviewed" />
                    <Step title="Not Approved" description="Not approved by course authority" />
                </Steps>
            </>
        );
    }
    function ProjectCapacity(props) {
        const status = props.status;
        if (status <= 1 || status >= 5) {
            return null;

        } else {
            return <Statistic style={{ textAlign: 'center' }} title="Project Capacity" value={23} suffix="/ 33" />
        }
    }

    function ProjectForum(props) {
        if (props.status >= 2 && props.status < 5) {
            return (
                <>
                    <Title level={3}>Forum</Title>

                    <Comment
                        actions={[<span key="comment-nested-reply-to">Reply</span>]}
                        author={<a>Example student</a>}
                        avatar={<Avatar src="https://joeschmoe.io/api/v1/random" />}
                        content={
                            <p>
                                Hi course staff, are there any other prerequisites learning modules for this project?
                            </p>
                        }
                    >
                        <Comment
                            actions={[<span key="comment-nested-reply-to">Reply</span>]}
                            author={<a>Example course authority</a>}
                            avatar={<Avatar src="/static/ca.png" />}
                            content={
                                <p>
                                    No, you can enroll as long as you are in the course.
                                </p>
                            }
                        >
                        </Comment>
                    </Comment>
                    <Comment
                        actions={[<span key="comment-nested-reply-to">Reply</span>]}
                        author={<a>Example student</a>}
                        avatar={<Avatar src="https://joeschmoe.io/api/v1/random" />}
                        content={
                            <p>
                                Hi course staff, are suspendisse est odio imperdiet id euismod included in this project's work?
                            </p>
                        }
                    >
                    </Comment>
                </>
            )
        }
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
                            <Col span={14}>
                                <Space direction="vertical" size="middle" style={{ display: 'flex' }}>
                                    <Title>{project.project_name}</Title>
                                    <Title level={2}>A project for {project.course_name}</Title>
                                    <Row>
                                        <Col span={12}>
                                            <Title level={4}>Start Time</Title>
                                            <Title level={5}>{project.start_time}</Title>
                                        </Col>
                                        <Col span={12}>
                                            <Title level={4}>End time</Title>
                                            <Title level={5}>{project.close_time}</Title>
                                        </Col>
                                    </Row>
                                    <Paragraph>
                                        {project.description}
                                    </Paragraph>
                                    <Space direction="vertical" size="middle" style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-around' }}>
                                        <div>
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
                                        </div>
                                        <div>
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
                                        </div>
                                    </Space>
                                </Space>
                            </Col>
                            <Col span={4}></Col>
                            <Col span={6} style={{ display: 'flex', flexDirection: 'column', justifyContent: 'start' }}>
                                <br />
                                <ProjectCapacity status={status} />
                                <br />
                                <Buttons userRole={useRole} status={status} />
                                <SubmitWorkButton userRole={useRole} status={status} />
                            </Col>
                        </Row>
                        <br />
                        <Title level={3}>Project current progress</Title>
                        <br />
                        <ProgressBars userRole={useRole} />
                        <br />
                        <Row>
                            <Col span={24}>
                                <Title level={3}>Specification documents</Title>
                                <Collapse defaultActiveKey={['0']} onChange={onChange}>
                                    {project.files.map((item, index) => {
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
                            </Col>
                        </Row>
                        <br />
                        <br />
                        <Row>

                            <Col span={24}>
                                < ProjectForum status={status} />

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