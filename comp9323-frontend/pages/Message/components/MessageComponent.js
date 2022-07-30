
import React ,{useRef,useState,useEffect} from 'react'
import { Pagination ,Empty,Popconfirm,message,Tooltip} from "antd";
import MessageComponentStyle from "./MessageComponent.less"
import {MessageOutlined,DeleteOutlined} from "@ant-design/icons"
import _ from "lodash"
import {getMessage} from "../../MockData";
const MessageComponent = ({ type,urlMsg,uid ,getTabPaneOption,setNewTabPane,USERMESSAGE}) => {
  const [messageList,changeMessageList] = useState();
  const [page,changePage] = useState({
    size : 50,
    number : 1,
    total : 0
  });
  const [loading,changeLoading] = useState(false);
  function initData(initPage){
    initPage = initPage || page;
    changeLoading(true);
    getMessage({
      uid : USERMESSAGE && USERMESSAGE.uid,
      read : type
    }).then(res => {
      initPage.total = (res.list || []).length;
      if(res.code === 200){
        changeMessageList(res.list || []);
      }else{
        changeMessageList([]);
      }
      changePage(initPage);
      changeLoading(false);
      setNewTabPane && setNewTabPane(initPage);
    })
  }
  useEffect(()=>{
    setTimeout(() => {
      const _data = getTabPaneOption && getTabPaneOption() || {};
      changePage({
        size : _data.size || 50,
        number : _data.number || 1,
        total : _data.total || 0
      })
      initData({
        size : _data.size || 10,
        number : _data.number || 1,
        total : _data.total ||0
      })
    },0)
  },[]);
  return (
    <React.Fragment>
      <style dangerouslySetInnerHTML={{
        __html : MessageComponentStyle
      }}/>
      <div className={"message-component-box"}>
        <div className={"message-box"}>
          {page.total > 0 &&messageList && messageList.map((item,index) => {
            return <div className={"message-item"}>
                 <div className={`message-icon ${item.type === 2 && "message-body-read" || ""}`}>
                   <MessageOutlined/>
                 </div>
                 <div className={"message-detail-box"}>
                     <div className={"message"}>
                       <div
                           onClick={()=>{
                             const _messageList = _.cloneDeep(messageList);
                             _messageList[index].type = 2;
                             changeMessageList(_messageList);
                           }}
                           className={`message-body ${item.type === 2 && "message-body-read" || ""}`}>
                         <Tooltip
                           placement="top" title={item.message}>
                             {item.message}
                         </Tooltip>
                       </div>
                     </div>
                   <div className={"message-time"}>
                     {item.time}
                   </div>
                     <div className={"message-active"}>
                       {
                         item.type === 1 ? <span
                           onClick={()=>{
                             const _messageList = _.cloneDeep(messageList);
                             _messageList[index].type = 2;
                             changeMessageList(_messageList);
                           }}
                           className={"read"}>Read</span> : <span/>
                       }
                       <Popconfirm
                         title="Are you sure you want to delete this message?"
                         onConfirm={()=>{
                           message.success("delete success");
                           const _messageList = _.cloneDeep(messageList);
                           _messageList.splice(index,1);
                           changeMessageList(_messageList);
                           console.log("ok")
                         }}
                         okText="YES"
                         cancelText="NO"
                       >
                       <DeleteOutlined
                         className={"del"}/>
                       </Popconfirm>
                     </div>
                 </div>
            </div>
          })}
          {
            page.total === 0 && <Empty style={{
              marginTop:"80px"
            }}/>
          }
        </div>
      {/*{*/}
      {/*  page.total > 0 && <div className={"list-detail-pagination"}>*/}
      {/*    <Pagination*/}
      {/*      current={page.number}*/}
      {/*      total={page.total}*/}
      {/*      showQuickJumper*/}
      {/*      simple*/}
      {/*      pageSize={page.size}*/}
      {/*      onChange={(pageIndex,pageSize)=>{*/}
      {/*        if(loading){*/}
      {/*          message.warning("Searching, please wait");*/}
      {/*          return;*/}
      {/*        }*/}
      {/*        const _page = _.cloneDeep(page);*/}
      {/*        _page.number = pageIndex <= 0 ? 1 : pageIndex;*/}
      {/*        _page.size = pageSize;*/}
      {/*        changePage(_page);*/}
      {/*        initData(_page);*/}
      {/*      }}*/}
      {/*    />*/}
      {/*  </div>*/}
      {/*}*/}
    </div>
    </React.Fragment>
  )
}
export default MessageComponent
