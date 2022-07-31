import PageBase from '../basePage';
import projectStyle from "./project.less";
import moment from 'moment';
import React, { useRef, useEffect, useState } from 'react';
import { UploadOutlined } from '@ant-design/icons';
import { Col, Row, Button, Typography, Input, Space, Select, message, Upload, Comment, Avatar, DatePicker, Steps } from 'antd';
const { Dragger } = Upload;
import { SP } from 'next/dist/next-server/lib/utils';
const { Title, Paragraph, Text, Link } = Typography;
const { Step } = Steps;

const TextIndex = ({ USERMESSAGE, urlMsg }) => {
    const ref = useRef();
    //console.log(urlMsg, USERMESSAGE);
    const uid = USERMESSAGE.uid;
    // get roles based project users
    var useRole = undefined;
    switch (USERMESSAGE.type) {
        case 0:
            useRole = "CA";
            break;
        case 1:
            useRole = "S";
            break;
        case 2:
            useRole = "P";
            break;
        case 3:
            useRole = "R";
            break;
    }
    // get project id from url 
    var pid = urlMsg.asPath.toString().replace('/project/edit?id=', '');

    const [project, setProject] = useState({});

    var status = project.status;
    const dateFormat = 'YYYY/MM/DD';

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

                    // val.result.start_time = (new Date(val.result.start_time)).toLocaleDateString();
                    // val.result.close_time = (new Date(val.result.close_time)).toLocaleDateString();
                    console.log(val.result);
                    setProject(val.result);
                });
            });
        } catch (e) {
            console.log(e)
        };
    }, []);

    function ProgressBars(props) {
        const userRole = props.userRole;

        if (status < 5) {
            if (userRole != "S") {

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
            } else {
                return (
                    <>
                        <Steps current={status - 2}>
                            <Step title="Open to join" description="Open to student to join" />
                            <Step title="In Progress" description="Project in progress" />
                            <Step title="Ended" description="Student works are submitted" />
                        </Steps>
                    </>
                );
            }
        }
        return (
            <>
                <Steps current={1}>
                    <Step title="Pending" description="Project being reviewed" />
                    <Step title="Not Approved" description="Not approved by course authority" />
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
                                value={project.proj_name}
                                placeholder="Enter new project name here" />
                            <br />
                            <Title level={4}>Change project description</Title>
                            <Input.TextArea
                                maxLength={1200}
                                autoSize={{ minRows: 4, maxRows: 8 }}
                                value={project.description}
                                placeholder="Enter new project description here" />

                        </Space>
                        <br />
                        <Row>
                            <Col span={20}>
                                <Title level={4}>Start Time - End Time</Title>
                                <Title level={5}>
                                    <DatePicker.RangePicker
                                        disabledDate={disabledDate}
                                        defaultValue={[moment(project.start_time, dateFormat), moment(project.close_time, dateFormat)]}
                                        format={dateFormat}
                                    />
                                </Title>
                            </Col>
                        </Row>
                        <br />
                        <Title level={3}>Project current progress</Title>
                        <br />
                        <ProgressBars userRole={useRole} />
                        <br />
                        <br />
                        {/* //<UploadDocumnets status={status} /> */}
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
TextIndex.getInitialProps = async (status) => {
    const asPath = status.asPath;
    return {
        urlMsg: {
            asPath
        }
    }
}
export default TextIndex