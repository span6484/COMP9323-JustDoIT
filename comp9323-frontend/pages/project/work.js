import PageBase from '../basePage';
import projectStyle from "./project.less";

import React, { useRef, onChange, useState, useEffect } from 'react';
import { UploadOutlined } from '@ant-design/icons';
import { Col, Row, Collapse, Typography, Button, Space, Input, message, Upload, Comment, Avatar, Tooltip, Tabs } from 'antd';
const { Dragger } = Upload;
const { TabPane } = Tabs;
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { MailOutlined, DeleteOutlined, FormOutlined } from "@ant-design/icons"
const { Title, Paragraph, Text, Link } = Typography;

const TextIndex = ({ USERMESSAGE, urlMsg }) => {
    const ref = useRef();
    console.log(urlMsg, USERMESSAGE);
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

    const [project, setProject] = useState({});
    project.start_time = (new Date(project.start_time)).toLocaleDateString();
    project.close_time = (new Date(project.close_time)).toLocaleDateString();
    var status = project.status;

    var reviewed = false;
    var submitted = false;

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
                    console.log(val.result);
                    setProject(val.result);
                });
            });
        } catch (e) {
            console.log(e)
        };
        // fetch works
        // try {
        //     fetch('http://localhost:5000/view_project', {
        //         method: 'POST',
        //         headers: {
        //             "content": 'application/json',
        //             'Access-Control-Allow-Origin': '*'
        //         },
        //         body: JSON.stringify({ "proj_id": pid })
        //     }).then(res => {
        //         res.json().then((val) => {
        //             console.log(moment(val.result.start_time).isValid());

        //             console.log(val.result);
        //             console.log(moment(val.result.start_time).isValid());
        //             console.log(val.result.start_time, val.result.close_time);
        //             setProject(val.result);
        //         });
        //     });
        // } catch (e) {
        //     console.log(e)
        // };

    }, []);

    function Documents(props) {
        <style dangerouslySetInnerHTML={{
            __html: projectStyle
        }} />

        // for CA P Submitted
        if (props.userRole != "S" || props.reviewed) {
            return (
                <>
                    <Title level={3}>Submissions by students</Title>
                    <Tabs
                        defaultActiveKey="1"
                        style={{

                        }}
                    >
                        {[
                            ...Array.from(
                                {
                                    length: 30,
                                },
                                (_, i) => i,
                            ),
                        ].map((i) => (
                            <TabPane tab={`Student-${i}`} key={i} disabled={i === 28}>
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

    }
    function Feedbacks(props) {
        if (!props.submitted) {
            return null;
        }
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
                                </Space>
                            </Col>
                        </Row>

                        <br />
                        <Row>
                            <Col span={24} >
                                <Documents userRole={userRole} reviewed={reviewed} submitted={submitted} />
                            </Col>
                        </Row>
                        <br />
                        <Feedbacks userRole={userRole} reviewed={reviewed} submitted={submitted} />
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