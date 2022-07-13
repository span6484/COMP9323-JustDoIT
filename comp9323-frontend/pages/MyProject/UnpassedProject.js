import PageBase from '../basePage'
import React ,{useRef} from 'react'

const UnpassedProject = ({ USERMESSAGE }) => {
  const ref = useRef();
  return (
    <PageBase cRef={ref} USERMESSAGE={USERMESSAGE}>
      <div>UnpassedProject</div>
    </PageBase>
  )
}

export default UnpassedProject
