import { memo, useEffect, useState } from "react"
import { useDragWidgetContext } from "./draggableWidgetContext"
import { useDragContext } from "../../components/draggable/draggableContext"


/**
 * @param {} - widgetRef - the widget ref for your widget
 * @param {boolean} - enableDraggable - should the widget be draggable
 * @param {string} - dragElementType - the widget type of widget so the droppable knows if the widget can be accepted
 * @param {() => void} - onDrop - the widget type of widget so the droppable knows if the widget can be accepted
 * @param {string[]} - droppableTags - array of widget that can be dropped on the widget
 * 
 */
const WidgetDraggable = memo(({ widgetRef, enableDrag=true, dragElementType="widget", 
                                onDragEnter, onDragLeave, onDrop, 
                                droppableTags = ["widget"], ...props }) => {


    // const { draggedElement, onDragStart, onDragEnd } = useDragWidgetContext()
    const { draggedElement, onDragStart, onDragEnd, overElement, setOverElement } = useDragContext()

    // const [dragEnabled, setDragEnabled] = useState(enableDraggable)
    const [isDragging, setIsDragging] = useState(false)

    const [showDroppable, setShowDroppable] = useState({
        show: false,
        allow: false
    })

    const handleDragStart = (e) => {
        setIsDragging(true)

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

        // console.log("Drag entering...", overElement === e.currentTarget)

        setOverElement(e.currentTarget)

        let showDrop = {
            allow: true, 
            show: true
        }

        if (droppableTags.length === 0 || droppableTags.includes(dragEleType)) {
            showDrop = {
                allow: true,
                show: true
            }

        } else {
            showDrop = {
                allow: false,
                show: true
            }
        }

        setShowDroppable(showDrop)
        if (onDragEnter)
            onDragEnter({element: draggedElement, showDrop})
       
    }

    const handleDragOver = (e) => {
        // console.log("Drag over: ", e.dataTransfer.getData("text/plain"), e.dataTransfer)
        const dragEleType = draggedElement.getAttribute("data-draggable-type")

        if (droppableTags.length === 0 || droppableTags.includes(dragEleType)) {
            e.preventDefault() // this is necessary to allow drop to take place
        }

    }

    const handleDropEvent = (e) => {
        e.preventDefault()
        e.stopPropagation()
        // console.log("Dropped")

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

            if (onDragLeave)
                onDragLeave()

        }
    }

    const handleDragEnd = () => {
        onDragEnd()
        setIsDragging(false)
    }

    return (
        <div className={`${props.className} tw-w-fit tw-h-fit tw-bg-blue`}
            onDragOver={handleDragOver}
            onDrop={handleDropEvent}
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
            draggable={enableDrag}
            style={{ opacity: isDragging ? 0 : 1}} // hide the initial position when dragging
        >   
            {props.children}
            
        </div>
    )

})


export default WidgetDraggable