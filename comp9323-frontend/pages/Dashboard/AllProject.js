import PageBase from '../basePage'
import React ,{useRef,useState,useEffect} from 'react'
import {Select,Button} from "antd"
const {Option} = Select;
import AllProjectStyle from "./AllProject.less"
const AllProject = ({ USERMESSAGE, urlMsg }) => {
  const ref = useRef();
  const [search,changeSearch] = useState({
    projectType : null,
    course : null
  });
  const [asPath] = useState(urlMsg.asPath);
  const [projectList,changeProject] = useState([{
    key : null,
    value : "All Projects"
  },{
    key : "pending",
    value : "Pending Projects"
  },{
    key : "passed",
    value : "Passed Projects"
  },{
    key : "processing",
    value : "Processing Projects"
  },{
    key : "done",
    value : "Done Projects"
  },{
    key : "unpassed",
    value : "Unpassed Projects"
  }]);
  const [courseList,changeCourseList] = useState([{
    key : null,
    value : "All Courses"
  },{
    key : "Course1",
    value : "Course1"
  },{
    key : "Course2",
    value : "Course2"
  },{
    key : "Course3",
    value : "Course3"
  }]);
  useEffect(()=>{
    setTimeout(() => {
      const _data = ref?.current?.getTabPaneOption() || {};
      changeSearch({
        projectType : _data.projectType || null,
        course : _data.course || null,
      })
    },0)
  },[]);
  function clearSearch() {
    changeSearch({
      projectType : null,
      course : null
    });
  }
  return (
    <PageBase cRef={ref} USERMESSAGE={USERMESSAGE}>
      <style dangerouslySetInnerHTML={{
        __html : AllProjectStyle
      }}/>
      <div className={"dash-board-all-project"}>
        <div className="searchBox search">
          <div className="box">
            <h6>Project status</h6>
            <div className="operation_box">
              <Select
                value={search.projectType}
                style={{ width: 300 }}
                onChange={(value) => {
                  const _search = _.clone(search)
                  _search.projectType = value;
                  changeSearch(_search);
                  ref?.current.setNewTabPane(asPath, {
                    ..._search
                  })
                }}>
                {projectList &&
                projectList.map((item, index) => {
                  return (
                    <Option value={item.key} key={'projectList_' + index}>
                      {item.value}
                    </Option>
                  )
                })}
              </Select>
            </div>
          </div>
          <div className="box">
            <h6>Courses</h6>
            <div className="operation_box">
              <Select
                value={search.course}
                style={{ width: 300 }}
                onChange={(value) => {
                  const _search = _.clone(search)
                  _search.course = value;
                  changeSearch(_search);
                  ref?.current.setNewTabPane(asPath, {
                    ..._search
                  })
                }}>
                {courseList &&
                courseList.map((item, index) => {
                  return (
                    <Option value={item.key} key={'projectList_' + index}>
                      {item.value}
                    </Option>
                  )
                })}
              </Select>
            </div>
          </div>
          <div className="operation_box">
            <Button onClick={()=>{
               clearSearch()
            }}>
              CLEAR
            </Button>
            &nbsp;&nbsp;
            <Button type="primary">
              SUBMIT
            </Button>
            &nbsp;&nbsp;
          </div>
        </div>
      </div>
    </PageBase>
  )
}
AllProject.getInitialProps = async (status) => {
  const asPath = status.asPath;
  return {
    urlMsg: {
      asPath
    }
  }
}
export default AllProject
