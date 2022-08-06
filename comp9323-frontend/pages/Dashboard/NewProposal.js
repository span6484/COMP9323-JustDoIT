import PageBase from '../basePage';
import NewProposalStyle from "./NewProposal.less";
import React, { useRef, useState, useEffect } from 'react';
import { UploadOutlined, MailOutlined } from '@ant-design/icons';
import { Form, Col, Row, Button, Typography, Input, Space, message, Upload, Comment, Avatar, Tooltip } from 'antd';
import { CopyToClipboard } from 'react-copy-to-clipboard';
const { Title } = Typography;
import { addProposal } from "../MockData";
import {getQueryString} from "../../util/common";

const TextIndex = ({ USERMESSAGE, urlMsg }) => {
	const ref = useRef();
	const [form] = Form.useForm();

	// State
	const [userInfo, changeUserInfo] = useState(USERMESSAGE); // Current User Info

	// 初始化
	useEffect(() => {
		setTimeout(() => {
			ref?.current.getTabPane(urlMsg.asPath, `New Proposal`)
		}, 0)
	}, []);

	// Save Proposal
	const handleSaveProposal = () => {
		form.validateFields().then((fieldsValue) => {
			if(!fieldsValue.projectName ){
				message.warning("Please enter project name");
				return;
			}
			if(!fieldsValue.projectDescription){
				message.warning("Please enter project description");
				return;
			}
			let reqBody = {
				uid :USERMESSAGE && USERMESSAGE.uid,
				rid: getQueryString("id") || "",
				proj_name: fieldsValue.projectName,
				description: fieldsValue.projectDescription,
				files: [],
			};
			addProposal(reqBody).then(res => {
				if(res.code === 200){
					message.success("Add proposal successfully")
				}else{
					message.error("Add proposal failed")
				}
			});
		}).catch(err => {
			console.log(err);
		});
	};
	// Back
	const handleBack = () => {};

	return (
		<PageBase cRef={ref} USERMESSAGE={USERMESSAGE}>
			<style dangerouslySetInnerHTML={{ __html: NewProposalStyle }} />
			<Form form={form}>
				<br />
				<Row>
					<Col span={2}></Col>
					<Col span={20}>
						<Space direction="vertical" size="middle" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'start' }}>
							<Title>Add Project Proposal</Title>
							<Title level={4}>Project Name</Title>
							<Form.Item name="projectName">
								<Input placeholder="Enter new project name here" />
							</Form.Item>
							<br />
							<Title level={4}>Project Description</Title>
							<Form.Item name="projectDescription">
								<Input placeholder="Enter new project description here" />
							</Form.Item>
							<br />
						</Space>
						<Title level={4}>Upload Documents</Title>
						<br />
						<Upload action="https://www.mocky.io/v2/5cc8019d300000980a055e76" className="upload-list-inline">
							<Button icon={<UploadOutlined />}>Upload</Button>
						</Upload>
						<br />
						<br />
						<br />
						<Space direction="horizontal" size="middle" style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-around' }}>
							<Button type='primary' style={{ width: 300 }} onClick={handleSaveProposal}>Save Proposal</Button>
							{/*<Button style={{ width: 300 }} onClick={handleBack}>Back</Button>*/}
						</Space>
					</Col>
					<Col span={2}></Col>
				</Row>
			</Form>    
		</PageBase>
	)
}

TextIndex.getInitialProps = async (status) => {
	const asPath = status.asPath;
	return {
		urlMsg: {
			asPath
		}
	}
};

export default TextIndex