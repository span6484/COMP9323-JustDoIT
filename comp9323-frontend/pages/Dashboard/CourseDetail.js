import PageBase from '../basePage'
import React, { useRef, useState,useEffect } from 'react'
import { Col, Row, message, Typography, Button, Space, Tooltip, Steps, Comment, Avatar } from 'antd';
import {MailOutlined,DeleteOutlined,FormOutlined} from "@ant-design/icons"
const { Title, Paragraph, Text, Link } = Typography;
import CourseDetailStyle from "./CourseDetail.less"
import { CopyToClipboard } from 'react-copy-to-clipboard';
const CourseDetail = ({ USERMESSAGE ,urlMsg}) => {
    const ref = useRef();
    useEffect(()=>{
        setTimeout(()=>{
            ref?.current.getTabPane(urlMsg.asPath, `Course Name`)
        },0)
    },[]);
    const [requirementList,changeRequirementList] = useState([{},{}])
    return (
        <PageBase cRef={ref} USERMESSAGE={USERMESSAGE}>
            <style dangerouslySetInnerHTML={{
                __html : CourseDetailStyle
            }}/>
             <div className={"course-detail-component-box"}>
                <Row>
                   <Col span={2}/>
                    <Col span={20}>
                        <Row>
                            <Col span={14}>
                                <Space direction="vertical" size="middle" style={{ display: 'flex' }}>
                                    <Title>Course name</Title>
                                    <Paragraph>
                                        <strong>Course Description:</strong> &nbsp;quis volutpat sit amet, tincidunt d
                                        ignissim lectus. Donec nec posuere turpis, eu vulput
                                        ate felis. Curabitur fringilla, velquis volutpat sit amet, tincidunt d
                                        ignissim lectus. Donec nec posuere turpis, eu vulput
                                        ate felis. Curabitur fringilla, velquis volutpat sit amet, tincidunt d
                                        ignissim lectus. Donec nec posuere turpis, eu vulput
                                        ate felis. Curabitur fringilla, velquis volutpat sit amet, tincidunt d
                                        ignissim lectus. Donec nec posuere turpis, eu vulput
                                        ate felis. Curabitur fringilla, veleger at nisi nec augue congue finibus
                                        . Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin tincidunt
                                        tortor magna. Donec vitae pulvinar sapien, quis tempus massa. Nulla dignissim
                                        nisl non viverra suscipit. Etiam eget imperdiet orci. Suspendisse est odio, i
                                        mperdiet id euismod ac, facilisis vel odio. Cras gravida tempor lacus, non matt
                                        is sem tempor ut.
                                    </Paragraph>
                                     <Paragraph>
                                      <strong>Duration:</strong> &nbsp;09/01/2022 - 03/02/2022
                                    </Paragraph>

                                </Space>
                            </Col>
                            <Col span={4}/>
                            <Col span={6}
                                 className={"action-button-box"}>
                                <Button>Add Requirement</Button>
                                <Button>Publish</Button>
                                <div className={"action-button-box-button"}/>
                                <div className={"action-button-box-button"}/>
                                <div className={"action-button-box-button"}/>
                            </Col>
                        </Row>
                        <br />
                        <Row>
                            <Col span={24}>
                                <Title level={3}>Course Authority</Title>
                              <div className={"comment-box"}>
                                <Comment
                                  className="comment-box-item"
                                  author={<div>
                                    Authority Name
                                    <Tooltip placement="top" title={<div className={"email-tool-tip-component"}>
                                      email12131@qq.com
                                      <CopyToClipboard
                                        text={"email12131@qq.com"}
                                        onCopy={() => {
                                          message.success('copy email success');
                                        }}
                                      >
                                        <span className={"email-tool-tip-component-copy"}>COPY</span>
                                      </CopyToClipboard>
                                    </div>}>
                                      <MailOutlined  className={"mail-box"}/>
                                    </Tooltip>
                                  </div>
                                  }
                                  avatar={<Avatar src="/static/ca.png" alt="Han Solo" />}
                                  content={null}
                                >
                                </Comment>
                                <Comment
                                  className="comment-box-item"
                                  author={<div>
                                    Authority Name
                                    <Tooltip placement="top" title={<div className={"email-tool-tip-component"}>
                                      email12131@qq.com
                                      <CopyToClipboard
                                        text={"email12131@qq.com"}
                                        onCopy={() => {
                                          message.success('copy email success');
                                        }}
                                      >
                                        <span className={"email-tool-tip-component-copy"}>COPY</span>
                                      </CopyToClipboard>
                                    </div>}>
                                      <MailOutlined  className={"mail-box"}/>
                                    </Tooltip>
                                  </div>
                                  }
                                  avatar={<Avatar src="/static/ca.png" alt="Han Solo" />}
                                  content={null}
                                >
                                </Comment>
                                <Comment
                                  className="comment-box-item"
                                  author={<div>
                                    Authority Name
                                    <Tooltip placement="top" title={<div className={"email-tool-tip-component"}>
                                      email12131@qq.com
                                      <CopyToClipboard
                                        text={"email12131@qq.com"}
                                        onCopy={() => {
                                          message.success('copy email success');
                                        }}
                                      >
                                        <span className={"email-tool-tip-component-copy"}>COPY</span>
                                      </CopyToClipboard>
                                    </div>}>
                                      <MailOutlined  className={"mail-box"}/>
                                    </Tooltip>
                                  </div>
                                  }
                                  avatar={<Avatar src="/static/ca.png" alt="Han Solo" />}
                                  content={null}
                                >
                                </Comment>
                                <Comment
                                  className="comment-box-item"
                                  author={<div>
                                    Authority Name
                                    <Tooltip placement="top" title={<div className={"email-tool-tip-component"}>
                                      email12131@qq.com
                                      <CopyToClipboard
                                        text={"email12131@qq.com"}
                                        onCopy={() => {
                                          message.success('copy email success');
                                        }}
                                      >
                                        <span className={"email-tool-tip-component-copy"}>COPY</span>
                                      </CopyToClipboard>
                                    </div>}>
                                      <MailOutlined  className={"mail-box"}/>
                                    </Tooltip>
                                  </div>
                                  }
                                  avatar={<Avatar src="/static/ca.png" alt="Han Solo" />}
                                  content={null}
                                >
                                </Comment>
                                <Comment
                                  className="comment-box-item"
                                  author={<div>
                                    Authority Name
                                    <Tooltip placement="top" title={<div className={"email-tool-tip-component"}>
                                      email12131@qq.com
                                      <CopyToClipboard
                                        text={"email12131@qq.com"}
                                        onCopy={() => {
                                          message.success('copy email success');
                                        }}
                                      >
                                        <span className={"email-tool-tip-component-copy"}>COPY</span>
                                      </CopyToClipboard>
                                    </div>}>
                                      <MailOutlined  className={"mail-box"}/>
                                    </Tooltip>
                                  </div>
                                  }
                                  avatar={<Avatar src="/static/ca.png" alt="Han Solo" />}
                                  content={null}
                                >
                                </Comment>
                                <Comment
                                  className="comment-box-item"
                                  author={<div>
                                    Authority Name
                                    <Tooltip placement="top" title={<div className={"email-tool-tip-component"}>
                                      email12131@qq.com
                                      <CopyToClipboard
                                        text={"email12131@qq.com"}
                                        onCopy={() => {
                                          message.success('copy email success');
                                        }}
                                      >
                                        <span className={"email-tool-tip-component-copy"}>COPY</span>
                                      </CopyToClipboard>
                                    </div>}>
                                      <MailOutlined  className={"mail-box"}/>
                                    </Tooltip>
                                  </div>
                                  }
                                  avatar={<Avatar src="/static/ca.png" alt="Han Solo" />}
                                  content={null}
                                >
                                </Comment>
                                <Comment
                                  className="comment-box-item"
                                  author={<div>
                                    Authority Name
                                    <Tooltip placement="top" title={<div className={"email-tool-tip-component"}>
                                      email12131@qq.com
                                      <CopyToClipboard
                                        text={"email12131@qq.com"}
                                        onCopy={() => {
                                          message.success('copy email success');
                                        }}
                                      >
                                        <span className={"email-tool-tip-component-copy"}>COPY</span>
                                      </CopyToClipboard>
                                    </div>}>
                                      <MailOutlined  className={"mail-box"}/>
                                    </Tooltip>
                                  </div>
                                  }
                                  avatar={<Avatar src="/static/ca.png" alt="Han Solo" />}
                                  content={null}
                                >
                                </Comment>
                                <Comment
                                  className="comment-box-item"
                                  author={<div>
                                    Authority Name
                                    <Tooltip placement="top" title={<div className={"email-tool-tip-component"}>
                                      email12131@qq.com
                                      <CopyToClipboard
                                        text={"email12131@qq.com"}
                                        onCopy={() => {
                                          message.success('copy email success');
                                        }}
                                      >
                                        <span className={"email-tool-tip-component-copy"}>COPY</span>
                                      </CopyToClipboard>
                                    </div>}>
                                      <MailOutlined  className={"mail-box"}/>
                                    </Tooltip>
                                  </div>
                                  }
                                  avatar={<Avatar src="/static/ca.png" alt="Han Solo" />}
                                  content={null}
                                >
                                </Comment>
                                <Comment
                                  className="comment-box-item"
                                  author={<div>
                                    Authority Name
                                    <Tooltip placement="top" title={<div className={"email-tool-tip-component"}>
                                      email12131@qq.com
                                      <CopyToClipboard
                                        text={"email12131@qq.com"}
                                        onCopy={() => {
                                          message.success('copy email success');
                                        }}
                                      >
                                        <span className={"email-tool-tip-component-copy"}>COPY</span>
                                      </CopyToClipboard>
                                    </div>}>
                                      <MailOutlined  className={"mail-box"}/>
                                    </Tooltip>
                                  </div>
                                  }
                                  avatar={<Avatar src="/static/ca.png" alt="Han Solo" />}
                                  content={null}
                                >
                                </Comment>
                                <Comment
                                  className="comment-box-item"
                                  author={<div>
                                    Authority Name
                                    <Tooltip placement="top" title={<div className={"email-tool-tip-component"}>
                                      email12131@qq.com
                                      <CopyToClipboard
                                        text={"email12131@qq.com"}
                                        onCopy={() => {
                                          message.success('copy email success');
                                        }}
                                      >
                                        <span className={"email-tool-tip-component-copy"}>COPY</span>
                                      </CopyToClipboard>
                                    </div>}>
                                      <MailOutlined  className={"mail-box"}/>
                                    </Tooltip>
                                  </div>
                                  }
                                  avatar={<Avatar src="/static/ca.png" alt="Han Solo" />}
                                  content={null}
                                >
                                </Comment>
                              </div>

                            </Col>
                        </Row>
                      <Row>
                        <Col span={24}>
                          <div className={"requirementListBox"}>
                          {
                            requirementList && requirementList.map((item,index) => {
                              return <div className={"requirement_box"} key={"requirementList_" + index}>
                                         <div className={"action_box"}>
                                           <FormOutlined className={"icon-button"}/>
                                           <DeleteOutlined className={"icon-button"} />
                                         </div>
                                         <p
                                           onClick={()=>{
                                             ref.current.setTabPane(
                                               `Requirement Detail`,
                                               '',
                                               `/Dashboard/RequirementDetail?id=123132`
                                             )
                                           }}
                                         >Requirement title</p>
                                         <div className={"description"}>
                                           <strong>Description:</strong>&nbsp;jkshfjkshfjkshfjkshfkjshdjkfhsjkdfhkjsdhiwqyruihjkashdjkas
                                         </div>
                                          <div className={"description-comment"}>
                                            <Comment
                                              className="comment-box-item"
                                              author={<div>
                                                Authority Name
                                                <Tooltip placement="top" title={<div className={"email-tool-tip-component"}>
                                                  email12131@qq.com
                                                  <CopyToClipboard
                                                    text={"email12131@qq.com"}
                                                    onCopy={() => {
                                                      message.success('copy email success');
                                                    }}
                                                  >
                                                    <span className={"email-tool-tip-component-copy"}>COPY</span>
                                                  </CopyToClipboard>
                                                </div>}>
                                                  <MailOutlined  className={"mail-box"}/>
                                                </Tooltip>
                                              </div>
                                              }
                                              avatar={<Avatar src="/static/ca.png" alt="Han Solo" />}
                                              content={null}
                                            >
                                            </Comment>
                                          </div>
                                    </div>
                            })
                          }
                          </div>

                        </Col>
                      </Row>
                    </Col>
                    <Col span={2}/>
                </Row>
             </div>
         </PageBase>
    )
}
CourseDetail.getInitialProps = async (status) => {
    const asPath = status.asPath;
    return {
        urlMsg: {
            asPath
        }
    }
}
export default CourseDetail