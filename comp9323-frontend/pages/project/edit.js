import PageBase from '../basePage';
import projectStyle from "./project.less";
import moment from 'moment';
import React, { useRef, useEffect, useState } from 'react';
import { UploadOutlined } from '@ant-design/icons';
import { Col, Row, Button, Typography, Input, Space, InputNumber, message, Upload, Comment, Avatar, DatePicker, Steps } from 'antd';
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
    const [fileList, setFileList] = useState([]);
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
        // console.log(project.start_time, project.close_time);
    };
    function saveProject() {
        try {
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
                    "max_num": project.max_num
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
    switch (project.status) {
        case 2:
            status = 5;
            break;
        case 3:
            status = 2;
            break;
        case 4:
            status = 3;
            break;
        case 5:
            status = 4;
            break;
    }

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
                    setStart_time(moment(val.result.start_time).format('YYYY-MM-DD').toString());
                    setClose_time(moment(val.result.close_time).format('YYYY-MM-DD').toString());
                    console.log(val.result);

                    var newfileList = [];
                    Object.entries(val.result.files).forEach(file => {
                        const [key, value] = file;
                        console.log(value.file_name);
                        const newfile = {
                            'uid': key,
                            'name': value.file_name,
                            'url': value.file_url,
                            'status': 'done'
                        }
                        newfileList.push(newfile);
                    });
                    setFileList(newfileList);
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

        if (status == 0) {
            return (
                <>
                    <Title level={3}>Upload documents</Title>
                    <Space direction="vertical" size="middle" style={{ display: 'flex' }}>
                    </Space>

                    <br />
                    <Upload
                        action="http://localhost:5000/upload_file"
                        className="upload-list-inline"
                        accept=".pdf"
                        defaultFileList={fileList}
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
                        <br />
                        <Title level={4}>Change start time and end time</Title>
                        <RangeDatePicker />
                        <br />
                        <br />
                        <Title level={4}>Change project capacity</Title>
                        <Input
                            style={{ width: 200 }}
                            type={'number'}
                            defaultValue={project.max_num}
                            key={project.max_num}
                            onChange={(e) => {
                                changeProject(e, 'max_num');
                            }}
                        />
                        <br />
                        <br />
                        <Title level={3}>Project current progress</Title>
                        <br />
                        <br />
                        <ProgressBars userRole={userRole} />
                        <br />
                        <br />
                        <br />
                        <Space direction="horizontal" size="middle" style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-around' }}>
                            <Button type='primary' style={{ width: 300 }} onClick={() => {
                                saveProject();
                            }}>Save Project</Button>
                        </Space>
                        <br />
                        <br />
                        <UploadDocumnets status={status} />
                        <br />
                        <br />
                        <br />
                        <br />
                        <br />
                        <br />
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