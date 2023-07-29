import { jlReq } from ".."

// 登录
export const login = (config: any) =>{
    return jlReq.post<{
        code:number,
        data: boolean,
        Authorization: string,
        message: string,
    }>({
        url:'/login',
        data:config,
    })
}

// 注册
export const register = (config: any) =>{
    return jlReq.post<{
        code:number,
        data: boolean,
        message: string,
    }>({
        url:'/register',
        data:config,
    })
}

// 获取好友
export const getFriend = () =>{
    return jlReq.get<{
        code:number,
        data: any[],
        message: string,
    }>({
        url:'/getFriend'
    })
}

// 获取个人信息
export const getUserInfo = () =>{
    return jlReq.get<{
        code:number,
        data: {
            img: string,
            username: string,
            userId: string,
        },
        message: string,
    }>({
        url:'/getUserInfo'
    })
}

interface chatMsg{
    sendId: string,
    acceptId: string,
    acceptSocketId: string,
    message: string,
    time: number,
}
// 发送聊天纪录
export const storageChat = (data: chatMsg) =>{
    return jlReq.post({
        url:"/storageChat",
        data
    })
}

// 获取聊天记录
export const getStorageChat = (config: string) =>{
    return jlReq.post({
        url:"/getChat",
        data:{
            data:config
        }
    })
}