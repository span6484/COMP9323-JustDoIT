import PageBase from '../basePage'
import React, { useEffect, useRef, useState } from "react";
import CourseOverviewStyle from "./CourseOverview.less";
import {Pagination,Tooltip} from "antd"
import {EllipsisOutlined} from "@ant-design/icons"
import {getCourses} from "../MockData"
import {setDay} from "../../util/common";
const CourseOverview = ({ USERMESSAGE }) => {
  const ref = useRef();
  const [courseList,changeCourseList] = useState([]);
  const [page,changePage] = useState({
    total : 20,
    number : 1,
    size : 10
  });
  const [loading, changeLoading] = useState(false)
  useEffect(()=>{
    getCourses({
      uid : USERMESSAGE && USERMESSAGE.uid || null
    }).then(res => {
      if(res.code === 200){
        const result = res.result;
        if(result){
          const {c_list} = result;
          changeCourseList(c_list || []);
        }else{
          changeCourseList([]);
        }
      }else{
        changeCourseList([]);
      }
    })
    // const _list = [ {}, {}, {}, {}, {},{}, {}, {}, {}, {},{}, {}];
    // changeCourseList(_list);
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
  function searchList(initPage) {
    initPage = initPage || page
  }
  return (
    <PageBase cRef={ref} USERMESSAGE={USERMESSAGE}>
      <style dangerouslySetInnerHTML={{
        __html: CourseOverviewStyle
      }}/>
      <div className={"course-overview-component"}>
        <div className={"awardList-box"}>
          {
            courseList && courseList.map((item,index) => {
              return <div className={"award-project-component-item"} key={"award-project-component-" + index}>
                      {/*<Tooltip placement="top" title={"Course Detail"}>*/}
                      {/*     <EllipsisOutlined className={"look_course_detail"}/>*/}
                      {/* </Tooltip>*/}
                      <Tooltip placement="top" title={item.name}>
                            <h5
                                onClick={()=>{
                                  ref.current.setTabPane(
                                      `Course Detail`,
                                      '',
                                      `/Dashboard/CourseDetail?id=${item.cid}`
                                  )
                                }}
                            >{item.name}</h5>
                      </Tooltip>
                      <h6>Duration: {setDay(item.start_time)} - {setDay(item.close_time)}</h6>
                  </div>
            })
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
        {/*        searchList(_page);*/}
        {/*      }}*/}
        {/*    />*/}
        {/*  </div>*/}
        {/*}*/}
      </div>
    </PageBase>
  )
}

export default CourseOverview
