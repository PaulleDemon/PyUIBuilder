import { useState } from "react"

import { Modal } from "antd"

/**
 * opens modal when clicked, acts as a wrapper
 * @param {string} - message
 * @param {string} - title
 * @param {string} - okText
 * @param {"default"|"danger"|"primary"} - okButtonType
 * @returns 
 */
export const ButtonModal = ({ message, title, okText="OK", onOk, onCancel, okButtonType="default", children}) => {
    
    const [isModalOpen, setIsModalOpen] = useState(false)

    const showModal = () => {
        setIsModalOpen(true)
    }

    const handleOk = () => {
        setIsModalOpen(false)
        console.log("Ok pressed")
        if (onOk){
            onOk()
        }
    }
    
    const handleCancel = (e) => {
        e.stopPropagation()

        setIsModalOpen(false)
        console.log("cancel pressed")
        
        if (onCancel){
            onCancel()
        }
    }
    return (
        <div onClick={showModal}>
            {children}
            <Modal title={title} open={isModalOpen} onClose={handleCancel}
                    okText={okText}
                    onOk={handleOk} okType={okButtonType} onCancel={handleCancel}>
                <p>{message}</p>
            </Modal>
        </div>
    )
}


