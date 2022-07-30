import PageBase from '../basePage'
import React ,{useRef,useState,useEffect} from 'react'
import MessageComponents from "./components/MessageComponent"
const AllMessage = ({ USERMESSAGE, urlMsg }) => {
  const ref = useRef();
  const [messageList,changeMessageList] = useState()
  useEffect(()=>{

     console.log("USERMESSAGE",USERMESSAGE)
  },[]);

  return (
    <PageBase cRef={ref} USERMESSAGE={USERMESSAGE}>
        <MessageComponents
          urlMsg={urlMsg}
          type={0}
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
AllMessage.getInitialProps = async (status) => {
  const asPath = status.asPath;
  return {
    urlMsg: {
      asPath
    }
  }
}
export default AllMessage
