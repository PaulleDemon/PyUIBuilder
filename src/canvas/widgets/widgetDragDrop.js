import { memo, useState } from "react"
import { useDragWidgetContext } from "./draggableWidgetContext"
import { useDragContext } from "../../components/draggable/draggableContext"


const WidgetDraggable = memo(({ widgetRef, dragElementType="widget", onDrop, droppableTags = ["widget"], ...props }) => {


    // const { draggedElement, onDragStart, onDragEnd } = useDragWidgetContext()
    const { draggedElement, onDragStart, onDragEnd } = useDragContext()

    const [isDragging, setIsDragging] = useState(false)

    const [showDroppable, setShowDroppable] = useState({
        show: false,
        allow: false
    })

    const handleDragStart = (e) => {
        setIsDragging(true)

        console.log("Draggable widget ref: ", widgetRef)
        onDragStart(widgetRef?.current || null)

        // Create custom drag image with full opacity, this will ensure the image isn't taken from part of the canvas
        const dragImage = widgetRef?.current.cloneNode(true)
        dragImage.style.opacity = '1' // Ensure full opacity
        dragImage.style.position = 'absolute'
        dragImage.style.top = '-9999px' // Move it out of view

        document.body.appendChild(dragImage)
        const rect = widgetRef?.current.getBoundingClientRect()
        const offsetX = e.clientX - rect.left
        const offsetY = e.clientY - rect.top

        // Set the custom drag image with correct offset to avoid snapping to the top-left corner
        e.dataTransfer.setDragImage(dragImage, offsetX, offsetY)

        // Remove the custom drag image after some time to avoid leaving it in the DOM
        setTimeout(() => {
            document.body.removeChild(dragImage)
        }, 0)
    }

    const handleDragEnter = (e) => {

        const dragEleType = draggedElement.getAttribute("data-draggable-type")

        if (droppableTags.length === 0 || droppableTags.includes(dragEleType)) {
            setShowDroppable({
                allow: true,
                show: true
            })
        } else {
            setShowDroppable({
                allow: false,
                show: true
            })
        }
    }

    const handleDragOver = (e) => {
        // console.log("Drag over: ", e.dataTransfer.getData("text/plain"), e.dataTransfer)
        const dragEleType = draggedElement.getAttribute("data-draggable-type")

        if (droppableTags.length === 0 || droppableTags.includes(dragEleType)) {
            e.preventDefault() // this is necessary to allow drop to take place
        }

    }

    const handleDropEvent = (e) => {

        setShowDroppable({
            allow: false,
            show: false
        })

        if (onDrop) {
            onDrop(e, draggedElement)
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

    const handleDragEnd = () => {
        onDragEnd()
        setIsDragging(false)
    }

    return (
        <div className={`${props.className} tw-w-fit tw-h-fit`}
            onDragOver={handleDragOver}
            onDrop={handleDropEvent}
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}

            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
            draggable
            style={{ opacity: isDragging ? 0 : 1}} // hide the initial position when dragging
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


export default WidgetDraggable