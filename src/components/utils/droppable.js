import React from 'react'
import {useDroppable} from '@dnd-kit/core'

function Droppable(props) {
  const {isOver, setNodeRef} = useDroppable({
    id: props.id,
  })
  const style = {
    color: isOver ? 'green' : undefined,
  }
  
  
  return (
    <div ref={setNodeRef} style={style} className={props.className || ''}>
      {props.children}
    </div>
  )
}

export default Droppable