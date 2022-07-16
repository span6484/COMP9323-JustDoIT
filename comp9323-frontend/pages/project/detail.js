import PageBase from '../basePage'
import React, { useRef, onChange, useState } from 'react'
import { Col, Row, Button, Typography, Image, Space, Collapse, Steps, Popover, Statistic, Comment, Avatar, Popconfirm } from 'antd';
import { BoldOutlined } from '@ant-design/icons';
const { Title, Paragraph, Text, Link } = Typography;

const TextIndex = ({ USERMESSAGE }) => {
    const ref = useRef();
    const { Panel } = Collapse;
    const onChange = (key) => {
        console.log(key);
    };

    const { Step } = Steps;
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

                                </Space>
                            </Col>
                            <Col span={4}></Col>
                            <Col span={6} style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-around' }}>
                                <Statistic style={{ textAlign: 'center' }} title="Project Capacity" value={23} suffix="/ 33" />
                                <Popconfirm
                                    placement="bottomRight"
                                    title={"Join this project now?"}
                                    okText="Yes"
                                    cancelText="No"
                                >
                                    <Button type="primary">Join Project</Button>
                                </Popconfirm>
                                <Button type="primary">Submit Work</Button>
                                <Button type="primary">Quit Project</Button>
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
                        <br />
                        <Steps current={3}>
                            <Step title="Pending" description="Project being reviewed" />
                            <Step title="Approved" description="Approved by course authority" />
                            <Step title="Open to join" description="Open to student to join" />
                            <Step title="In Progress" description="Project in progress" />
                            <Step title="Ended" description="Student works are submitted" />
                        </Steps>
                        <br />
                        <Steps current={1}>
                            <Step title="Pending" description="Project being reviewed" />
                            <Step title="Not Approved" description="Not approved by course authority" />
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
                                    avatar={<Avatar src="https://joeschmoe.io/api/v1/random" alt="Han Solo" />}
                                    content={
                                        <p>
                                            Hi course staff, are there any other prerequisites learning modules for this project?
                                        </p>
                                    }
                                >
                                    <Comment
                                        actions={[<span key="comment-nested-reply-to">Reply</span>]}
                                        author={<a>Example course authority</a>}
                                        avatar={<Avatar src="https://joeschmoe.io/api/v1/random" alt="Han Solo" />}
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
                                    avatar={<Avatar src="https://joeschmoe.io/api/v1/random" alt="Han Solo" />}
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

export default TextIndex