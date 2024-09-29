import { useEffect, useState } from "react"

import Doggy from "../assets/images/doggy.png"

import { filterObjectListStartingWith } from "../utils/filter"
import { SearchComponent } from "../components/inputs"



function TemplatesContainer(){


    const [searchValue, setSearchValue] = useState("")
    const [widgetData, setWidgetData] = useState([])
 

    useEffect(() => {

        if (searchValue.length > 0){
            const searchData = filterObjectListStartingWith([], "name", searchValue)
            setWidgetData(searchData)
        }else{
            setWidgetData([])
        }

    }, [searchValue])

    function onSearch(event){

        setSearchValue(event.target.value)

    }

    return (
        <div className="tw-w-full tw-p-2 tw-gap-4 tw-flex tw-flex-col tw-overflow-x-hidden">

            <SearchComponent onSearch={onSearch} searchValue={searchValue} 
                            onClear={() => setSearchValue("")} />
            <div className="tw-flex tw-flex-col tw-place-items-center 
                                tw-gap-2 tw-h-full tw-p-1">
                
                <div className="tw-w-full tw-text-center tw-text-base tw-mt-6">
                    Templates coming soon. until then, here's a picture of doggo :)
                </div>

                <div className="tw-w-full tw-h-[250px]">
                    <img src={Doggy} alt="can i pet that dawg?" 
                        className="tw-bg-contain tw-w-full tw-h-auto" />
                </div>

                <div className="tw-flex tw-flex-col tw-mt-6 tw-gap-2">
                    <div>Want to be notified of the release?</div>
                    <a href="https://paulfreeman.substack.com/subscribe?utm_source=pyGUIBuilder_web" 
                        className="tw-p-2 tw-w-full tw-bg-blue-500 tw-rounded-md tw-no-underline
                                    tw-text-white tw-text-center tw-py-3"
                        target="_blank" rel="noreferrer noopener">Subscribe to newsletter</a>
                </div>
                
            </div>
            
        </div>
    )

}


export default TemplatesContainer