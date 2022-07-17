import PageBase from '../basePage'
import React ,{useRef,useState,useEffect} from 'react'
import {Select,Button,Table} from "antd"
const {Option} = Select;
import AllProjectStyle from "./AllProject.less"
const AllProject = ({ USERMESSAGE, urlMsg }) => {
  const ref = useRef();
  const [data,changeData] = useState([]);
  const [pageLoading,changePageLoading] = useState(false);
  const [search,changeSearch] = useState({
    projectType : null,
    course : null
  });
  const [page,changePage] = useState({
      size : 10,
      number : 1,
      total : 0
  })
  const [asPath] = useState(urlMsg.asPath);
  const [projectList,changeProject] = useState([{
    key : null,
    value : "All"
  },{
    key : 0,
    value : "Pending"
  },{
    key : 1,
    value : "Approved"
  },{
    key : 2,
    value : "Open to join"
  },{
    key : 3,
    value : "In Progress"
  },{
    key : 4,
    value : "Ended"
  }]);
  const [courseList,changeCourseList] = useState([{
    key : null,
    value : "All Courses"
  },{
    key : "c001",
    value : "Software as a Service Project"
  },{
    key : "c002",
    value : "Machine Learning and Data Mining"
  },{
    key : "c003",
    value : "Information Technology Project"
  }]);
  const columns = [
    {
      title: 'Project Name',
      width: 100,
      dataIndex: 'projectName',
      key: 'projectName',
      fixed: 'left',
    },
    {
      title: 'Course',
      width: 100,
      dataIndex: 'course',
      key: 'course',
      fixed: 'left',
    },
    {
      title: 'Course Authority',
      dataIndex: 'courseAuthority',
      key: 'courseAuthority',
      width: 100,
    },
    {
      title: 'Project Capacity',
      dataIndex: 'currentStudentNumber',
      key: 'currentStudentNumber',
      width: 100,
      render:(currentStudentNumber)=>{
        return <div> {currentStudentNumber} / 100</div>
      }
    },
    {
      title: 'Statues',
      dataIndex: 'statues',
      key: 'statues',
      width: 100,
      render:(statues)=>{
        const filterList = projectList && projectList.filter((item) =>{
          return item.key === statues
        })
        if(!filterList || filterList.length === 0){
          return null;
        }
        return <div>{filterList[0].value}</div>
      }
    },
    {
      title: 'Start Time',
      dataIndex: 'startTime',
      key: 'startTime',
      width: 120,
    },
    {
      title: 'Close Time',
      dataIndex: 'closeTime',
      key: 'closeTime',
      width: 120,
    },
    {
      title: 'Action',
      key: 'operation',
      fixed: 'right',
      width: 100,
      render: (operation,actionInfo) =>{
        return <div
            className={"go-detail"}
           onClick={()=>{
             goDetail(actionInfo.id)
           }}
        >Detail</div>
      }
    },
  ];
  useEffect(()=>{
    setTimeout(() => {
      const _data = ref?.current?.getTabPaneOption() || {};
      changeSearch({
        projectType : _data.projectType || null,
        course : _data.course || null,
      })
      changePage({
        size : _data.size || 10,
        number : _data.number || 1,
        total : _data.total ||0
      })
      initList({
        size : _data.size || 10,
        number : _data.number || 1,
        total : _data.total ||0
      },{
        projectType : _data.projectType || null,
        course : _data.course || null,
      })
    },0)
  },[]);
  function goDetail(id){
    ref.current.setTabPane(
        `Project detail`,
        '',
        `/project/detail?id=${id}`
    )
  }
  function initList(initPage,initSearch) {
    initPage = initPage || page;
    initSearch = initSearch || search;
    const _data = [{
      id : "p001",
      projectName : "Natural Language Processing with Disaster Tweets",
      course : "Software as a Service Project",
      courseAuthority : "Jerry ",
      currentStudentNumber : 43,
      maxStudentNumber : 3,
      startTime : "11/05/2022",
      closeTime : "13/05/2022",
      statues : 0,
    },{
      id : "p002",
      projectName : "Movie finder system",
      course : "Machine Learning and Data Mining",
      courseAuthority : "Aaron",
      currentStudentNumber : 20,
      maxStudentNumber : 3,
      startTime : "15/05/2022",
      closeTime : "18/05/2022",
      statues : 1,
    },{
      id : "p003",
      projectName : "CVPR 2018 WAD Video Segmentation Challenge",
      course : "Information Technology Project",
      courseAuthority : "Adrian",
      currentStudentNumber : 30,
      maxStudentNumber : 3,
      startTime : "11/06/2022",
      closeTime : "13/06/2022",
      statues : 2,
    }]
    changeData(_data);
    changePage({
      ...initPage,
      ...{
        total : 3
      }
    });
  }
  function clearSearch() {
    changeSearch({
      projectType : null,
      course : null
    });
    changePage({
      ...page,
      ...{
        number : 1,
      }
    });
    initList({
      ...page,
      ...{
        number : 1,
      }
    },{
      projectType : null,
      course : null
    })
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
        <Table
          columns={columns}
          dataSource={data}
          scroll={{
            x: 1500,
          }}
          pagination={{
            showQuickJumper : true,
            total: page.total,
            style: { textAlign: 'right', marginTop: 20 },
            pageSize: page.size,
            current: page.number,
            showSizeChanger: true,
            rowKey: 'id',
            pageSizeOptions: [10, 20, 30, 50],
            showTotal: (e) => {
              return `${page.total} in total`;
            },
          }}
          loading={pageLoading}
          onChange={(pagination, filters, sorter) => {
            const _page = _.cloneDeep(page);
            const { current, pageSize } = pagination;
            _page.number = current;
            _page.size = pageSize;
            changePage(_page);
            initList(_page,null);
          }}
        />
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
