import PageBase from '../basePage';
import projectStyle from "./project.less";

import React, { useRef, onChange, useState } from 'react';
import { UploadOutlined } from '@ant-design/icons';
import { Col, Row, Collapse, Typography, Button, Space, Input, message, Upload, Comment, Avatar, Tooltip } from 'antd';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { MailOutlined, DeleteOutlined, FormOutlined } from "@ant-design/icons"

const { Dragger } = Upload;
import { SP } from 'next/dist/next-server/lib/utils';
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
    role = "CA";
    var reviewed = true;
    reviewed = false;

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

                                </Space>
                            </Col>
                        </Row>

                        <br />
                        <Row>
                            <Col span={24} >
                                <Title level={2}>Example work to showcase</Title>
                                <br />
                                <Title level={2}>Example author</Title>
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
                                <iframe
                                    src={"https://www.orimi.com/pdf-test.pdf"}
                                    title="file"
                                    width="100%"
                                    height="1200"
                                ></iframe>
                                <br />
                                <iframe
                                    src={"https://www.orimi.com/pdf-test.pdf"}
                                    title="file"
                                    width="100%"
                                    height="1200"
                                ></iframe>
                            </Col>
                        </Row>
                        <br />
                        <Title level={4}>Feedback for this work</Title>
                        <Paragraph>
                            You showed incredible leadership instincts in your work on that project. I would love to work with you to develop those skills. Amazing work.
                            You have all the qualities we look for in a leader. I hope you might consider taking them to the next level by leading our next big project in this area.
                        </Paragraph>
                    </Col>
                    <Col span={2}></Col>
                </Row>



            </>    </PageBase>
    )
}

export default TextIndex