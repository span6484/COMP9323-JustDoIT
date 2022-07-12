import PageBase from '../basePage'
import React ,{useRef} from 'react'

const AwardProjects = ({ USERMESSAGE }) => {
  const ref = useRef();
  return (
    <PageBase cRef={ref} USERMESSAGE={USERMESSAGE}>
      <div>Award</div>
    </PageBase>
  )
}

export default AwardProjects
