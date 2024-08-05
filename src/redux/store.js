import { configureStore } from "@reduxjs/toolkit"

import userReducer from "./assetSlice"

const store = configureStore({
    reducer: {
        assets: userReducer,
    },
})

export default store