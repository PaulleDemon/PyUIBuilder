import { useState } from "react"

import { Select, Input } from "antd"
import { DownOutlined } from "@ant-design/icons"

const items = [
    {
        key: 'tkinter',
        label: 'tkinter',
    },
    {
        key: 'customtk',
        label: 'customtk',
    },
]


function Header(props){

    const [projectName, setProjectName] = useState("project")

    return (
        <div className={`tw-w-full tw-bg-primaryBg tw-p-2 tw-flex tw-place-items-center
                             ${props.className||''}`}>

            <Select
                defaultValue={"tkinter"}
                options={items}
                className="tw-min-w-[150px]"
            />
            
            <div className="tw-ml-auto tw-flex tw-place-content-center">
                <Input value={projectName} onChange={(e) => setProjectName(e.target.value)} placeholder="project name"/>
            </div>

        </div>
    )

} 

export default Header