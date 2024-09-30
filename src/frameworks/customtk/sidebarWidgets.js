

import MainWindow from "./widgets/mainWindow"
import TopLevel from "./widgets/toplevel"
import Frame from "./widgets/frame"
import Label from "./widgets/label"
import Button from "./widgets/button"
import OptionMenu from "./widgets/optionMenu"
import Slider from "./widgets/slider"
import { CheckBox, RadioButton } from "./widgets/ checkButton"
import { Input, Text } from "./widgets/input"
import SpinBox from "./widgets/spinBox"

import MainWindowImage from "./assets/widgets/main/mainwindow2.png"
import TopLevelImage from "./assets/widgets/main/Toplevel2.png"
import FrameImage from "./assets/widgets/main/frame2.png"
import LabelImage from "./assets/widgets/main/label.png"
import ButtonImage from "./assets/widgets/main/button2.png"
import InputImage from "./assets/widgets/main/input.png"
import TextAreaImage from "./assets/widgets/main/textarea.png"
import SliderImage from "./assets/widgets/main/slider.png"
import DropDownImage from "./assets/widgets/main/dropdown.png"
import CheckButtonImage from "./assets/widgets/main/check.png"
import RadioButtonImage from "./assets/widgets/main/radio.png"
import SpinBoxImage from "./assets/widgets/main/spinbox.png"


const CustomTkWidgets = [
    {
        name: "Main window",
        img: MainWindowImage,
        link: "https://customtkinter.tomschimansky.com/documentation/windows", 
        widgetClass: MainWindow
    },
    {
        name: "Top Level",
        img: TopLevelImage,
        link: "https://customtkinter.tomschimansky.com/documentation/windows", 
        widgetClass: TopLevel
    },
    {
        name: "Frame",
        img: FrameImage,
        link: "https://customtkinter.tomschimansky.com/documentation/widgets/frame",
        widgetClass: Frame
    },
    {
        name: "Label",
        img: LabelImage,
        link: "https://customtkinter.tomschimansky.com/documentation/widgets/label",
        widgetClass: Label
    },
    {
        name: "Button",
        img: ButtonImage,
        link: "https://customtkinter.tomschimansky.com/documentation/widgets/button",
        widgetClass: Button
    },
    {
        name: "Entry",
        img: InputImage,
        link: "https://customtkinter.tomschimansky.com/documentation/widgets/entry",
        widgetClass: Input
    },
    {
        name: "Text",
        img: TextAreaImage,
        link: "https://customtkinter.tomschimansky.com/documentation/widgets/textbox",
        widgetClass: Text
    },
    {
        name: "CheckBox",
        img: CheckButtonImage,
        link: "https://customtkinter.tomschimansky.com/documentation/widgets/checkbox",
        widgetClass: CheckBox
    },
    {
        name: "Radio button",
        img: RadioButtonImage,
        link: "https://customtkinter.tomschimansky.com/documentation/widgets/radiobutton",
        widgetClass: RadioButton
    },
    {
        name: "Slider",
        img: SliderImage,
        link: "https://customtkinter.tomschimansky.com/documentation/widgets/slider",
        widgetClass: Slider
    },
    {
        name: "Option Menu",
        img: DropDownImage,
        link: "https://customtkinter.tomschimansky.com/documentation/widgets/optionmenu",
        widgetClass: OptionMenu
    },
    // {
    //     name: "Spinbox",
    //     img: SpinBoxImage,
    //     link: "https://github.com",
    //     widgetClass: SpinBox
    // },

]


export default CustomTkWidgets


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