import PageBase from '../basePage'
import React, { useRef, onChange, useState,useEffect } from 'react'
import { Col, Row, Button, Typography, Image, Space, Collapse, Steps, Popover, Statistic, Comment, Avatar } from 'antd';
import AllProject from "../Dashboard/AllProject";
const { Title, Paragraph, Text, Link } = Typography;

const TextIndex = ({ USERMESSAGE ,urlMsg}) => {
    const ref = useRef();
    const { Panel } = Collapse;
    const onChange = (key) => {
        console.log(key);
    };
    useEffect(()=>{
        setTimeout(()=>{
            ref?.current.getTabPane(urlMsg.asPath, `Project Name`)
        },0)
    },[])
    const { Step } = Steps;
    const ExampleComment = ({ children }) => (
        <Comment
            actions={[<span key="comment-nested-reply-to">Reply to</span>]}
            author={<a>Comp NTTT</a>}
            avatar={<Avatar src="https://joeschmoe.io/api/v1/random" alt="Han Solo" />}
            content={
                <p>
                    Proin tincidunt tortor magna. Donec vitae pulvinar sapien, quis tempus massa. Nulla dignissim nisl non viverra suscipit.
                </p>
            }
        >
            {children}
        </Comment>
    );
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
                                    <Title level={4}>Example Course Authority</Title>
                                    <br />
                                    <Paragraph>
                                        quis volutpat sit amet, tincidunt dignissim lectus. Donec nec posuere turpis, eu vulputate felis. Curabitur fringilla, velit vel pretium accumsan, purus eros iaculis ante, non laoreet sapien justo non velit. Integer at nisi nec augue congue finibus. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin tincidunt tortor magna. Donec vitae pulvinar sapien, quis tempus massa. Nulla dignissim nisl non viverra suscipit. Etiam eget imperdiet orci. Suspendisse est odio, imperdiet id euismod ac, facilisis vel odio. Cras gravida tempor lacus, non mattis sem tempor ut.
                                    </Paragraph>

                                </Space>
                            </Col>
                            <Col span={4}></Col>
                            <Col span={6} style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-around' }}>
                                <Statistic style={{ textAlign: 'center' }} title="Project Capacity" value={93} suffix="/ 100" />

                                <Button type="primary">Join Project</Button>
                                <Button type="primary">Submit Work</Button>
                                {/*<Button type="primary">Quit Project</Button>*/}
                                <Button>Edit Project</Button>
                                <Button style={{ background: 'lightblue' }}>View works</Button>
                            </Col>
                        </Row>
                        {/* <br />
                        <br />
                        <Col span={24}>
                            <Image.PreviewGroup>
                                <Space direction="horizontal" size="middle" style={{ display: 'flex', overflow: 'auto' }}>
                                    <Image width={200} src="https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png?x-oss-process=image/blur,r_50,s_50/quality,q_1/resize,m_mfit,h_200,w_200" />
                                    <Image width={200} src="https://gw.alipayobjects.com/zos/antfincdn/LlvErxo8H9/photo-1503185912284-5271ff81b9a8.webp?x-oss-process=image/blur,r_50,s_50/quality,q_1/resize,m_mfit,h_200,w_200" />
                                    <Image width={200} src="https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png?x-oss-process=image/blur,r_50,s_50/quality,q_1/resize,m_mfit,h_200,w_200" />
                                    <Image width={200} src="https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png?x-oss-process=image/blur,r_50,s_50/quality,q_1/resize,m_mfit,h_200,w_200" />
                                    <Image width={200} src="https://gw.alipayobjects.com/zos/antfincdn/LlvErxo8H9/photo-1503185912284-5271ff81b9a8.webp?x-oss-process=image/blur,r_50,s_50/quality,q_1/resize,m_mfit,h_200,w_200" />
                                </Space>
                            </Image.PreviewGroup>
                        </Col> */}
                        <br />
                        <Title level={3}>Project current progress</Title>
                        <Steps current={1}>
                            <Step title="Not started" description="Being reviewed" />
                            <Step title="Open" description="Open to student to join" />
                            <Step title="In Progress" description="Project in progress" />
                            <Step title="Ended" description="Student works are submitted" />
                        </Steps>
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
                                        <iframe
                                            src={"https://c.tenor.com/x8v1oNUOmg4AAAAd/rickroll-roll.gif"}
                                            title="file"
                                            width="100%"
                                            height="600"
                                        ></iframe>
                                    </Panel>
                                    <Panel header="Document 3" key="3">
                                        <iframe width="100%" height="800px" src="https://www.youtube.com/embed/dQw4w9WgXcQ" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
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
                                    actions={[<span key="comment-nested-reply-to">Reply to</span>]}
                                    author={<a>Comp NTTT</a>}
                                    avatar={<Avatar src="https://joeschmoe.io/api/v1/random" alt="Han Solo" />}
                                    content={
                                        <p>
                                            Proin tincidunt tortor magna. Donec vitae pulvinar sapien, quis tempus massa. Nulla dignissim nisl non viverra suscipit.
                                        </p>
                                    }
                                >
                                </Comment>
                                <ExampleComment>
                                    <ExampleComment>
                                        <ExampleComment />
                                        <ExampleComment />
                                    </ExampleComment>
                                </ExampleComment>
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