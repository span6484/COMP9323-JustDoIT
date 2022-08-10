import PageBase from '../basePage'
import React, { useRef, onChange, useState, useEffect } from 'react'
import { Col, Row, Button, Typography, Tooltip, Space, Collapse, Steps, Input, Statistic, Comment, Avatar, Popconfirm, message } from 'antd';
import { MailOutlined, DeleteOutlined, FormOutlined, UnderlineOutlined } from "@ant-design/icons"
import { CopyToClipboard } from 'react-copy-to-clipboard';
import Search from 'antd/lib/transfer/search';
import moment from 'moment';
const { Title, Paragraph, Text, Link } = Typography;
const { Step } = Steps;
import _ from "lodash"
import "./detail.less"
import {changeProjectStatus, joinQuitProject} from "../MockData"
const TextIndex = ({ USERMESSAGE, urlMsg }) => {
    const ref = useRef();
    //console.log(USERMESSAGE);
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
    const pid = urlMsg.asPath.toString().replace('/project/detail?id=', '');
    const { Panel } = Collapse;
    const [pagestate, setPageState] = useState(0);
    const [project, setProject] = useState({});
    const [posts, setPosts] = useState({});
    useEffect(() => {
        setTimeout(() => {
            ref?.current.getTabPane(urlMsg.asPath, `Project Name`)
        }, 0);
        // fetch project info on load
        getProjectDetail()
        // fetch posts
        try {
            //console.log('fetch posts for proj', pid);
            fetch('http://127.0.0.1:5000/view_comment', {
                method: 'POST',
                headers: {
                    "content": 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                body: JSON.stringify({ "proj_id": pid })
            }).then(res => {
                res.json().then((val) => {
                    setPosts(val.result);
                    // console.log('Get posts ', posts);
                });
            });
        } catch (e) {
            console.log(e)
        };
    }, [pagestate]);
    // 0待审核Pending, 1已通过approved, 2已发布open to join 3进行中in progress 4已结束ended 5未通过not approved 
    // change to => status(0: 待审核，1: 审核通过/2: 审核未通过，3 已发布 4: 项目进行中，5: 项目已结束
    var status = project.status;
    switch (project.status) {
        case 2:
            status = 5;
            break;
        case 3:
            status = 2;
            break;
        case 4:
            status = 3;
            break;
        case 5:
            status = 4;
            break;
    }
    const onChange = (key) => {
        console.log(key);
    };
    function getProjectDetail() {
        // fetch project info
        try {
            fetch('http://127.0.0.1:5000/view_project', {
                method: 'POST',
                headers: {
                    "content": 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                body: JSON.stringify({ "proj_id": pid, "uid": uid, })
            }).then(res => {
                res.json().then((val) => {
                    // convert datetime
                    val.result.start_time = moment(val.result.start_time).format('YYYY-MM-DD');
                    val.result.close_time = moment(val.result.close_time).format('YYYY-MM-DD');
                    setProject(val.result);
                    console.log('project val:', val.result);
                    ref?.current.getTabPane(urlMsg.asPath, val.result?.proj_name || "")
                });
            });
        } catch (e) {
            console.log(e)
        };
    }
    function approveProject(pid, uid) {
        sendChangeProjectStatus(pid, uid, 1);
    }
    function disapproveProject(pid, uid) {
        sendChangeProjectStatus(pid, uid, 2);
    }
    function sendChangeProjectStatus(pid, uid, status) {
        try {
            changeProjectStatus({
                "proj_id": pid,
                "uid": uid,
                "status": status
            }).then(res => {
                if(res.code === 200){
                    message.success("Change status successfully");
                    setPageState(pagestate + 1);
                }else{
                    message.error("Change status failed")
                }
            })
        } catch (e) {
            console.log(e)
        }
    }
    function sendJoinQuitProject(pid, uid, join_state) {
        joinQuitProject({
            "proj_id": pid,
            "sid": uid,
            "join_state": join_state
        }).then(res => {
            if(res.code === 200){
                message.success("Join project successfully");
                const _project = _.cloneDeep(project);
                _project.is_join = join_state;
                setProject(_project)
            }else{
                message.error("Join project failed")
            }
            setPageState(pagestate + 1);
        })
    }
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
        if (uid == project.authority_id) {
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
                            ref.current.setTabPane(
                                `Project Edit`,
                                '',
                                `/project/edit?id=${pid}`
                            )
                        }}>Edit Project</Button>
                        <br />
                        <Button type="primary" onClick={() => {
                            sendChangeProjectStatus(pid, uid, 3);
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
        return null;
    }
    function RButtons(props) {
        if (props.status == 0) {
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
        return null;
    }
    function PButtons(props) {
        const status = props.status;
        if (uid == project.proposer_id) {
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
                return null;
            }
        }
        return null;
    }
    function SButtons(props) {
        if (props.status === 2) {
            if (project.is_join) {
                return (
                    <>
                        <Popconfirm
                            placement="bottomRight"
                            title={"Quit this project now?"}
                            okText="Yes"
                            cancelText="No"
                            onConfirm={() => {
                                sendJoinQuitProject(pid, uid, 0)
                            }}
                        >
                            <Button >Quit Project</Button>
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
                            onConfirm={() => {
                                sendJoinQuitProject(pid, uid, 1)
                            }}
                        >
                            <Button type="primary">Join Project</Button>
                        </Popconfirm>
                    </>
                )
            }
        }else if(userRole === "S" && status === 4 && !!project.is_join){
            return  <Button type="primary" onClick={() => {
                ref.current.setTabPane(
                    `Project Work`,
                    '',
                    `/project/work?id=${pid}`
                )
            }}>View works</Button>
        } else {
            return null;
        }
    }
    function SubmitWorkButton(props) {
        if (props.userRole == "S" && props.status == 3 && !!project.is_join) {
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
        if (status <= 1 || status >= 5) {
            return null;

        } else {
            return <Statistic style={{ textAlign: 'center' }} title="Project Capacity" value={cur_num} suffix={`/ ${max_num}`} />
        }
    }
    function AddComment() {
        const [newComment, setNewComment] = useState("");
        const handleClick = (event) => {
            // console.log("Add comment to proj", pid, 'by', uid);
            try {
                fetch('http://127.0.0.1:5000/add_comment', {
                    method: 'POST',
                    headers: {
                        "content": 'application/json',
                        'Access-Control-Allow-Origin': '*'
                    },
                    body: JSON.stringify({ "proj_id": pid, "uid": uid, "content": newComment })
                }).then(res => {
                    res.json().then((val) => {
                        setPageState(pagestate + 1);
                    });
                });
            } catch (e) {
                console.log(e)
            }
        }
        return (
            <>
                <Title level={5}> Add Comment
                </Title>
                {/*<Input.Group compact*/}
                {/*    style={{ display: 'flex', flexDirection: 'row', width: 'fit-content' }}*/}
                {/*>*/}
                {/*    <Input.TextArea*/}
                {/*        type="text"*/}
                {/*        style={{*/}
                {/*            width:"100%"*/}
                {/*        }}*/}
                {/*        placeholder={"Please holder your comment"}*/}
                {/*        value={newComment}*/}
                {/*        onChange={(e) => setNewComment(e.target.value)} />*/}
                {/*    /!*<Button onClick={handleClick}>Send</Button>*!/*/}
                {/*</Input.Group>*/}
                <Input.TextArea
                    type="text"
                    style={{
                        width:"80%"
                    }}
                    allowClear
                    autoSize={{
                        minRows: 2,
                        maxRows: 5,
                    }}
                    showCount
                    maxLength={600}
                    placeholder={"Please holder your comment"}
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)} />
                <div style={{
                    width:"80%",
                    margin:"30px 0 10px 0"
                }}>
                    <Button
                        style={{
                            float : "right"
                        }}
                        onClick={handleClick}>Send</Button>
                    <div style={{
                        clear:"both"
                    }}/>
                </div>
            </>
        )
    }
    function ReplyComment(props) {
        // console.log(props);
        var target_uid = props.target_uid;
        var parent_id = props.parent_id;
        var root_id = props.root_id;
        // console.log(target_uid, parent_id, root_id);
        const [newComment, setNewComment] = useState("");
        const handleClick = (event) => {
            // console.log("Reply comment to proj", pid, 'by', uid);
            // console.log('target_uid, parent_id, root_id');
            // console.log(target_uid, parent_id, root_id);
            try {
                fetch('http://127.0.0.1:5000/reply_comment', {
                    method: 'POST',
                    headers: {
                        "content": 'application/json',
                        'Access-Control-Allow-Origin': '*'
                    },
                    body: JSON.stringify({
                        "proj_id": pid,
                        "uid": uid,
                        "content": newComment,
                        "target_uid": target_uid,
                        "parent_id": parent_id,
                        "root_id": root_id
                    })
                }).then(res => {
                    res.json().then((val) => {
                        setPageState(pagestate + 1);
                    });
                });
            } catch (e) {
                console.log(e)
            }
        }
        return (
            <>
                <form style={{ width: '80%' }}>
                    {/*<Input placeholder="Reply" type="text"*/}
                    {/*    value={newComment}*/}
                    {/*    onChange={(e) => setNewComment(e.target.value)} />*/}
                    {/*<Button onClick={handleClick}>Send</Button>*/}
                    <Input.TextArea
                        type="text"
                        style={{
                            width:"80%"
                        }}
                        allowClear
                        autoSize={{
                            minRows: 2,
                            maxRows: 5,
                        }}
                        showCount
                        maxLength={600}
                        placeholder={"Please holder your reply"}
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)} />
                    <div style={{
                        width:"80%",
                        margin:"30px 0 10px 0"
                    }}>
                        <Button
                            style={{
                                float : "right"
                            }}
                            onClick={handleClick}>Send</Button>
                        <div style={{
                            clear:"both"
                        }}/>
                    </div>
                </form>

            </>
        )
    }
    function CommentDeleteButton(props) {
        if (props.uid == uid) {
            return (
                <Button style={{ border: 'none' }} onClick={() => handleDeleteComment(props.cm_id, uid)}><DeleteOutlined /></Button>
            )
        }
        return null;
    }

    const handleDeleteComment = (cid, uid) => {
        // console.log("Delete comment ", cid, "by", uid);
        try {
            fetch('http://127.0.0.1:5000/delete_comment', {
                method: 'POST',
                headers: {
                    "content": 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                body: JSON.stringify({
                    "uid": uid,
                    "cm_id": cid
                })
            }).then(res => {
                res.json().then((val) => {
                    setPageState(pagestate + 1);
                });
            });
        } catch (e) {
            console.log(e)
        }
    }
    function ProjectForum(props) {
        // "target_uid": "cm00002",
        // "parent_id": "u10002",
        // "root_id": "cm00001"
        var status = props.status;
        // console.log("project is in", status);
        // console.log("posts ", posts);

        if (status >= 2 && status <= 4 || true) {
            if (posts != undefined) {
                var comments = posts.posts;
                if (comments != undefined) {
                    // console.log("number of comments", comments.length);
                    // console.log("comments are ", comments)
                    return (
                        <>
                            <Title level={3}>Forum</Title>
                            <AddComment />
                            {comments.map((item,index) => {
                                return (
                                    <>
                                        <Comment key={'comment' + item.root_id}
                                            author={<a>{item.root_name}</a>}
                                            avatar={<Avatar src="/static/ca.png" />}
                                            content={
                                                <>
                                                    <Space direction="horizontal" size="middle" >
                                                        <p>{item.root_content}</p>
                                                        <CommentDeleteButton key={'commentDel' + item.root_id} uid={item.root_uid} cm_id={item.root_id} />
                                                    </Space>
                                                    <div style={{
                                                         marginTop : "5px"
                                                    }}>
                                                        <span
                                                            onClick={()=>{
                                                                const _posts = _.cloneDeep(posts);
                                                                const _comments = _.cloneDeep(comments);
                                                                for(let i = 0 ; i < _comments.length ; i++){
                                                                    if(i === index){
                                                                        _comments[index].showReplayInput = !_comments[index].showReplayInput ;
                                                                    }else{
                                                                        _comments[i].showReplayInput = false;
                                                                    }
                                                                }

                                                                _posts.posts = _comments
                                                                setPosts(_posts);
                                                            }}
                                                                style={{
                                                                    cursor : "pointer",
                                                                    color : "#2f54eb",
                                                                    fontSize: "14px",
                                                                    textDecoration: "underline"
                                                                }}
                                                            >
                                                            reply
                                                        </span>
                                                    </div>
                                                </>
                                            }
                                        >
                                            {
                                                item.showReplayInput &&
                                                <ReplyComment key={'commentReply' + item.root_id} target_uid={item.root_uid} parent_id={item.root_uid} root_id={item.root_id} />
                                            }


                                            {item.reply_comment.map((item) => {
                                                return (
                                                    <>
                                                        <Comment key={'comment' + item.cm_id}
                                                            author={<a>{item.owner_name}</a>}
                                                            avatar={<Avatar src="/static/ca.png" />}
                                                            content={<>
                                                                <Space direction="horizontal" size="middle" >
                                                                    <p>
                                                                        {item.content}
                                                                    </p>
                                                                    <CommentDeleteButton key={'commentDel' + item.root_id} uid={item.owner_uid} cm_id={item.cm_id} />
                                                                </Space>

                                                            </>}
                                                        >
                                                        </Comment>


                                                    </>
                                                )
                                            })}
                                        </Comment>

                                    </>
                                )
                            })}
                        </>
                    )
                } else {
                    return <><Title level={3}>Forum</Title><AddComment /></>;
                }

            } else {
                return <><Title level={3}>Forum</Title><AddComment /></>;
            }
        }
        return null;
    }
    function Documents(props) {
        var files = props.files;
        if (files != undefined) {
            return  <>
                        <Title level={4}>Specification documents</Title>
                        <Collapse onChange={onChange}>
                                    <Panel header={files.file_name}>
                                        <iframe
                                            src={files.file_url}
                                            title={files.file_name}
                                            width="100%"
                                            height="1200"
                                        ></iframe>
                                    </Panel>
                        </Collapse>
                    </>
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
                            <Col span={6} style={{ display: 'flex', flexDirection: 'column', justifyContent: 'start' }}>
                                <br />
                                <ProjectCapacity status={status} cur_num={project.cur_num || 0} max_num={project.max_num || 10} />
                                <br />
                                <Buttons userRole={userRole} status={status} />
                                <SubmitWorkButton userRole={userRole} status={status} />
                            </Col>
                        </Row>
                        <br />
                        <Title level={4}>Project current progress</Title>
                        <ProgressBars userRole={userRole} />
                        <br />
                        <br />
                        <Row>
                            <Col span={24}>
                                <Documents files={project.files} />
                            </Col>
                        </Row>
                        <br />
                        <br />
                        {
                            (project.status === 3 || project.status === 4 || project.status === 5)
                            &&
                            <Row>
                                <Col span={24}>
                                    < ProjectForum status={status} />
                                </Col>
                            </Row>
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