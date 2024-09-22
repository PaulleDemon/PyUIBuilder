import Widget from "../canvas/widgets/base"

// checks if the object is instance is instance of widget class
export const isSubClassOfWidget = (_class) => {

    return  Widget.isPrototypeOf(_class) || _class === Widget
}



export const isInstanceOfWidget = (_class) => {

    console.log("Widget is instance of Object: ", _class)

    return _class instanceof Widget
}
