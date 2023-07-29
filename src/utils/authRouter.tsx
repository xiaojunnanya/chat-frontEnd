import React from 'react'
import { useLocation, Navigate } from 'react-router-dom'

const AuthRouter = (props: { children: JSX.Element }) =>{
    const { pathname } = useLocation()
    if( pathname === '/login' ){
        return props.children
    }
    if(!sessionStorage.getItem('Authorization')){
        return <Navigate to='/login'></Navigate>
    }else{
        return props.children
    }
}

export default AuthRouter