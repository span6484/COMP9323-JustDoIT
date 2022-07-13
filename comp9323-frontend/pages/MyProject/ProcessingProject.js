import PageBase from '../basePage'
import React ,{useRef} from 'react'

const ProcessingProject = ({ USERMESSAGE }) => {
  const ref = useRef();
  return (
    <PageBase cRef={ref} USERMESSAGE={USERMESSAGE}>
      <div>ProcessingProject</div>
    </PageBase>
  )
}

export default ProcessingProject
