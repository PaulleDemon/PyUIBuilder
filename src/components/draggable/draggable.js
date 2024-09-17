import { memo, useRef } from "react"
import { useDragContext } from "./draggableContext"


/**
 * 
 * @param {string} - dragElementType - this will set the data-draggable-type which can be accessed on droppable to check if its allowed or not
 * @returns 
 */
const DraggableWrapper = memo(({dragElementType, className, children, ...props}) => {

    const { onDragStart, onDragEnd } = useDragContext()

    const draggableRef = useRef(null)

    /**
     * 
     * @param {DragEvent} event 
     */
    const handleDragStart = (event) => {
        
        // event.dataTransfer.setData("text/plain", "")
        
        if (onDragStart)
            onDragStart(draggableRef?.current)


    }

    const handleDragEnd = (e) => {
        // console.log("Drag end: ", e, e.target.closest('div'))

        onDragEnd()
    }   

    return (
        <div className={`${className}`} 
                draggable 
                data-draggable-type={dragElementType}
                onDragStart={handleDragStart} 
                onDragEnd={handleDragEnd}
                ref={draggableRef}
                {...props}
                >
            {children}
        </div>
    )

})


export default DraggableWrapper