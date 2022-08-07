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
import {editProject, viewProject} from "../MockData"
const TextIndex = ({ USERMESSAGE, urlMsg }) => {
    const ref = useRef();
    //console.log(urlMsg, USERMESSAGE);
    const uid = USERMESSAGE && USERMESSAGE.uid;
    // get roles based project users
    var userRole = undefined;
    switch (USERMESSAGE && USERMESSAGE.type) {
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
            editProject({
                "proj_id": pid,
                "uid": uid,
                "proj_name": project.proj_name,
                "description": project.description,
                "start_time": start_time,
                "close_time": close_time,
                "status": status,
                "max_num": project.max_num,
                "file" : pdfList && pdfList[0] || null
            }).then(res => {
                if(res.code === 200){
                    message.success("Edit project successfully")
                }else{
                    message.error("Edit project failed")
                }
            })
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
    function getProjectStatus(statues){
        const filterList = statusProject && statusProject.filter((item) =>{
            return item.key === statues
        })
        if(!filterList || filterList.length === 0){
            return null;
        }
        return filterList[0].value
    }
    const [statusProject,changeStatusProject] = useState([])
    useEffect(() => {
        let projectStatusList = [];
        const userType = USERMESSAGE && USERMESSAGE.type;
        if(userType !== 1 && userType !== undefined && userType !== null && userType !== ""){
            projectStatusList = [...projectStatusList,...[{
                key : 0,
                value : "Pending"
            },{
                key : 1,
                value : "Approved"
            },{
                key : 2,
                value : "Not approved"
            }]]
        }
        projectStatusList = [...projectStatusList,...[{
            key : 3,
            value : "Open to join"
        },{
            key : 4,
            value : "In Progress"
        },{
            key : 5,
            value : "Ended"
        }]]
        changeStatusProject(projectStatusList)
        // fetch project info on load
        try {
            viewProject({ "proj_id": pid, "uid": uid, }).then(val =>{
                if(val.code === 200){
                    setStart_time(moment(val.result.start_time).format('YYYY-MM-DD').toString());
                    setClose_time(moment(val.result.close_time).format('YYYY-MM-DD').toString());

                    var newfileList = [],pdf_url_list =[];
                    Object.entries([val.result?.files || {}]).forEach(file => {
                        const [key, value] = file;
                        if(value.file_url){
                            const newfile = {
                                'uid': key,
                                'name': value.file_name,
                                'url': value.file_url,
                                'status': 'done'
                            }
                            newfileList.push(newfile);
                            pdf_url_list.push(value.file_url);
                        }

                    });
                    setFileList(newfileList);
                    changePdfList(pdf_url_list)
                    setProject(val.result);
                    ref?.current.getTabPane(urlMsg.asPath, val.result?.proj_name)
                }
            })
        } catch (e) {
            console.log(e)
        }
    }, []);
    useEffect(() => {
        RangeDatePicker();
    }, [project]);
    const disabledDate = (current) => {
        // Can not select days before today and today
        return current && current < moment().endOf('day');
    };
    const [pdfList ,changePdfList] = useState([])
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
                        <br />
                        <Title level={4}>Change project capacity</Title>
                        <Input
                            style={{ width: 200 }}
                            type={'number'}
                            defaultValue={project.max_num}
                            key={project.max_num}
                            min={0}
                            onChange={(e) => {
                                changeProject(e, 'max_num');
                            }}
                        />
                        <br />
                        <br />
                        <br />
                        <Title level={4}>Upload documents</Title>
                        <Space direction="vertical" size="middle" style={{ display: 'flex' }}>
                        </Space>
                        <Upload
                            maxCount={1}
                            beforeUpload={(file)=>{
                                let fileType = file.name.split('.');
                                const fileDate = fileType.slice(-1);
                                const isLt200M = file.size / 1024 / 1024 < 0.5;
                                if (!isLt200M) {
                                    message.error('File size cannot be greater than 500kb');
                                    return
                                }
                                return isLt200M;
                            }}
                            onChange={({file,fileList})=>{
                                if(fileList && fileList.length > 0){
                                    const _file = fileList[0];
                                    const pdf_url = _file?.response?.result?.pdf_url || "";
                                    changePdfList([pdf_url])
                                }else{
                                    changePdfList([])
                                }
                                setFileList(fileList)
                            }}
                            fileList={fileList}
                            action="http://127.0.0.1:5000/upload_file"
                            className="upload-list-inline">
                            <Button icon={<UploadOutlined />}>Upload (Max: 1)</Button>
                        </Upload>
                        <br />
                        <br />
                        <Space direction="horizontal" size="middle" style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-around' }}>
                            <Button type='primary' style={{ width: 300 }} onClick={() => {
                                saveProject();
                            }}>Save Project</Button>
                        </Space>
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