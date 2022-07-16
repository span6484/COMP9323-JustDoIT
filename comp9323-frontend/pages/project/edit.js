import PageBase from '../basePage'
import React, { useRef, onChange, useState } from 'react'
import { Col, Row, Button, Typography, Input, Space, Collapse, Steps, Popover, Statistic, Comment, Avatar } from 'antd';
const { Title, Paragraph, Text, Link } = Typography;

const TextIndex = ({ USERMESSAGE }) => {
    const ref = useRef();
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
                                    <Input placeholder="Enter new project name here" />
                                    <Title level={2} >Example course name</Title>
                                    <br />
                                    <Paragraph>
                                        quis volutpat sit amet, tincidunt dignissim lectus. Donec nec posuere turpis, eu vulputate felis. Curabitur fringilla, velit vel pretium accumsan, purus eros iaculis ante, non laoreet sapien justo non velit. Integer at nisi nec augue congue finibus. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin tincidunt tortor magna. Donec vitae pulvinar sapien, quis tempus massa. Nulla dignissim nisl non viverra suscipit. Etiam eget imperdiet orci. Suspendisse est odio, imperdiet id euismod ac, facilisis vel odio. Cras gravida tempor lacus, non mattis sem tempor ut.
                                    </Paragraph>

                                </Space>
                            </Col>
                            <Col span={4}></Col>
                            <Col span={6} style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-around' }}>
                                <Paragraph>Edit project name</Paragraph>
                                <Input placeholder="Example project name" />
                                <Button >Save Project</Button>

                            </Col>
                        </Row>
                        <br />
                        <Title level={3}>Change project progress</Title>
                        <Steps current={1}>
                            <Step title="Not started" description="Being reviewed" />
                            <Step title="Open" description="Open to student to join" />
                            <Step title="In Progress" description="Project in progress" />
                            <Step title="Ended" description="Student works are submitted" />
                        </Steps>
                        <br />
                        <Row>
                            <Col span={24}>
                                <Title level={3}>Upload documents</Title>

                            </Col>
                        </Row>
                        <br />
                    </Col>
                    <Col span={2}></Col>
                </Row>



            </>    </PageBase>
    )
}

export default TextIndex