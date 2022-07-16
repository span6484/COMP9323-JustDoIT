import PageBase from '../basePage'
import React, { useRef, onChange, useState, useEffect } from 'react'
import { Col, Row, Button, Typography, Tooltip, Space, Collapse, Steps, Popover, Statistic, Comment, Avatar, Popconfirm } from 'antd';
import { MailOutlined, DeleteOutlined, FormOutlined } from "@ant-design/icons"
import { CopyToClipboard } from 'react-copy-to-clipboard';
const { Title, Paragraph, Text, Link } = Typography;

const TextIndex = ({ USERMESSAGE, urlMsg }) => {
    var role = "S"
    var joined = true;
    const ref = useRef();
    const { Panel } = Collapse;
    const onChange = (key) => {
        console.log(key);
    };

    useEffect(() => {
        setTimeout(() => {
            ref?.current.getTabPane(urlMsg.asPath, `Project Name`)
        }, 0)
    }, [])
    const { Step } = Steps;
    // var userRole = ("CA", "S", "P","R");
    function Buttons(props) {
        const userRole = props.userRole;
        if (userRole == "CA") {
            return <CAButtons />;
        }
        else if (userRole == "R") {
            return <RButtons />;
        }
        else if (userRole == "P") {
            return <PButtons />;
        }
        return <SButtons />;
    }
    function CAButtons() {
        return (
            <>
                <Button type="primary" href='/project/edit'>Edit Project</Button>
                <br />
                <Button type="primary" href='/project/work'>View works</Button>
            </>
        )
    }
    function RButtons() {
        return (
            <>
                <Button type="primary" href='/project/edit'>Approve Project</Button>
            </>
        )
    }
    function PButtons() {
        return (
            <>
                <Button type="primary" href='/project/work'>View works</Button>
            </>
        )
    }
    function SButtons() {
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
                    <br />
                    <Button type="primary" href='/project/work'>Submit Work</Button>

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
    function ProgressBars(props) {
        const userRole = props.userRole;
        if (userRole == "CA" || userRole == "R") {
            return (
                <>
                    <Steps current={3}>
                        <Step title="Pending" description="Project being reviewed" />
                        <Step title="Approved" description="Approved by course authority" />
                        <Step title="Open to join" description="Open to student to join" />
                        <Step title="In Progress" description="Project in progress" />
                        <Step title="Ended" description="Student works are submitted" />
                    </Steps>
                </>
            );
        } else if (userRole == "P") {
            return (
                <>
                    <Steps current={1}>
                        <Step title="Pending" description="Project being reviewed" />
                        <Step title="Not Approved" description="Not approved by course authority" />
                    </Steps>
                </>
            );
        }
        return (
            <>
                <Steps current={0}>
                    <Step title="Open to join" description="Open to student to join" />
                    <Step title="In Progress" description="Project in progress" />
                    <Step title="Ended" description="Student works are submitted" />
                </Steps>
            </>
        );
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
                                    <Title>Example project name</Title>
                                    <Title level={2}>A project for Example course name</Title>
                                    <Row>
                                        <Col span={12}>
                                            <Title level={4}>Start Time</Title>
                                            <Title level={5}>2025/01/01</Title>
                                        </Col>
                                        <Col span={12}>
                                            <Title level={4}>End time</Title>
                                            <Title level={5}>2025/03/01</Title>
                                        </Col>
                                    </Row>
                                    <Paragraph>
                                        Example project description
                                        <br />
                                        More than 1.2 billion invoices are exchanged in Australia every year, with around 90 percent
                                        of invoice processing still partly or fully manual. Over the past 2 years, the Government has
                                        invested nearly $20M to facilitate e-invoicing adoption across Australia. In New South Wales
                                        state government, agencies will have to use e-invoicing for goods and services valued at up to
                                        AUD 1 million from 2022. It is expected that this will be extended to all transactions in the
                                        longer term.
                                        The use of e-invoicing requires each company participating in an e-invoice exchange to have
                                        a specialised software infrastructure to satisfy existing regulations. Most provided solutions
                                        are in the form of a complete package that offers several functionalities for participating in
                                        the e-invoicing exchange. However, such solutions may not be suitable in all contexts and are
                                        often expensive or tied to the use of other products. For example, Xero offers e-invoicing
                                        facilities as part of their cloud solution, but a company would need to migrate all their
                                        accounting system to Xero first before they can use them. Therefore, there is a need to offer
                                        custom-made solutions for niche areas that will address the requirements of small players like
                                        SMEs.
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
                                <Statistic style={{ textAlign: 'center' }} title="Project Capacity" value={23} suffix="/ 33" />
                                <br />
                                <Buttons userRole={role} />

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