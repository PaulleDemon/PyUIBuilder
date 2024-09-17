import React, { createContext, useContext, useState } from 'react';

const DragWidgetContext = createContext()

export const useDragWidgetContext = () => useContext(DragWidgetContext)

// Provider component to wrap around parts of your app that need drag-and-drop functionality
export const DragWidgetProvider = ({ children }) => {
    const [draggedElement, setDraggedElement] = useState(null)

    const onDragStart = (element) => {
        setDraggedElement(element)
    }

    const onDragEnd = () => {
        setDraggedElement(null)
    }

    return (
        <DragWidgetContext.Provider value={{ draggedElement, onDragStart, onDragEnd }}>
            {children}
        </DragWidgetContext.Provider>
    )
}
