import PageBase from '../basePage';
import projectStyle from "./project.less";
import moment from 'moment';
import React, { useRef, onChange, useState } from 'react';
import { UploadOutlined } from '@ant-design/icons';
import {Col, Row, Button, Typography, Input, Space, Select, message, Upload, Comment, Avatar,DatePicker, Steps} from 'antd';
const { Dragger } = Upload;
import { SP } from 'next/dist/next-server/lib/utils';
const { Title, Paragraph, Text, Link } = Typography;
const { Step } = Steps;
const dateFormat = 'YYYY/MM/DD';
const TextIndex = ({ USERMESSAGE }) => {
    const ref = useRef();
    const { Option } = Select;
    var role = "CA"

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

    function ProgressBars(props) {
        const userRole = props.userRole;
        if (userRole == "CA" || userRole == "R") {
            return (
                <>
                    <Steps current={1}>
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
    const disabledDate = (current) => {
        // Can not select days before today and today
        return current && current < moment().endOf('day');
    };
    return (
        <PageBase cRef={ref} USERMESSAGE={USERMESSAGE}>
            <style dangerouslySetInnerHTML={{
                __html: projectStyle
            }} />
            <>
                <br />
                <Row>
                    <Col span={2}></Col>
                    <Col span={20}>

                        <Space direction="vertical" size="middle" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'start' }}>
                            <Title>Edit Project</Title>
                            <br />
                            {/*<Title level={2}>Example project name</Title>*/}
                            {/*<br />*/}
                            {/*<Paragraph>*/}
                            {/*    More than 1.2 billion invoices are exchanged in Australia every year, with around 90 percent of invoice processing still partly or fully manual. Over the past 2 years, the Government has invested nearly $20M to facilitate e-invoicing adoption across Australia. In New South Wales state government, agencies will have to use e-invoicing for goods and services valued at up to AUD 1 million from 2022. It is expected that this will be extended to all transactions in the longer term. The use of e-invoicing requires each company participating in an e-invoice exchange to have a specialised software infrastructure to satisfy existing regulations. Most provided solutions are in the form of a complete package that offers several functionalities for participating in the e-invoicing exchange. However, such solutions may not be suitable in all contexts and are often expensive or tied to the use of other products. For example, Xero offers e-invoicing facilities as part of their cloud solution, but a company would need to migrate all their accounting system to Xero first before they can use them. Therefore, there is a need to offer custom-made solutions for niche areas that will address the requirements of small players like SMEs.*/}
                            {/*</Paragraph>*/}
                            {/*<br />*/}

                            <Title level={4}>Change project name</Title>
                            <Input
                                value={"Example project name"}
                                placeholder="Enter new project name here" />
                            <br />
                            <Title level={4}>Change project description</Title>
                            <Input.TextArea
                                maxLength={1200}
                                autoSize={{ minRows: 4, maxRows: 8 }}
                                value={"More than 1.2 billion invoices are exchanged in Australia every year, with around 90 percent of invoice processing still partly or fully manual. Over the past 2 years, the Government has invested nearly $20M to facilitate e-invoicing adoption across Australia. In New South Wales state government, agencies will have to use e-invoicing for goods and services valued at up to AUD 1 million from 2022. It is expected that this will be extended to all transactions in the longer term. The use of e-invoicing requires each company participating in an e-invoice exchange to have a specialised software infrastructure to satisfy existing regulations. Most provided solutions are in the form of a complete package that offers several functionalities for participating in the e-invoicing exchange. However, such solutions may not be suitable in all contexts and are often expensive or tied to the use of other products. For example, Xero offers e-invoicing facilities as part of their cloud solution, but a company would need to migrate all their accounting system to Xero first before they can use them. Therefore, there is a need to offer custom-made solutions for niche areas that will address the requirements of small players like SMEs."}
                                placeholder="Enter new project description here" />

                        </Space>
                        <br />
                        <Row>
                            <Col span={20}>
                                <Title level={4}>Start Time - End Time</Title>
                                <Title level={5}>
                                    <DatePicker.RangePicker
                                        disabledDate={disabledDate}
                                        defaultValue={[moment('2022/07/26', dateFormat), moment('2022/07/28', dateFormat)]}
                                        format={dateFormat}
                                    />
                                </Title>
                            </Col>
                        </Row>
                        <br />
                        <Title level={3}>Project current progress</Title>
                        <br />
                        <ProgressBars userRole={role} />
                        <br/>
                        <Title level={3}>Change project progress</Title>
                        <Button></Button>
                        <Select defaultValue={"2"}
                                 style={{ width: 400 }}>
                            <Option value="0">Pending</Option>
                            <Option value="1">Approved</Option>
                            <Option value="2">Open to join</Option>
                            <Option value="3">In Progress</Option>
                            <Option value="4">Ended</Option>
                        </Select>
                        <br />
                        <br />
                        <Title level={3}>Upload documents</Title>
                        <Space direction="vertical" size="middle" style={{ display: 'flex' }}>
                        </Space>

                        <br />
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

                            <Button type='primary' style={{ width: 300 }}>Save Project</Button>
                            <Button style={{ width: 300 }}>Back</Button>

                        </Space>

                    </Col>
                    <Col span={2}></Col>
                </Row>



            </>    </PageBase>
    )
}

export default TextIndex