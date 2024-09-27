import { useEffect, useMemo, useRef, useState } from "react"
// import { useDispatch, useSelector } from "react-redux"

import {  Upload, message } from "antd"

import { CloseCircleFilled, InboxOutlined, SearchOutlined } from "@ant-design/icons"

import { DraggableAssetCard } from "../components/cards.js"
import { filterObjectListStartingWith } from "../utils/filter"
import { getFileType } from "../utils/file.js"
import { SearchComponent } from "../components/inputs.js"
import { useFileUploadContext } from "../contexts/fileUploadContext.js"
// import { update } from "../redux/assetSlice.js"



const { Dragger } = Upload
const fileTypes = ["JPG", "PNG", "GIF"]

const props = {
    name: 'file',
    multiple: true,
    showUploadList: false,
    customRequest(options){
        const { onSuccess, onError, file, onProgress } = options
        onSuccess("Ok")
    },
    // onDrop(e) {
    //     console.log('Dropped files', e.dataTransfer.files)
    // },
};

/**
 * DND for file uploads
 *  
 */
function UploadsContainer() {

    // const dispatch = useDispatch()
    // const selector = useSelector(state => state.assets)

    const fileUploadRef = useRef()
    const [dragEnter, setDragEnter] = useState(false)

    const [searchValue, setSearchValue] = useState("")
    // const [uploadData, setUploadData] = useState(assets) // contains all the uploaded data
    
    const {uploadedAssets, setUploadedAssets} = useFileUploadContext()

    const [uploadResults, setUploadResults] = useState(uploadedAssets) // sets search results
    
    // useEffect(() => {
    //     setUploadResults(uploadData)
    // }, [uploadData])

    useEffect(() => {
        setUploadResults(uploadedAssets)
    }, [uploadedAssets])

    useEffect(() => {

        if (searchValue.length > 0) {
            const searchData = filterObjectListStartingWith(uploadedAssets, "name", searchValue)
            setUploadResults(searchData)
        } else {
            setUploadResults(uploadedAssets)
        }

    }, [searchValue])

    function onSearch(event) {
        setSearchValue(event.target.value)
    }

    function handleDelete(file){
        // remove the file from the asset on delete
        setUploadedAssets(prev => prev.filter(val => val.uid !== file.uid))

    }

    return (
        <div className="tw-w-full tw-p-2 tw-gap-4 tw-flex tw-flex-col"
                    onDragEnter={() => { setDragEnter(true) }}
                    onDragLeave={(e) => {
                        // Ensure the drag leave is happening on the container and not on a child element
                        if (e.currentTarget.contains(e.relatedTarget)) {
                            return
                        }
                        setDragEnter(false)
                    }}
                >

            <SearchComponent onSearch={onSearch} searchValue={searchValue} 
                                        onClear={() => setSearchValue("")} />
            <div className="tw-flex tw-relative tw-flex-col tw-gap-2 tw-h-full tw-p-1 tw-pb-4">
                <Dragger className={`${dragEnter && "!tw-h-[80vh] !tw-opacity-100 !tw-bg-[#fafafa] tw-absolute tw-top-0 tw-z-10"} tw-w-full !tw-min-w-[250px]`}
                    {...props}
                    ref={fileUploadRef}
                    onChange = {
                        (info) => {
                            const { status } = info.file
                            
                            if (status === 'done') {
                                // console.log("file: ", info)
                                let previewUrl = ""
                                
                                const fileType = getFileType(info.file)

                                if (fileType === "image" || fileType === "video"){
                                    previewUrl = URL.createObjectURL(info.file.originFileObj)
                                }
                                
                                const newFileData = {
                                    ...info.file,
                                    previewUrl,
                                    fileType,
                                }

                                // setUploadData(prev => [newFileData, ...prev])
                                setUploadedAssets(prev => [newFileData, ...prev])
                                // onAssetUploadChange([newFileData, ...uploadData])
                                setDragEnter(false)
                                
                                message.success(`${info.file.name} file uploaded successfully.`)
                            } else if (status === 'error') {
                                message.error(`${info.file.name} file upload failed.`)
                                setDragEnter(false)
                            }
                        }
                    }
                    >
                    <p className="ant-upload-drag-icon">
                        <InboxOutlined />
                    </p>
                    <p className="ant-upload-text">Click or drag file to this area to upload</p>
                </Dragger>
                {
                    uploadResults.map((file, index) => {
                        return (
                            <DraggableAssetCard key={file.uid}
                                file={file}
                                onDelete={handleDelete}
                            />

                        )
                    })
                }
            </div>
        </div>
    )

}


export default UploadsContainer