import PageBase from '../basePage'
import React, { useRef, onChange, useState, useEffect } from 'react'
import { Col, Row, Button, Typography, Tooltip, Space, Collapse, Steps, Input, Statistic, Comment, Avatar, Popconfirm } from 'antd';
import { MailOutlined, DeleteOutlined, FormOutlined, UnderlineOutlined } from "@ant-design/icons"
import { CopyToClipboard } from 'react-copy-to-clipboard';
import Search from 'antd/lib/transfer/search';
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
    const [posts, setPosts] = useState({});


    const changeAddComment = (e) => {
        setNewComment(e.target.value);
        console.log(e.target.value, newComment);
    };
    const handleAddComment = (pid, uid) => {
        console.log(pid, uid, newComment);
    };

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
                    'Access-Control-Allow-Origin': '*'
                },
                body: JSON.stringify({ "proj_id": pid, "uid": uid, "status": status })
            }).then(res => {
                res.json().then((val) => {
                    console.log("res val = ", val);
                    window.location.reload();
                });
            });
        } catch (e) {
            console.log(e)
        }
    }
    function openProject(pid, uid, status) {
        try {
            fetch('http://localhost:5000/change_project_status2', {
                method: 'POST',
                headers: {
                    "content": 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                body: JSON.stringify({ "proj_id": pid })
            }).then(res => {
                res.json().then((val) => {
                    console.log("res val = ", val);
                    window.location.reload();
                });
            });
        } catch (e) {
            console.log(e)
        }
    }
    useEffect(() => {
        setTimeout(() => {
            ref?.current.getTabPane(urlMsg.asPath, `Project Name`)
        }, 0);
        // fetch project info on load
        try {
            fetch('http://localhost:5000/view_project', {
                method: 'POST',
                headers: {
                    "content": 'application/json',
                    'Access-Control-Allow-Origin': '*'
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
        };
        // fetch posts
        try {
            console.log('fetch posts for proj', pid);
            fetch('http://localhost:5000/view_comment', {
                method: 'POST',
                headers: {
                    "content": 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                body: JSON.stringify({ "proj_id": pid })
            }).then(res => {
                res.json().then((val) => {
                    setPosts(val.result);
                    console.log('Get posts ', posts);
                });
            });
        } catch (e) {
            console.log(e)
        };
    }, []);

    const uid = "u00001";
    // student u00005
    // CA u00001

    //console.log(project);
    // convert datetime
    // project.start_time = (new Date(project.start_time)).toLocaleDateString();
    // project.close_time = (new Date(project.close_time)).toLocaleDateString();

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
        } else if (status == 1) {
            return (
                <>
                    <Button type="primary" onClick={() => {
                        openProject(pid);
                    }}>Open Project To Join</Button>
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
            return null;
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
        const cur_num = props.cur_num;
        const max_num = props.max_num;
        // if (status <= 1 || status >= 5) {
        //     return null;

        // } else {
        return <Statistic style={{ textAlign: 'center' }} title="Project Capacity" value={cur_num} suffix={`/ ${max_num}`} />
        // }
    }
    function AddComment() {
        const [newComment, setNewComment] = useState("");
        const handleClick = (event) => {
            console.log("Add comment to proj", pid, 'by', uid);
            try {
                fetch('http://localhost:5000/add_comment', {
                    method: 'POST',
                    headers: {
                        "content": 'application/json',
                        'Access-Control-Allow-Origin': '*'
                    },
                    body: JSON.stringify({ "proj_id": pid, "uid": uid, "content": newComment })
                }).then(res => {
                    res.json().then((val) => {
                        window.location.reload();
                    });
                });
            } catch (e) {
                console.log(e)
            }
        }
        return (
            <>
                <Title level={3}> Add Comment</Title><Input.Group compact>
                    <Input
                        type="text"
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)} />
                    <Button onClick={handleClick}>Send</Button>
                </Input.Group>
            </>
        )
    }

    function ProjectForum(props) {
        var status = props.status;
        console.log("project is in", status);
        console.log("posts ", posts);
        if (status >= 2 && status <= 4 && posts != undefined) {
            var comments = posts.posts;
            if (comments != undefined) {
                console.log("number of comments", comments.length);
                console.log("comments are ", comments)
                return (
                    <>
                        <Title level={3}>Forum</Title>
                        {comments.map((item, index) => {
                            return (
                                <>
                                    <Comment
                                        actions={[<form style={{ display: 'flex', flexDirection: 'row' }}>
                                            <Input placeholder="Reply" ></Input>
                                            <Button>Send</Button>
                                        </form>]}
                                        author={<a>{item.root_name}</a>}
                                        avatar={<Avatar src="/static/ca.png" />}
                                        content={<p>
                                            {item.root_content}
                                        </p>}
                                    >
                                        {item.reply_comment.map((item) => {
                                            return (
                                                <>
                                                    <Comment
                                                        author={<a>{item.target_name}</a>}
                                                        avatar={<Avatar src="/static/ca.png" />}
                                                        content={<p>
                                                            {item.content}
                                                        </p>}
                                                    >
                                                    </Comment>
                                                </>
                                            )
                                        })}
                                    </Comment>

                                </>
                            )
                        })}

                        <AddComment />
                    </>
                )
            }

        }
        return null;
    }
    function Documents(props) {
        var files = props.files;
        if (files != undefined) {
            console.log("display documents", Array.from(files));
            console.log("number of docs", files.length);
            if (files.length > 0) {
                return (
                    <>
                        <Title level={3}>Specification documents</Title>
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
                                <ProjectCapacity status={status} cur_num={project.cur_num} max_num={project.max_num} />
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
                                <Documents files={project.files} />
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