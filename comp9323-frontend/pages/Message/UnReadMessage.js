import PageBase from '../basePage'
import React ,{useRef,useState,useEffect} from 'react'
import MessageComponents from "./components/MessageComponent"
const UnReadMessage = ({ USERMESSAGE, urlMsg }) => {
  const ref = useRef();
  useEffect(()=>{
  },[]);

  return (
    <PageBase cRef={ref} USERMESSAGE={USERMESSAGE}>
      <MessageComponents
        urlMsg={urlMsg}
        type={2}
        getTabPaneOption={()=>{
          return ref.current.getTabPaneOption() || {};
        }}
        setNewTabPane={(setPaneMsg)=>{
          ref.current.setNewTabPane(urlMsg.asPath, setPaneMsg)
        }}
        USERMESSAGE={USERMESSAGE} />
    </PageBase>
  )
}
UnReadMessage.getInitialProps = async (status) => {
  const asPath = status.asPath;
  return {
    urlMsg: {
      asPath
    }
  }
}
export default UnReadMessage
