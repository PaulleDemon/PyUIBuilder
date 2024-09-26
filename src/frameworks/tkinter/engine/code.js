import MainWindow from "../widgets/mainWindow"

import { message } from "antd"


async function generateTkinterCode(projectName, widgetList=[], widgetRefs=[]){

    console.log("widgetList and refs", projectName, widgetList, widgetRefs)

    let mainWindowCount = 0

    for (let widget of widgetList){
        if (widget.widgetType === MainWindow){
            mainWindowCount += 1
        }

        if (mainWindowCount > 1){
            message.error("Multiple instances of Main window found, delete one and try again.")
            return
        }

    }

    if (mainWindowCount === 0){
        message.error("Aborting. No instances of Main window found. Add one and try again")
    }



}


export default generateTkinterCode