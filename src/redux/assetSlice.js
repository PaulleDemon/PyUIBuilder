import { createSlice } from '@reduxjs/toolkit'

/**
 * contains global storage for user 
 */


 const initialState = {
    files: []
 }

export const assetSlice = createSlice({

    name: 'assets',
    initialState,

    reducers:{

        update: (state, action) => {
            state.files = action.payload.files
        }

    }

})

export const { update } = assetSlice.actions

export default assetSlice.reducer