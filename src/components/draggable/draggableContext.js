import React, { createContext, useContext, useState } from 'react'

export const DragContext = createContext()

export const useDragContext = () => useContext(DragContext)

// Provider component to wrap around parts of your app that need drag-and-drop functionality
export const DragProvider = ({ children }) => {
    const [draggedElement, setDraggedElement] = useState(null)
    const [overElement, setOverElement] = useState(null) // the element the dragged items is over

    const onDragStart = (element) => {
        setDraggedElement(element)
    }

    const onDragEnd = () => {
        setDraggedElement(null)
    }

    return (
        <DragContext.Provider value={{ draggedElement, overElement, setOverElement, onDragStart, onDragEnd }}>
            {children}
        </DragContext.Provider>
    )
}
