import { useEffect, useMemo, useState } from "react"

import { CloseCircleFilled, SearchOutlined } from "@ant-design/icons"

import {DraggableWidgetCard} from "../components/cards"

import ButtonWidget from "../assets/widgets/button.png"

import { filterObjectListStartingWith } from "../utils/filter"


/**
 * 
 * @param {function} onWidgetsUpdate - this is a callback that will be called once the sidebar is populated with widgets
 * @returns 
 */
function WidgetsContainer({onWidgetsUpdate}){

    const widgets = useMemo(() => {
        return [
            {
                name: "TopLevel",
                img: ButtonWidget,
                link: "https://github.com", 
                // widgetType: Widget
            },
            {
                name: "Frame",
                img: ButtonWidget,
                link: "https://github.com"
            },
            {
                name: "Button",
                img: ButtonWidget,
                link: "https://github.com"
            },
            {
                name: "Input",
                img: ButtonWidget,
                link: "https://github.com"
            },
        ]
    }, [])

    const [searchValue, setSearchValue] = useState("")
    const [widgetData, setWidgetData] = useState(widgets)
 
    useEffect(() => {

        setWidgetData(widgets)

        if (onWidgetsUpdate){
            onWidgetsUpdate(widgets)
        }

    }, [widgets])

    

    useEffect(() => {

        if (searchValue.length > 0){
            const searchData = filterObjectListStartingWith(widgets, "name", searchValue)
            setWidgetData(searchData)
        }else{
            setWidgetData(widgets)
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
                            <DraggableWidgetCard key={widget.name} 
                                                name={widget.name}
                                                img={widget.img}
                                                url={widget.link}
                                                />
                                
                        )
                    })
                }
            </div>
        </div>
    )

}


export default WidgetsContainer