import { memo, useState } from "react"
import { useDragContext } from "./draggableContext"


const DroppableWrapper = memo(({onDrop, droppableTags=["widget"], ...props}) => {


    const { draggedElement } = useDragContext()

    const [showDroppable, setShowDroppable] = useState({
                                                            show: false, 
                                                            allow: false
                                                        })
    

    const handleDragEnter = (e) => {
        console.log("Drag Enter",  draggedElement)
        
        const dragElementType = draggedElement.getAttribute("data-draggable-type")

        if (droppableTags.length === 0 || droppableTags.includes(dragElementType)){
            setShowDroppable({
                allow: true, 
                show: true
            })
        }else{
            setShowDroppable({
                allow: false, 
                show: true
            })
        }
    }

    const handleDragOver = (e) => {
        // console.log("Drag over: ", e.dataTransfer.getData("text/plain"), e.dataTransfer)
        const dragElementType = draggedElement.getAttribute("data-draggable-type")
        
        if (droppableTags.length === 0 || droppableTags.includes(dragElementType)){
            e.preventDefault() // this is necessary to allow drop to take place
        }
        
    }

    const handleDropEvent = (e) => {
        console.log("Drag over: ", e.dataTransfer.getData("text/plain"), e.dataTransfer)

        setShowDroppable({
            allow: false, 
            show: false
        })

        if(onDrop){
            onDrop(e)
        }
    }


    const handleDragLeave = (e) => {
        if (!e.currentTarget.contains(e.relatedTarget)) {
            setShowDroppable({
                allow: false, 
                show: false
            })
        }
    }

    return (
        <div className={`${props.className}`}
                onDragOver={handleDragOver}
                onDrop={handleDropEvent}
                onDragEnter={handleDragEnter}
                onDragLeave={handleDragLeave}
                >
            {
                showDroppable.show && 
                    <div className={`${showDroppable.allow ? "tw-border-green-600" : "tw-border-red-600"} 
                                    tw-absolute tw-top-0 tw-left-0 tw-w-full tw-h-full tw-z-[2]
                                    tw-border-2 tw-border-dashed  tw-rounded-lg
                                    `}>
                    </div>
            }
            {props.children}
            
        </div>
    )

})


export default DroppableWrapper