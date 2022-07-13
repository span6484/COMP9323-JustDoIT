import PageBase from '../basePage'
import React ,{useRef,useState,useEffect} from 'react'
import AwardProjectsStyle from "./AwardProjects.less"
const AwardProjects = ({ USERMESSAGE }) => {
  const ref = useRef();
  const [awardList,changeAwardList] = useState([]);
  useEffect(()=>{
    const _list = [ {
      projectName : "English",
      course : "aaa",
      courseAuthority : "adad",
      currentStudentNumber : 1,
      maxStudentNumber : 3,
      startTime : "2010-12-11 13:40:20",
      closeTime : "2022-12-11 13:40:20",
      statues : "4"}, {
      projectName : "English",
      course : "aaa",
      courseAuthority : "adad",
      currentStudentNumber : 1,
      maxStudentNumber : 3,
      startTime : "2010-12-11 13:40:20",
      closeTime : "2022-12-11 13:40:20",
      statues : "4"}, {
      projectName : "English",
      course : "aaa",
      courseAuthority : "adad",
      currentStudentNumber : 1,
      maxStudentNumber : 3,
      startTime : "2010-12-11 13:40:20",
      closeTime : "2022-12-11 13:40:20",
      statues : "4"}, {
      projectName : "English",
      course : "aaa",
      courseAuthority : "adad",
      currentStudentNumber : 1,
      maxStudentNumber : 3,
      startTime : "2010-12-11 13:40:20",
      closeTime : "2022-12-11 13:40:20",
      statues : "4"}, {
      projectName : "English",
      course : "aaa",
      courseAuthority : "adad",
      currentStudentNumber : 1,
      maxStudentNumber : 3,
      startTime : "2010-12-11 13:40:20",
      closeTime : "2022-12-11 13:40:20",
      statues : "4"}, {
      projectName : "English",
      course : "aaa",
      courseAuthority : "adad",
      currentStudentNumber : 1,
      maxStudentNumber : 3,
      startTime : "2010-12-11 13:40:20",
      closeTime : "2022-12-11 13:40:20",
      statues : "4"}];
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
            return <div className={"award-project-component-item"} key={"award-project-component-" + index}>
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
                <h6>Group members:</h6>
                {itemDom(item.groupMembers)}
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
