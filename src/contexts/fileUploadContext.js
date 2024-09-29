import React, { createContext, useContext, useState } from 'react';

const FileUploadContext = createContext()

export const useFileUploadContext = () => useContext(FileUploadContext)

// Provider component to wrap around parts that needs upload context
export const FileUploadProvider = ({ children }) => {
    
    const [uploadedAssets, setUploadedAssets] = useState([])

    return (
        <FileUploadContext.Provider value={{ uploadedAssets, setUploadedAssets }}>
            {children}
        </FileUploadContext.Provider>
    )
}
