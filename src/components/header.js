import { useEffect, useState } from "react"

import { Select, Input, Button } from "antd"
import { CrownFilled, DownloadOutlined, DownOutlined } from "@ant-design/icons"
import FrameWorks from "../constants/frameworks"
import Premium from "../sidebar/utils/premium"


const items = [
    {
        value: FrameWorks.TKINTER,
        label: 'tkinter',
    },
    {
        value: FrameWorks.CUSTOMTK,
        label: 'customtk',
    },
]


function Header({projectName, onProjectNameChange, framework, onFrameworkChange,
                 onExportClick, className=''}){


    return (
        <div className={`tw-w-full tw-bg-primaryBg tw-p-2 tw-flex tw-place-items-center
                             ${className||''}`}>

            <Select
                // defaultValue={framework}
                value={framework}
                options={items}
                // onSelect={(key) => {console.log("value: ", key); onFrameworkChange(key); }}
                onChange={(key) => {onFrameworkChange(key)}}
                className="tw-min-w-[150px]"
            />
            
            <div className="tw-ml-auto tw-flex tw-gap-2 tw-place-content-center">
                <Premium className="tw-text-2xl tw-bg-purple-600 tw-text-center 
                                    tw-w-[40px] tw-min-w-[40px] tw-h-[35px] tw-rounded-md 
                                    tw-cursor-pointer tw-text-white 
                                    tw-transition-all
                                    hover:tw-scale-[1.2]">
                        <CrownFilled />
                </Premium>
                <Input value={projectName} onChange={(e) => onProjectNameChange(e.target.value)} placeholder="project name"/>
                <Button icon={<DownloadOutlined />} onClick={onExportClick}>
                    Export code
                </Button>
            </div>

        </div>
    )

} 

export default Header