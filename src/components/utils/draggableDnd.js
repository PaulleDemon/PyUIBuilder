import React from "react"
import {useDraggable} from "@dnd-kit/core"
import { CSS } from "@dnd-kit/utilities"


function Draggable(props) {
    const {attributes, listeners, setNodeRef, transform} = useDraggable({
      id: props.id,
      data: {title: props.children}
    })
    const style = transform ? {
      transform: CSS.Translate.toString(transform),
    } : undefined
  
    
    return (
      <button className={`tw-bg-transparent tw-outline-none tw-border-none ${props.className}`} 
              ref={setNodeRef} 
              style={style} 
              {...listeners} 
              {...attributes}>
        {props.children}
      </button>
    )
}


export default Draggable