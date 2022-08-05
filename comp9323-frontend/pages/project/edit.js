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
const dateFormat = 'YYYY/MM/DD';

const TextIndex = ({ USERMESSAGE, urlMsg }) => {
    const ref = useRef();
    //console.log(urlMsg, USERMESSAGE);
    const uid = USERMESSAGE.uid;
    // get roles based project users
    var userRole = undefined;
    switch (USERMESSAGE.type) {
        case 0:
            userRole = "CA";
            break;
        case 1:
            userRole = "S";
            break;
        case 2:
            userRole = "P";
            break;
        case 3:
            userRole = "R";
            break;
    }
    // get project id from url 
    var pid = urlMsg.asPath.toString().replace('/project/edit?id=', '');

    const [project, setProject] = useState({});
    const [start_time, setStart_time] = useState('');
    const [close_time, setClose_time] = useState('');

    const changeProject = (e, content) => {
        var obj;
        if (content == "time") {
            console.log(moment(e[0]).format(dateFormat), moment(e[1]).format(dateFormat));
            obj = Object.assign(project, {
                ['start_time']: moment(e[0]).format('YYYY-MM-DD'),
                ['close_time']: moment(e[1]).format('YYYY-MM-DD'),
            });
            setStart_time(moment(e[0]).format('YYYY-MM-DD'));
            setClose_time(moment(e[1]).format('YYYY-MM-DD'));
            //console.log(obj);
        } else {
            obj = Object.assign(project, {
                [content]: e.target.value,
            });
        }
        setProject(obj);
        console.log(project.start_time, project.close_time);
    };
    function saveProject() {
        try {
            console.log(JSON.stringify({
                "proj_id": pid,
                "uid": uid,
                "proj_name": project.proj_name,
                "description": project.description,
                "start_time": project.start_time,
                "close_time": project.close_time,
                "status": status,
                "max_num": 25
            }));
            fetch('http://localhost:5000/edit_project', {
                method: 'POST',
                headers: {
                    "content": 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                body: JSON.stringify({
                    "proj_id": pid,
                    "uid": uid,
                    "proj_name": project.proj_name,
                    "description": project.description,
                    "start_time": start_time,
                    "close_time": close_time,
                    "status": status,
                    "max_num": 25
                })
            }).then(res => {
                res.json().then((val) => {
                    console.log("res val = ", val);
                    // window.location.reload();
                });
            });
        } catch (e) {
            console.log(e)
        }
    }
    var status = project.status;

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
                body: JSON.stringify({ "proj_id": pid, "uid": uid, })
            }).then(res => {
                res.json().then((val) => {
                    // console.log(moment(val.result.start_time).isValid());
                    // val.result.start_time = moment(val.result.start_time).format(dateFormat);
                    // val.result.close_time = moment(val.result.close_time).format(dateFormat);
                    val.result.start_time = moment(val.result.start_time).format(dateFormat).toString();
                    val.result.close_time = moment(val.result.close_time).format(dateFormat).toString();
                    setStart_time(moment(val.result.start_time).format('YYYY-MM-DD').toString());
                    setClose_time(moment(val.result.close_time).format('YYYY-MM-DD').toString());
                    // console.log(val.result);
                    // console.log(moment(val.result.start_time).isValid());
                    // console.log(val.result.start_time, val.result.close_time);
                    setProject(val.result);
                });
            });
        } catch (e) {
            console.log(e)
        };
    }, []);
    useEffect(() => {
        RangeDatePicker();
    }, [project]);
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
    function RangeDatePicker() {
        return (
            <DatePicker.RangePicker
                disabledDate={disabledDate}
                format={dateFormat}
                key='time'
                value={[moment(start_time, dateFormat), moment(close_time, dateFormat)]}
                onCalendarChange={val => changeProject(val, 'time')}
            />
        )
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
                                defaultValue={project.proj_name}
                                key={project.proj_name}
                                placeholder="Enter new project name here"
                                onChange={(e) => {
                                    changeProject(e, 'proj_name');
                                }}
                            />
                            <br />
                            <Title level={4}>Change project description</Title>
                            <Input.TextArea
                                maxLength={1200}
                                autoSize={{ minRows: 4, maxRows: 8 }}
                                placeholder="Enter new project description here"
                                defaultValue={project.description}
                                key={project.description}
                                onChange={(e) => {
                                    changeProject(e, 'description');
                                }} />
                        </Space>
                        <br />
                        <Row>
                            <Col span={20}>
                                <Title level={4}>Change start time and end time</Title>
                                <RangeDatePicker />
                            </Col>
                        </Row>
                        <br />
                        <Title level={3}>Project current progress</Title>
                        <br />
                        <ProgressBars userRole={userRole} />
                        <br />
                        <br />
                        {/* //<UploadDocumnets status={status} /> */}
                        <br />
                        <br />
                        <br />
                        <Space direction="horizontal" size="middle" style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-around' }}>
                            <Button type='primary' style={{ width: 300 }} onClick={() => {
                                saveProject();
                            }}>Save Project</Button>
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