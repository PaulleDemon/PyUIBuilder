
import Widget from "../../canvas/widgets/base"

import ButtonWidget from "./assets/widgets/button.png"
import { CheckBox, RadioButton } from "./widgets/ checkButton"
import Button from "./widgets/button"
import Frame from "./widgets/frame"
import { Input, Text } from "./widgets/input"
import Label from "./widgets/label"
import MainWindow from "./widgets/mainWindow"
import OptionMenu from "./widgets/optionMenu"
import Slider from "./widgets/slider"
import TopLevel from "./widgets/toplevel"


const TkinterSidebar = [
    {
        name: "Main window",
        img: ButtonWidget,
        link: "https://github.com", 
        widgetClass: MainWindow
    },
    {
        name: "Top Level",
        img: ButtonWidget,
        link: "https://github.com", 
        widgetClass: TopLevel
    },
    {
        name: "Frame",
        img: ButtonWidget,
        link: "https://github.com",
        widgetClass: Frame
    },
    {
        name: "Label",
        img: ButtonWidget,
        link: "https://github.com",
        widgetClass: Label
    },
    {
        name: "Button",
        img: ButtonWidget,
        link: "https://github.com",
        widgetClass: Button
    },
    {
        name: "Entry",
        img: ButtonWidget,
        link: "https://github.com",
        widgetClass: Input
    },
    {
        name: "Text",
        img: ButtonWidget,
        link: "https://github.com",
        widgetClass: Text
    },
    {
        name: "CheckBox",
        img: ButtonWidget,
        link: "https://github.com",
        widgetClass: CheckBox
    },
    {
        name: "Radio button",
        img: ButtonWidget,
        link: "https://github.com",
        widgetClass: RadioButton
    },
    {
        name: "Scale",
        img: ButtonWidget,
        link: "https://github.com",
        widgetClass: Slider
    },
    {
        name: "Option Menu",
        img: ButtonWidget,
        link: "https://github.com",
        widgetClass: OptionMenu
    },

]


export default TkinterSidebar


/**
 *  widgets = {
        "Tk": set(),
        "Label": set(),
        "Button": set(),
        "Entry": set(),
        "CheckButton": set(),
        "RadioButton": set(),
        "Scale": set(),
        "ListBox": set(),
        "Frame": set(),
        "LabelFrame": set(),
        "PanedWindow": set(),
        "SpinBox": set(),
        "OptionMenu": set(),
        "Canvas": set(),
        "TopLevel": set(),
        "Message": set(),
        "Menu": set(),
        "MenuButton": set(),
        "ScrollBar": set(),
        "Text": set()
    }
 */