import PageBase from '../basePage'

import React, { useRef, onChange, useState, useEffect } from 'react'
import { Col, Row, Button, Typography, Tooltip, Space, Collapse, Steps, Select, Statistic, Comment, Avatar, Popconfirm } from 'antd';
import { MailOutlined, DeleteOutlined, FormOutlined } from "@ant-design/icons"
import { CopyToClipboard } from 'react-copy-to-clipboard';
const { Title, Paragraph, Text, Link } = Typography;
const { Step } = Steps;



const TextIndex = ({ USERMESSAGE, urlMsg }) => {

    const ref = useRef();
    const { Panel } = Collapse;
    const onChange = (key) => {
        console.log(key);
    };
    var role = "R"
    var joined = true;
    //joined = false;

    // 0待审核Pending, 1已通过approved, 2已发布open to join 
    // 3进行中in progress 4已结束ended 5未通过not approved 
    var status = 1;

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
        if (status < 1) {
            return (
                <>
                    <Button type="primary" onClick={() => {
                        ref.current.setTabPane(
                            `Project Edit`,
                            '',
                            `/project/edit?id=123`
                        )
                    }}>Edit Project</Button>
                    <br />
                    <br />
                    <br />

                    <Button>
                        Change project status
                    </Button>
                    <Select defaultValue="In Progress"
                    >
                        <Option value="0">Pending</Option>
                        <Option value="1">Approved</Option>
                        <Option value="2">Open to join</Option>
                        <Option value="3">In Progress</Option>
                        <Option value="4">Ended</Option>
                    </Select>
                </>
            )
        } else if (status <= 2) {
            return (
                <>
                    <br />
                    <br />
                    <br />

                    <Button>
                        Change project status
                    </Button>
                    <Select defaultValue="In Progress"
                    >
                        <Option value="0">Pending</Option>
                        <Option value="1">Approved</Option>
                        <Option value="2">Open to join</Option>
                        <Option value="3">In Progress</Option>
                        <Option value="4">Ended</Option>
                    </Select>
                </>
            )
        } else if (status < 5) {
            return (
                <>
                    <br />
                    <Button type="primary" onClick={() => {
                        ref.current.setTabPane(
                            `Project Work`,
                            '',
                            `/project/work?id=123`
                        )
                    }}>View works</Button>
                    <br />
                    <br />
                    <br />

                    <Button>
                        Change project status
                    </Button>
                    <Select defaultValue="In Progress"
                    >
                        <Option value="0">Pending</Option>
                        <Option value="1">Approved</Option>
                        <Option value="2">Open to join</Option>
                        <Option value="3">In Progress</Option>
                        <Option value="4">Ended</Option>
                    </Select>
                </>
            )
        } else {
            return (
                <>
                    <br />
                    <br />
                    <br />
                    <Button>
                        Not Approved
                    </Button>
                </>
            )
        }

    }
    function RButtons(props) {
        if (props.status > 0) {
            return (
                <>
                    <Button disabled type="primary" onClick={() => {
                        ref.current.setTabPane(
                            `Project Edit`,
                            '',
                            `/project/edit?id=123`
                        )
                    }}>Approve Project</Button>
                </>
            )
        }
        return (
            <>
                <Button type="primary" onClick={() => {
                    ref.current.setTabPane(
                        `Project Edit`,
                        '',
                        `/project/edit?id=123`
                    )
                }}>Approve Project</Button>
            </>
        )
    }
    function PButtons(props) {
        const status = props.status;
        if (status <= 2 || status >= 5) {
            return (
                <>
                    <Button type="primary" disabled onClick={() => {
                        ref.current.setTabPane(
                            `Project Work`,
                            '',
                            `/project/work?id=123`
                        )
                    }} >View works</Button>
                </>
            )
        }
        return (
            <>
                <Button type="primary" onClick={() => {
                    ref.current.setTabPane(
                        `Project Work`,
                        '',
                        `/project/work?id=123`
                    )
                }} >View works</Button>
            </>
        )
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
                            `/project/work?id=123`
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
                                    <Title>Natural Language Processing with Disaster Tweets</Title>
                                    <Title level={2}>A project for Machine Learning and Data Mining</Title>
                                    <Row>
                                        <Col span={12}>
                                            <Title level={4}>Start Time</Title>
                                            <Title level={5}>2022/05/01</Title>
                                        </Col>
                                        <Col span={12}>
                                            <Title level={4}>End time</Title>
                                            <Title level={5}>2022/08/01</Title>
                                        </Col>
                                    </Row>
                                    <Paragraph>
                                        Twitter has become an important communication channel in times of emergency. The ubiquitousness of smartphones enables people to announce an emergency they’re observing in real-time. Because of this, more agencies are interested in programatically monitoring Twitter (i.e. disaster relief organizations and news agencies)
                                    </Paragraph>
                                    <Space direction="vertical" size="middle" style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-around' }}>
                                        <div>
                                            <Title level={4}>Course Authority:</Title>
                                            <Comment
                                                className="comment-box-item"
                                                author={<div>
                                                    Example Course Authority
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
                                        </div>
                                        <div>
                                            <Title level={4}>Project Proposer:</Title>
                                            <Comment
                                                className="comment-box-item"
                                                author={<div>
                                                    Example Project Proposer
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
                                        </div>
                                    </Space>
                                </Space>
                            </Col>
                            <Col span={4}></Col>
                            <Col span={6} style={{ display: 'flex', flexDirection: 'column', justifyContent: 'start' }}>
                                <br />
                                <ProjectCapacity status={status} />
                                <br />
                                <Buttons userRole={role} status={status} />
                                <SubmitWorkButton userRole={role} status={status} />
                            </Col>
                        </Row>
                        <br />
                        <Title level={3}>Project current progress</Title>
                        <br />
                        <ProgressBars userRole={role} />
                        <br />
                        <Row>
                            <Col span={24}>
                                <Title level={3}>Embedded documents</Title>
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
                                        <iframe src="https://onedrive.live.com/embed?resid=1B47937AD843C12%2184207&amp;authkey=%21AOztocS2WvBRawc&amp;em=2&amp;wdAr=1.7777777777777777" width="476px" height="288px" frameborder="0">This is an embedded <a target="_blank" href="https://office.com">Microsoft Office</a> presentation, powered by <a target="_blank" href="https://office.com/webapps">Office</a>.</iframe>
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