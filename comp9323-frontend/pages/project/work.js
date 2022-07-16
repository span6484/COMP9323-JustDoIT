import PageBase from '../basePage';
import projectStyle from "./project.less";

import React, { useRef, onChange, useState } from 'react';
import { UploadOutlined } from '@ant-design/icons';
import { Col, Row, Collapse, Typography, Button, Space, Input, message, Upload, Comment, Avatar } from 'antd';
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

    function Documents(props) {
        <style dangerouslySetInnerHTML={{
            __html: projectStyle
        }} />

        // for CA P Submitted
        if (props.userRole != "S" || props.reviewed) {
            return (
                <>
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