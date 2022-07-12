import PageBase from '../basePage'
import React ,{useRef} from 'react'

const CourseOverview = ({ USERMESSAGE }) => {
  const ref = useRef();
  return (
    <PageBase cRef={ref} USERMESSAGE={USERMESSAGE}>
      <div>Course</div>
    </PageBase>
  )
}

export default CourseOverview
