import { useEffect, useMemo, useState } from "react"

import { CloseCircleFilled, SearchOutlined } from "@ant-design/icons"

import {SidebarWidgetCard} from "../components/cards"

import ButtonWidget from "../assets/widgets/button.png"

import { filterObjectListStartingWith } from "../utils/filter"
import Widget from "../canvas/widgets/base"


/**
 * 
 * @param {function} onWidgetsUpdate - this is a callback that will be called once the sidebar is populated with widgets
 * @returns 
 */
function PluginsContainer({sidebarContent, onWidgetsUpdate}){


    const [searchValue, setSearchValue] = useState("")
    const [widgetData, setWidgetData] = useState(sidebarContent)
 
    useEffect(() => {

        setWidgetData(sidebarContent)
        // if (onWidgetsUpdate){
        //     onWidgetsUpdate(widgets)
        // }

    }, [sidebarContent])

    

    useEffect(() => {

        if (searchValue.length > 0){
            const searchData = filterObjectListStartingWith(sidebarContent, "name", searchValue)
            setWidgetData(searchData)
        }else{
            setWidgetData(sidebarContent)
        }

    }, [searchValue])

    function onSearch(event){

        setSearchValue(event.target.value)

    }

    return (
        <div className="tw-w-full tw-p-2 tw-gap-4 tw-flex tw-flex-col tw-overflow-x-hidden">

            <div className="tw-flex tw-gap-2 input tw-place-items-center">
                <SearchOutlined />
                <input type="text" placeholder="Search" className="tw-outline-none tw-w-full tw-border-none" 
                    id="" onInput={onSearch} value={searchValue}/>
                <div className="">
                    {
                        searchValue.length > 0 && 
                                    <div className="tw-cursor-pointer tw-text-gray-600" onClick={() => setSearchValue("")}>
                                        <CloseCircleFilled />
                                    </div>
                    }
                </div>
            </div>
            <div className="tw-flex tw-flex-col tw-gap-2 tw-h-full tw-p-1">
                
                {
                    widgetData.map((widget, index) => {
                        return (    
                            <SidebarWidgetCard key={widget.name} 
                                                name={widget.name}
                                                img={widget.img}
                                                url={widget.link}
                                                widgetClass={widget.widgetClass}
                                                />
                                
                        )
                    })
                }
            </div>
        </div>
    )

}


export default PluginsContainer