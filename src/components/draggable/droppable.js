import { memo, useEffect, useState } from "react"
import { useDragContext } from "./draggableContext"


/**
 * @param {{include: [], exclude: []} || {} || null} - droppableTags - if empty object, allows everything to be dropped, if null nothing can be dropped, define include to allow only included widgets, define exclude to exclude
 */
const DroppableWrapper = memo(({onDrop, droppableTags={}, ...props}) => {


    const { draggedElement, overElement, setOverElement, widgetClass } = useDragContext()

    const [showDroppable, setShowDroppable] = useState({
                                                            show: false, 
                                                            allow: false
                                                        })
    
    useEffect(() => {

        if (draggedElement === null){
            setShowDroppable({
                show: false, 
                allow: false
            })
        }

    }, [draggedElement])

    const handleDragEnter = (e) => {
        
        if (!draggedElement || !draggedElement.getAttribute("data-drag-start-within")){
            // if the drag is starting from outside (eg: file drop) or if drag doesn't exist
            return
        }

        const dragElementType = draggedElement.getAttribute("data-draggable-type")


        setOverElement(e.currentTarget)

        const allowDrop = (droppableTags && droppableTags !== null && (Object.keys(droppableTags).length === 0 || 
                            (droppableTags.include?.length > 0 && droppableTags.include?.includes(dragElementType)) || 
                            (droppableTags.exclude?.length > 0 && !droppableTags.exclude?.includes(dragElementType))
                        ))

        if (allowDrop){
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

        if (!draggedElement || !draggedElement.getAttribute("data-drag-start-within")){
            // if the drag is starting from outside (eg: file drop) or if drag doesn't exist
            return
        }

        // console.log("Drag over: ", e.dataTransfer.getData("text/plain"), e.dataTransfer)
        const dragElementType = draggedElement.getAttribute("data-draggable-type")

        const allowDrop = (droppableTags && droppableTags !== null && (Object.keys(droppableTags).length === 0 || 
                            (droppableTags.include?.length > 0 && droppableTags.include?.includes(dragElementType)) || 
                            (droppableTags.exclude?.length > 0 && !droppableTags.exclude?.includes(dragElementType))
                        ))

        if (allowDrop){
            e.preventDefault() // this is necessary to allow drop to take place
        }
        
    }

    const handleDropEvent = (e) => {

        setShowDroppable({
            allow: false, 
            show: false
        })

        if (!draggedElement || !draggedElement.getAttribute("data-drag-start-within")){
            // if the drag is starting from outside (eg: file drop) or if drag doesn't exist
            return
        }

        e.stopPropagation()


        const dragElementType = draggedElement.getAttribute("data-draggable-type")


        const allowDrop = (droppableTags && droppableTags !== null && (Object.keys(droppableTags).length === 0 || 
                            (droppableTags.include?.length > 0 && droppableTags.include?.includes(dragElementType)) || 
                            (droppableTags.exclude?.length > 0 && !droppableTags.exclude?.includes(dragElementType))
                        ))

        if(onDrop && allowDrop){
            onDrop(e, draggedElement, widgetClass)
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
            
            {props.children}

            {
                showDroppable.show && 
                    <div className={`${showDroppable.allow ? "tw-border-green-600" : "tw-border-red-600"} 
                                    tw-absolute tw-top-0 tw-left-0 tw-w-full tw-h-full tw-z-[2]
                                    tw-border-2 tw-border-dashed  tw-rounded-lg tw-pointer-events-none
                                    `}>
                    </div>
            }
            
        </div>
    )

})


export default DroppableWrapper