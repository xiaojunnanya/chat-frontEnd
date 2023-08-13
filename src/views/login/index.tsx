import { Button, Form, Input, Modal, message } from 'antd'
import type { FormInstance } from 'antd'
import React, { memo, useRef, useState } from 'react'
import type { FC, ReactNode } from 'react'
import { LoginStyled } from './style'
import { login, register } from '@/service/modules'
import { useNavigate } from 'react-router-dom'

interface IPerson{
  children?: ReactNode
}

const Login: FC<IPerson> = memo(() => {
    const navigate = useNavigate()
    const [open, setOpen] = useState(false);
    const formRef = useRef<FormInstance>(null);

    //登录
    const onFinish = async (values: any) => {
        let res = await login(values)
        message.destroy()
        if( res.status === 500 ||  res.data.code === 500){
            message.error('登录失败，请稍后重试');
        }else{
            if(res.data.data){
                navigate('/home/chat')
                sessionStorage.setItem('Authorization', res.data.Authorization)
                message.success(res.data.message);
            }else{
                message.error(res.data.message);
            }
        }
    };

    //注册
    const registerFun = async (values: any) => {
        let res = await register(values)
        if(res.data.data){
            setOpen(false);
            message.success(res.data.message);
        }else{
            message.error(res.data.message);
        }
    };

    // 点击注册弹窗
    const regiterBnt = () =>{
        // 将之前的字段清空
        formRef.current?.resetFields();
        setOpen(true)
    }

    return (
        <LoginStyled>
            <div className="video-box">
                <video className="video-background" preload="auto" 
                loop playsInline autoPlay 
                src="http://www.xiaojunnan.cn/video/1.mp4" 
                muted></video>
            </div>


            <div className="form">
                <Form name="login" labelCol={{ span: 8 }} wrapperCol={{ span: 8 }} style={{ maxWidth: 600 }} 
                initialValues={{ remember: true }} onFinish={onFinish} autoComplete="off">
                    <Form.Item label="账户" name="username" initialValue='aa' rules={[{ required: true, message: '请输入账号' }]}>
                        <Input />
                    </Form.Item>

                    <Form.Item label="密码" name="password" initialValue='112233' rules={[{ required: true, message: '请输入密码' }]}>
                        <Input.Password />
                    </Form.Item>

                    <Form.Item wrapperCol={{ offset: 8}}>
                        <Button type="primary" htmlType="submit">登录</Button>
                        <Button type="primary" onClick={regiterBnt}>注册</Button>
                    </Form.Item>
                </Form>
            </div>
            <div className="modal">
                <Modal title="注册用户" open={open} onCancel={()=>{setOpen(false)}} width={600}>
                    <Form name="register" labelCol={{ span: 8 }} wrapperCol={{ span: 8 }} style={{ maxWidth: 600 }} 
                    initialValues={{ remember: true }} autoComplete="off" onFinish={registerFun} ref={formRef}>
                        <Form.Item label="账户" name="regSername" rules={[{ required: true, message: '请输入账号' }]}>
                            <Input />
                        </Form.Item>

                        <Form.Item label="密码" name="regPassword" rules={[{ required: true, message: '请输入密码' }]}>
                            <Input.Password />
                        </Form.Item>

                        <Form.Item wrapperCol={{ offset: 7}}>
                            <Button type="primary" htmlType="submit">注册</Button>
                            <Button type="primary" onClick={()=>{setOpen(false)}}>取消</Button>
                        </Form.Item>
                    </Form>
                </Modal>
            </div>
            
        </LoginStyled>
    )
})

export default Login