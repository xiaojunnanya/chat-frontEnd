import { getUserInfo } from "@/service/modules";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// 获取个人信息
export const fetchSelfInfo = createAsyncThunk("fetch/selfInfo",async (payload, { dispatch, getState })=>{
    const res = await getUserInfo()
    dispatch(showSelfInfo(res.data.data))
})

interface IHomeSlice{
    selfInfo:{
        username: string,
        userId: string,
        img: string
    }
}
    

const initialState: IHomeSlice = {
    selfInfo: {
        username:'',
        userId:'',
        img:''
    }
}

const homeSlice = createSlice({
    name:'homeSlice',
    initialState,
    reducers:{
        showSelfInfo(state, action){
            state.selfInfo = action.payload
        }
    }
})


export const { showSelfInfo } = homeSlice.actions

export default homeSlice.reducer

