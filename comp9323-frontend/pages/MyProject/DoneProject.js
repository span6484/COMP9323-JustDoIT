import PageBase from '../basePage'
import React ,{useRef} from 'react'

const DoneProject = ({ USERMESSAGE }) => {
  const ref = useRef();
  return (
    <PageBase cRef={ref} USERMESSAGE={USERMESSAGE}>
      <div>DoneProject</div>
    </PageBase>
  )
}

export default DoneProject
