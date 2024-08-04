import React from "react"
import {useDraggable} from "@dnd-kit/core"


function Draggable(props) {
    const {attributes, listeners, setNodeRef, transform} = useDraggable({
      id: 'draggable',
    })
    const style = transform ? {
      transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
    } : undefined
  
    
    return (
      <button className={`tw-bg-transparent tw-outline-none tw-border-none ${props.className}`} ref={setNodeRef} style={style} {...listeners} {...attributes}>
        {props.children}
      </button>
    )
}


export default Draggable