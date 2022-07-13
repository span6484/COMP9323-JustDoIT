import PageBase from '../basePage'
import React ,{useRef} from 'react'

const PassedProject = ({ USERMESSAGE }) => {
  const ref = useRef();
  return (
    <PageBase cRef={ref} USERMESSAGE={USERMESSAGE}>
      <div>PassedProject</div>
    </PageBase>
  )
}

export default PassedProject
