import PageBase from '../basePage'
import React ,{useRef} from 'react'

const AllProject = ({ USERMESSAGE }) => {
  const ref = useRef();
  return (
    <PageBase cRef={ref} USERMESSAGE={USERMESSAGE}>
      <div>AllProject</div>
    </PageBase>
  )
}

export default AllProject
