import PageBase from '../basePage'
import React, { useRef, onChange } from 'react'
import { Col, Row, Button, Typography, Image, Space, Collapse } from 'antd';
const { Title, Paragraph, Text, Link } = Typography;

const TextIndex = ({ USERMESSAGE }) => {
    const ref = useRef();
    const src = "https://www.orimi.com/pdf-test.pdf";
    const contentStyle = {
        height: '160px',
        color: '#fff',
        lineHeight: '160px',
        textAlign: 'center',
        background: '#364d79',
    };
    const { Panel } = Collapse;
    const onChange = (key) => {
        console.log(key);
    };
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
                                    <Paragraph>
                                        quis volutpat sit amet, tincidunt dignissim lectus. Donec nec posuere turpis, eu vulputate felis. Curabitur fringilla, velit vel pretium accumsan, purus eros iaculis ante, non laoreet sapien justo non velit. Integer at nisi nec augue congue finibus. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin tincidunt tortor magna. Donec vitae pulvinar sapien, quis tempus massa. Nulla dignissim nisl non viverra suscipit. Etiam eget imperdiet orci. Suspendisse est odio, imperdiet id euismod ac, facilisis vel odio. Cras gravida tempor lacus, non mattis sem tempor ut.
                                    </Paragraph>

                                </Space>
                            </Col>
                            <Col span={4}></Col>
                            <Col span={6} style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-around' }}>
                                <Button type="primary">Join Project</Button>
                                <Button type="primary">Submit Work</Button>
                                <Button type="primary">Quit Project</Button>
                                <Button>Edit Project</Button>
                                <Button>View works</Button>
                            </Col>
                        </Row>
                        <br />
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
                        </Col>
                        <br />
                        <br />
                        <Row>
                            <Col span={24}>
                                <Title>Embedded documents</Title>
                                <Collapse defaultActiveKey={['1']} onChange={onChange}>
                                    <Panel header="This is document 1" key="1">
                                        <iframe
                                            src={"https://www.orimi.com/pdf-test.pdf"}
                                            title="file"
                                            width="100%"
                                            height="1200"
                                        ></iframe>
                                    </Panel>
                                    <Panel header="This is document 2" key="2">
                                        <iframe
                                            src={"https://www.orimi.com/pdf-test.pdf"}
                                            title="file"
                                            width="100%"
                                            height="1200"
                                        ></iframe>
                                    </Panel>
                                    <Panel header="This is document 3" key="3">
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
                                <Title>Forum</Title>

                            </Col>
                        </Row>
                    </Col>
                    <Col span={2}></Col>
                </Row>



            </>    </PageBase>
    )
}

export default TextIndex