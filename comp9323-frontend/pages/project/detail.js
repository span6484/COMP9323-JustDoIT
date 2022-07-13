import PageBase from '../basePage'
import React from 'react'
import { Col, Row } from 'antd';
import { Divider, Typography } from 'antd';
const { Title, Paragraph, Text, Link } = Typography;

const TextIndex = ({ USERMESSAGE }) => {
    return (
        <PageBase USERMESSAGE={USERMESSAGE}>
            <>

                <Row>
                    <Col span={16}>
                        <Title>Example project name</Title>
                        <Title level={2}>Example course name</Title>
                        <Paragraph>
                            quis volutpat sit amet, tincidunt dignissim lectus. Donec nec posuere turpis, eu vulputate felis. Curabitur fringilla, velit vel pretium accumsan, purus eros iaculis ante, non laoreet sapien justo non velit. Integer at nisi nec augue congue finibus. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin tincidunt tortor magna. Donec vitae pulvinar sapien, quis tempus massa. Nulla dignissim nisl non viverra suscipit. Etiam eget imperdiet orci. Suspendisse est odio, imperdiet id euismod ac, facilisis vel odio. Cras gravida tempor lacus, non mattis sem tempor ut.
                        </Paragraph>
                    </Col>
                    <Col span={8}>Buttons</Col>
                </Row>
                <Row>
                    <Col span={24}>Embedded documents</Col>
                </Row>
                <Row>
                    <Col span={24}>Forum</Col>
                </Row>
            </>    </PageBase>
    )
}

export default TextIndex