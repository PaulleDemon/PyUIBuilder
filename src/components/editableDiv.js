import React, { useState, useRef, useEffect } from 'react'


function EditableDiv({value, onChange, openEdit=false, maxLength=Infinity, className='', inputClassName}) {
    const [isEditable, setIsEditable] = useState(openEdit)
    const [content, setContent] = useState(value)
    const inputRef = useRef(null)

    useEffect(() => {

        setContent(value)

    }, [value])

    useEffect(() => {
        setIsEditable(openEdit)
        
        if (openEdit){
            setTimeout(() => {
                inputRef.current.focus()
            }, 15)
        }

    }, [openEdit])

    const handleInput = (event) => {
        onChange(event.target.value)
    }

    const handleEnterKey = (event) => {
        if (event.key === "Enter"){
            setIsEditable(false)
        }
    }

    const handleDoubleClick = () => {
        setIsEditable(true)
        setTimeout(() => inputRef.current.focus(), 1) 
    }

    const handleBlur = () => {
        setIsEditable(false)
    }

    return (
        <div
            className={`tw-w-fit ${className}`}
            onDoubleClick={handleDoubleClick}
            onBlur={handleBlur} // To exit edit mode when clicking outside
        >
            {!isEditable && <span className="tw-select-none">{content}</span>}
            <input type="text" value={content} 
                    onInput={handleInput}
                    maxLength={maxLength}
                    ref={inputRef}
                    onKeyDown={handleEnterKey}
                    className={`${!isEditable && "tw-hidden"} 
                                    tw-outline-none tw-bg-transparent 
                                    tw-border-none tw-p-1
                                    focus-within:tw-border-[1px]
                                    focus-within:tw-border-blue-500
                                    
                                    ${inputClassName}`} />
        </div>
    )
}

export default EditableDiv
