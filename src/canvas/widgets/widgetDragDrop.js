import { memo, useEffect, useRef, useState } from "react"
import { useDragWidgetContext } from "./draggableWidgetContext"
import { useDragContext } from "../../components/draggable/draggableContext"


// FIXME: sometimes even after drag end the showDroppable is visible
/**
 * @param {} - widgetRef - the widget ref for your widget
 * @param {boolean} - enableDraggable - should the widget be draggable
 * @param {string} - dragElementType - the widget type of widget so the droppable knows if the widget can be accepted
 * @param {() => void} - onDrop - the widget type of widget so the droppable knows if the widget can be accepted
 * @param {string[]} - droppableTags - array of widget that can be dropped on the widget
 * 
 */
const WidgetDraggable = memo(({ widgetRef, enableDrag=true, dragElementType="widget", 
                                onDragEnter, onDragLeave, onDrop, style={},
                                droppableTags = {}, ...props }) => {

    // const { draggedElement, onDragStart, onDragEnd } = useDragWidgetContext()
    const { draggedElement, onDragStart, onDragEnd, overElement, setOverElement } = useDragContext()

    // const [dragEnabled, setDragEnabled] = useState(enableDraggable)
    const [isDragging, setIsDragging] = useState(false)

    const [showDroppable, setShowDroppable] = useState({
        show: false,
        allow: false
    })

    const handleDragStart = (e) => {
        e.stopPropagation()
        setIsDragging(true)

        onDragStart(widgetRef?.current || null)

        console.log("Drag start: ", widgetRef.current)

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
        if (draggedElement === widgetRef.current){
            // prevent drop on itself, since the widget is invisible when dragging, if dropped on itself, it may consume itself
            return 
        }

        setOverElement(e.currentTarget)

        let showDrop = {
            allow: true, 
            show: true
        }
        const allowDrop = (Object.keys(droppableTags).length === 0 || 
                            (droppableTags.include.length > 0 && droppableTags.include.includes(dragEleType)) || 
                            (droppableTags.exclude.length > 0 && !droppableTags.exclude.includes(dragEleType))
                        )

        if (allowDrop) {
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
        if (draggedElement === widgetRef.current){
            // prevent drop on itself, since the widget is invisible when dragging, if dropped on itself, it may consume itself
            return 
        }
        // console.log("Drag over: ", e.dataTransfer.getData("text/plain"), e.dataTransfer)
        const dragEleType = draggedElement.getAttribute("data-draggable-type")

        const allowDrop = (Object.keys(droppableTags).length === 0 || 
                            (droppableTags.include.length > 0 && droppableTags.include.includes(dragEleType)) || 
                            (droppableTags.exclude.length > 0 && !droppableTags.exclude.includes(dragEleType))
                        )

        if (allowDrop) {
            e.preventDefault() // this is necessary to allow drop to take place
        }

    }

    const handleDropEvent = (e) => {
        e.preventDefault()
        e.stopPropagation()
        console.log("Dropped: ", draggedElement, props.children)

        setShowDroppable({
            allow: false,
            show: false
        })

        if (onDrop) {
            onDrop(e, draggedElement)
        }

        // if (draggedElement === widgetRef.current){
        //     // prevent drop on itself, since the widget is invisible when dragging, if dropped on itself, it may consume itself
        //     return 
        // }

        let currentElement = e.currentTarget
        while (currentElement) {
            if (currentElement === draggedElement) {
                console.log("Dropped into a descendant element, ignoring drop")
                return // Exit early to prevent the drop
            }
            currentElement = currentElement.parentElement // Traverse up to check ancestors
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

    // TODO: FIXME, currently the draggable div doesn't move with the child, instead only child div moves, simulating childrens movement, add color and check
    return (
        <div className={`${props.className || ""}`}
            onDragOver={handleDragOver}
            onDrop={handleDropEvent}
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
            draggable={enableDrag}
            style={{ opacity: isDragging ? 0.3 : 1, ...style}} // hide the initial position when dragging
        >   
            {props.children}
        </div>
    )

})


export default WidgetDraggable