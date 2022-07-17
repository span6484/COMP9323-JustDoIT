import PageBase from '../basePage'
import React ,{useRef,useState,useEffect} from 'react'
import AwardProjectsStyle from "./AwardProjects.less"
const AwardProjects = ({ USERMESSAGE }) => {
  const ref = useRef();
  const [awardList,changeAwardList] = useState([]);
  useEffect(()=>{
    const _list = [
      {
        id : "a001",
        projectName : "Natural Language Processing with Disaster Tweets",
        course : "Software as a Service Project",
        courseAuthority : "Jerry",
        winner : "Marie",
        proposer : "emotional analysis",
        currentStudentNumber : 43,
        maxStudentNumber : 3,
        startTime : "11/05/2022",
        closeTime : "13/05/2022",
        statues : 0,
      },{
        id : "a002",
        projectName : "Movie finder system",
        course : "Machine Learning and Data Mining",
        courseAuthority : "Aaron",
        winner : "Jenny",
        proposer : "emotional analysis",
        currentStudentNumber : 20,
        maxStudentNumber : 3,
        startTime : "15/05/2022",
        closeTime : "18/05/2022",
        statues : 1,
      },{
        id : "a003",
        projectName : "CVPR 2018 WAD Video Segmentation Challenge",
        course : "Information Technology Project",
        courseAuthority : "Adrian",
        winner : "Jeanne",
        proposer : "emotional analysis",
        currentStudentNumber : 30,
        maxStudentNumber : 3,
        startTime : "11/06/2022",
        closeTime : "13/06/2022",
        statues : 2,
      }
     ];
    changeAwardList(_list);
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
          awardList && awardList.map((item,index) => {
            return <div
                onClick={()=>{
                    ref.current.setTabPane(
                        `Award Showcase`,
                        '',
                        `/project/showcase?id=${item.id}`
                    )
                }}
                className={"award-project-component-item"} key={"award-project-component-" + index}>
               <div className={"award-project-component-tab"}>
                 <h6>Project name:</h6>
                 {itemDom(item.projectName)}
               </div>
              <div className={"award-project-component-tab"}>
                <h6>Course:</h6>
                {itemDom(item.course)}
              </div>
              <div className={"award-project-component-tab"}>
                <h6>Course Authority:</h6>
                {itemDom(item.courseAuthority)}
              </div>
              <div className={"award-project-component-tab"}>
                <h6>Proposer:</h6>
                {itemDom(item.proposer)}
              </div>
              <div className={"award-project-component-tab"}>
                <h6>Winner:</h6>
                {itemDom(item.winner)}
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
