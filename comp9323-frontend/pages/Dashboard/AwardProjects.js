import PageBase from '../basePage'
import React ,{useRef,useState,useEffect} from 'react'
import AwardProjectsStyle from "./AwardProjects.less"
import {getAwards} from "../MockData"
import {Empty} from "antd";
const AwardProjects = ({ USERMESSAGE }) => {
  const ref = useRef();
  const [awardList,changeAwardList] = useState([]);
  useEffect(()=>{
      getAwards({
          uid : USERMESSAGE && USERMESSAGE.uid
      }).then(res => {
          if(res.code === 200 && res.result && res.result.result_list){
              changeAwardList(res.result.result_list)
          }else{
              changeAwardList([])
          }
      })

  },[])
  function itemDom(value){
    return <div
      style={{
        width : "calc(100% - 125px)"
      }}
      className={"award-project-component-tab-name"}>
      {value}
    </div>
  }
  return (
    <PageBase cRef={ref} USERMESSAGE={USERMESSAGE}>
      <style dangerouslySetInnerHTML={{
        __html: AwardProjectsStyle
      }}/>
      <div className={"award-project-component"}>
        <div className={"awardList-box"}>
            {
                (!awardList || awardList.length === 0 ) && <Empty style={{
                    marginTop:"80px"
                }}/>
            }
        {
          awardList && awardList.map((item,index) => {
            return <div
                onClick={()=>{
                    ref.current.setTabPane(
                        `Award Showcase`,
                        '',
                        `/project/showcase?id=${item.sel_id}`
                    )
                }}
                className={"award-project-component-item"} key={"award-project-component-" + index}>
               <div className={"award-project-component-tab"}>
                 <h6>Project name:</h6>
                 {itemDom(item.proj_name)}
               </div>
              <div className={"award-project-component-tab"}>
                <h6>Course:</h6>
                {itemDom(item.course_name)}
              </div>
              <div className={"award-project-component-tab"}>
                <h6>Course Authority:</h6>
                {itemDom(item.course_auth)}
              </div>
              <div className={"award-project-component-tab"}>
                <h6>Proposer:</h6>
                {itemDom(item.proposer)}
              </div>
              <div className={"award-project-component-tab"}>
                <h6>Winner:</h6>
                {itemDom(item.student)}
              </div>
            </div>
          })
        }
        </div>
      </div>
    </PageBase>
  )
}

export default AwardProjects
