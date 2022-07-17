import PageBase from '../basePage';
import projectStyle from "./project.less";

import React, { useRef, onChange, useState } from 'react';
import { UploadOutlined } from '@ant-design/icons';
import { Col, Row, Collapse, Typography, Button, Space, Input, message, Upload, Comment, Avatar, Tooltip } from 'antd';
const { Dragger } = Upload;
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { MailOutlined, DeleteOutlined, FormOutlined } from "@ant-design/icons"
const { Title, Paragraph, Text, Link } = Typography;

const TextIndex = ({ USERMESSAGE }) => {
    const ref = useRef();
    const { Panel } = Collapse;
    const fileList = [
        {
            uid: '-1',
            name: 'test.pdf',
            status: 'done',
            url: 'https://www.orimi.com/pdf-test.pdf',
        },
        {
            uid: '-2',
            name: 'error.png',
            status: 'error',
        },
    ];
    var role = "S";
    //role = "CA";
    var reviewed = true;
    //reviewed = false;

    function Documents(props) {
        <style dangerouslySetInnerHTML={{
            __html: projectStyle
        }} />

        // for CA P Submitted
        if (props.userRole != "S" || props.reviewed) {
            return (
                <>
                    <Title level={3}>Work submitted by student</Title>
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
                    <Title level={3}>Submitted documents</Title>
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
                </>
            )
        }
        else {
            // for S, work not reviewed
            return (
                <>
                    <Title level={3}>Upload documents here:</Title>
                    <Upload
                        action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
                        listType="picture"
                        defaultFileList={[...fileList]}
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
    function Feedbacks(props) {
        if (props.reviewed) {
            return (
                <>
                    <Title level={4}>Project work feedback</Title>
                    <Paragraph>
                        You showed incredible leadership instincts in your work on that project. I would love to work with you to develop those skills. Amazing work.
                        You have all the qualities we look for in a leader. I hope you might consider taking them to the next level by leading our next big project in this area.
                    </Paragraph>
                    <br />
                    <Button type='primary' style={{ width: 300, marginTop: 20 }}>Back</Button>
                </>
            )
        } else if (!props.reviewed && props.userRole == "S") {
            return (
                <>
                    <Title level={4}>Project work feedback</Title>
                    <Paragraph>
                        No feedbacks yet
                    </Paragraph>

                    <Button type='primary' style={{ width: 300, marginTop: 20 }}>Back</Button>

                </>
            )
        } else {
            return (
                <>
                    <Title level={4}>Enter feedback</Title>
                    <Input placeholder="Enter your project work feedback here" />
                    <br />
                    <Button type='primary' style={{ width: 300, marginTop: 20 }}>Submit Feedback</Button>

                </>
            )
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
                                    <Title>Natural Language Processing with Disaster Tweets</Title>
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
                                        Twitter has become an important communication channel in times of emergency. The ubiquitousness of smartphones enables people to announce an emergency they’re observing in real-time. Because of this, more agencies are interested in programatically monitoring Twitter (i.e. disaster relief organizations and news agencies).
                                    </Paragraph>

                                </Space>
                            </Col>
                        </Row>
                        <br />

                        <Title level={3}>Course staff of project</Title>
                        <Row>
                            <Col span={12} >
                                <Comment
                                    className="comment-box-item"
                                    author={<div>
                                        Example course authority
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
                            </Col>
                            <Col span={12} >
                                <Comment
                                    className="comment-box-item"
                                    author={<div>
                                        Example proposer
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
                            </Col>
                        </Row>
                        <br />
                        <Row>
                            <Col span={24} >
                                <Documents userRole={role} reviewed={reviewed} />
                            </Col>
                        </Row>
                        <br />
                        <Feedbacks userRole={role} reviewed={reviewed} />
                    </Col>
                    <Col span={2}></Col>
                </Row>



            </>    </PageBase>
    )
}

export default TextIndex