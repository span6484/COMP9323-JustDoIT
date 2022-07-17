import PageBase from '../basePage';
import projectStyle from "./project.less";
import moment from 'moment';
import React, { useRef, onChange, useState } from 'react';
import { UploadOutlined } from '@ant-design/icons';
import { Col, Row, Button, Typography, Input, Space, Select, message, Upload, Comment, Avatar, DatePicker, Steps } from 'antd';
const { Dragger } = Upload;
import { SP } from 'next/dist/next-server/lib/utils';
const { Title, Paragraph, Text, Link } = Typography;
const { Step } = Steps;
const dateFormat = 'YYYY/MM/DD';
const TextIndex = ({ USERMESSAGE }) => {
    const ref = useRef();
    const { Option } = Select;
    var role = "R"
    // 0待审核Pending, 1已通过approved, 2已发布open to join 
    // 3进行中in progress 4已结束ended 5未通过not approved 
    var status = 1;
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
        const status = props.status;
        return (
            <>
                <Steps current={status}>
                    <Step title="Pending" description="Project being reviewed" />
                    <Step title="Approved" description="Approved by course authority" />
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
    function UploadDocumnets(props) {
        const status = props.status;
        if (status <= 1) {
            return (
                <>
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
                </>
            );
        }
        return null;
    }
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
                            <Title level={4}>Change project name</Title>
                            <Input
                                value={"Natural Language Processing with Disaster Tweets"}
                                placeholder="Enter new project name here" />
                            <br />
                            <Title level={4}>Change project description</Title>
                            <Input.TextArea
                                maxLength={1200}
                                autoSize={{ minRows: 4, maxRows: 8 }}
                                value={"Twitter has become an important communication channel in times of emergency. The ubiquitousness of smartphones enables people to announce an emergency they’re observing in real-time. Because of this, more agencies are interested in programatically monitoring Twitter (i.e. disaster relief organizations and news agencies)."}
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
                        <ProgressBars userRole={role} status={status} />

                        <br />
                        <br />
                        <UploadDocumnets status={status} />
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