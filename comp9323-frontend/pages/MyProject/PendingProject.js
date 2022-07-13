import PageBase from '../basePage'
import React ,{useRef} from 'react'

const PendingProject = ({ USERMESSAGE }) => {
  const ref = useRef();
  return (
    <PageBase cRef={ref} USERMESSAGE={USERMESSAGE}>
      <div>PendingProject</div>
    </PageBase>
  )
}

export default PendingProject
