import React, { useState, useRef, useEffect } from 'react'


function EditableDiv({value, onChange, maxLength=Infinity, className='', inputClassName}) {
    const [isEditable, setIsEditable] = useState(false)
    const [content, setContent] = useState(value)
    const inputRef = useRef(null)

    useEffect(() => {

        setContent(value)

    }, [value])

    const handleInput = (event) => {

        console.log("Event key: ", event.key)
        onChange(event.target.value)

        // if (event.key === "")
    }

    const handleEnterKey = (event) => {
        console.log("Event key: ", event.key)

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
