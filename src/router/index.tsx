import React,{ lazy } from 'react'

import { Navigate } from 'react-router-dom'
import type { RouteObject } from 'react-router-dom'

const Login = lazy(()=> import("../views/login"))
const Home = lazy(()=> import("../views/home"))
const Chat = lazy(()=> import("../views/chat"))
const Friend = lazy(()=> import("../views/friend"))
const Me = lazy(()=> import("../views/me"))
const Canvas = lazy(()=> import("../views/canvas"))

const routes: RouteObject[] = [
    {
        path:"/",
        element: <Navigate to='/login'></Navigate>
    },
    {
        path:'/login',
        element:<Login></Login>
    },
    {
        path:'/home',
        element:<Home></Home>,
        children:[
            {
                path:'/home',
                element: <Navigate to='/home/chat'></Navigate>
            },
            {
                path:'/home/chat',
                element:<Chat></Chat>
            },
            {
                path:'/home/friend',
                element:<Friend></Friend>
            },
            {
                path:'/home/me',
                element:<Me></Me>
            },
            {
                path:'/home/canvas',
                element:<Canvas></Canvas>
            },
        ]
    },
    {
        path:'/canvas',
        element:<Canvas></Canvas>
    },
    {
        path:'*',
        element:'404'
    }
]

export default routes