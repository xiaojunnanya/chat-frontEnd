import React, { memo, useEffect, useRef, useState } from 'react'
import type { FC, ReactNode } from 'react'
import { CanvasStyled } from './style'

import { AntDesignOutlined, UserOutlined } from '@ant-design/icons';
import { Avatar, Divider, Tooltip, ColorPicker, Slider, Button  } from 'antd';
import type { Color } from 'antd/es/color-picker';
import type { SliderMarks } from 'antd/es/slider';

import { SOCKET_CANVAS_URL } from '@/service/config';
import { io } from 'socket.io-client';
import { useAppSelector, useAppShallowEqual } from '@/store';

interface IPerson{
  children?: ReactNode
}
interface canavsType{
  isDown: boolean,
  x: number,
  y: number,
  canvasColor: string,
  lineSize: number
}

const style: React.CSSProperties = {
  display: 'inline-block',
  height: 300,
  marginLeft: 70,
};

// 预设的颜色
const colors = [
  '#000000',
  '#000000E0',
  '#000000A6',
  '#00000073',
  '#00000040',
  '#00000026',
  '#0000001A',
  '#00000012',
  '#0000000A',
  '#00000005',
  '#F5222D',
  '#FA8C16',
  '#FADB14',
  '#8BBB11',
  '#52C41A',
  '#13A8A8',
  '#1677FF',
  '#2F54EB',
  '#722ED1',
  '#EB2F96',
  '#F5222D4D',
  '#FA8C164D',
  '#FADB144D',
  '#8BBB114D',
  '#52C41A4D',
  '#13A8A84D',
  '#1677FF4D',
  '#2F54EB4D',
  '#722ED14D',
  '#EB2F964D',
]

// 纪录点击橡皮之前的
const erase = {
  lineSize:1,
  canvasColor:'#000'
}

const Home: FC<IPerson> = memo(() => {
  const [ socket, setSocket ] = useState<any>()
  // 在线用户
  const [ onlinePerson, setOnlinePerson ] = useState<any>()
  // 设置绘画状态
  const [ drawing, setDrawing ] = useState<boolean>(false)
  // canvas屏幕适应
  const [ canvasSize, setCanvasnSize ] = useState<number[]>([window.innerWidth - 350, window.innerHeight - 150])
  // 设置颜色
  const [ canvasColor, setCanvasColor ] = useState('#000')
  // 纪录当前绘画的内容，目前是在屏幕变化的时候，保留之前的绘画
  const [ drawed, setDrawed ] = useState<canavsType[]>([])
  // 纪录是不是橡皮状态
  const [ isErasing, setIsErasing ] = useState<boolean>(false)

  // 线的宽度：为什么不用useState？
  // 在canvas事件处理函数内部，涉及到了 lineSize 这个状态。
  // 由于闭包的特性，事件处理函数中引用的 lineSize 实际上是事件绑定时的那个 lineSize 的值，而不是最新的状态。
  const lineSize = useRef(1)



  // 用户信息
  const { userInfo } = useAppSelector((state) =>(
    {
      userInfo: state.home.selfInfo
    }
  ), useAppShallowEqual)

  // 获取画板
  const canvasRef = useRef<HTMLCanvasElement>(null)
  // 获取画笔
  const ctx = canvasRef.current?.getContext('2d')
  // 创建消息对象
  const canvasMsg: canavsType = {
    // 纪录鼠标是不是第一次点下
    isDown: false,
    x:0,
    y:0,
    lineSize:1,
    canvasColor:'#000'
  }
  

  // 在窗口大小改变时调整Canvas大小
  const handleWindowResize = () => {
    const newCanvasWidth = window.innerWidth - 350;
    const newCanvasHeight = window.innerHeight - 150;

    // 更新Canvas的大小
    if (canvasRef.current) {
      canvasRef.current.width = newCanvasWidth;
      canvasRef.current.height = newCanvasHeight;
      // 在这里可能还需要根据新的Canvas大小重绘之前的内容
    }

    setCanvasnSize([newCanvasWidth, newCanvasHeight]);
  };

  // 窗口大小改变的监听事件
  useEffect(() => {
    window.addEventListener('resize', handleWindowResize);
    window.addEventListener('load', handleWindowResize);


    return () => {
      window.removeEventListener('resize', handleWindowResize);
      window.removeEventListener('load', handleWindowResize);
    };
  }, []);

  
  useEffect(()=>{
      if(!canvasRef.current || !socket) return
      if(!ctx) return

      const startDrawing = (e: MouseEvent) =>{
        setDrawing(true);
    
        canvasMsg.isDown = true
        canvasMsg.x = e.offsetX
        canvasMsg.y = e.offsetY
        canvasMsg.canvasColor = canvasColor
        canvasMsg.lineSize = lineSize.current
        
        socket.emit('canvasMsg', canvasMsg)
      }

      const draw = (e: MouseEvent) => {
        if (!drawing) return; // 只有在绘图状态下才进行绘制
        canvasMsg.isDown = false
        canvasMsg.x = e.offsetX
        canvasMsg.y = e.offsetY
        canvasMsg.canvasColor = canvasColor
        canvasMsg.lineSize = lineSize.current
        
        socket.emit('canvasMsg', canvasMsg)
      }

      const stopDrawing = () => {
        setDrawing(false);
        canvasMsg.isDown = false
      }

      // 接收画布的信息
      socket.on('canvasData',(msg: canavsType)=>{
        // 数组是撤回功能
        if(Array.isArray(msg)){
           // 将Canvas内容清空
          ctx?.clearRect(0, 0, canvasRef.current!.width, canvasRef.current!.height);
          setDrawed(msg)
          for (const item of msg) {
              cannvsDraw(item)
          }
        }else{
          // 保存绘画信息
          setDrawed((drawed) => [...drawed, msg]);
          cannvsDraw(msg)
        }
      })

      canvasRef.current.addEventListener('mousedown', startDrawing);
      canvasRef.current.addEventListener('mousemove', draw);
      canvasRef.current.addEventListener('mouseup', stopDrawing);
      canvasRef.current.addEventListener('mouseout', stopDrawing);

      return () => {
        canvasRef.current?.removeEventListener('mousedown', startDrawing);
        canvasRef.current?.removeEventListener('mousemove', draw);
        canvasRef.current?.removeEventListener('mouseup', stopDrawing);
        canvasRef.current?.removeEventListener('mouseout', stopDrawing);
      };

  }, [userInfo.userId, socket, drawing])
  

  useEffect(()=>{
    const socketIo = io(SOCKET_CANVAS_URL, {
      query: {
        userId: userInfo.userId,
        username:userInfo.username,
        img: userInfo.img
      },
    });
    setSocket(socketIo)
    socketIo.on('online', (data: any) =>{
      console.log('画板用户在线', data.userList);
      setOnlinePerson(data.userList)
    })
  },[userInfo.userId])

  const changeColor = (value: Color) =>{
    console.log(value.toHexString());
    setCanvasColor(value.toHexString())
  }
  
  const changeLineSize = (value: any) =>{
    lineSize.current = value
  }

  // 清空功能
  const clean = () =>{
    ctx?.clearRect(0, 0, canvasRef.current!.width, canvasRef.current!.height)
    socket.emit('canvasMsg', [])
  }

  // 撤回功能
  const beforeCan = () =>{
    if(drawed.length === 0) return
    // 每一步的分组是 ： n 个 true + m 个false 。 
    // 每一组的思路是：
      // 1. 先删掉后面所有的false
      // 2. 然后找到前一个false（就是上一吧的尾部）
      // 3. 然后删掉后面的true

    let a = [...drawed]
    let falseIndex = -1
    let trueIndex = -1

    for (let i = a.length - 1; i >= 0 ; i--) {
      // 先删掉后面所有的false
      if(!a[i].isDown && falseIndex === -1){
        continue
      }else{
        falseIndex = i
      }
       // 找到到前一个false：有多组的情况，当只有一组是不会进入false的(加上大于1)
      if( a[i].isDown && trueIndex === -1 && i > 0){
        continue
      }else{
        trueIndex = i
        break
      }
    }
    a = a.slice(0, trueIndex)
    // 为什么直接传a，不是a[i]：我需要在接受部分来判断是不是数组（数组是撤回功能，不是数组是绘画功能）
    socket.emit('canvasMsg', a)
  }

  // 画画
  const cannvsDraw = (msg: canavsType) =>{
    const { isDown, x, y, canvasColor, lineSize } = msg
    // 保存绘画信息
    if(!ctx || ! canvasRef.current) return
    if(isDown){// 是不是第一次点下
      ctx.beginPath()
      ctx.moveTo(x, y)
    }else{
      ctx.lineTo(x, y)
      // 填充颜色
      ctx.strokeStyle = canvasColor
      // 设置线条宽度
      ctx.lineWidth = lineSize
      ctx.stroke()
    }
  }


  // 橡皮擦
  const isErase = (e: boolean) =>{
    setIsErasing(e)
    // 橡皮
    if(e){
      erase.canvasColor = canvasColor
      erase.lineSize = lineSize.current
      setCanvasColor('#fff')
      lineSize.current = 20
    }else{
      setCanvasColor(erase.canvasColor)
      lineSize.current = erase.lineSize
    }
  }

  // 在线人展示
  const tooltip = onlinePerson?.map( (item: any) =>{
    return (
      <Tooltip title={item.username} placement="top" key={item.userId}>
        <Avatar src={item.img} />
      </Tooltip>
    )
  })

  
  return (
    <CanvasStyled $isErasing={isErasing}>
      <div className="inOnline">
        <span>当前在线：</span>
        <Avatar.Group maxCount={2} size="large" className='headImgShow'
          maxStyle={{ color: '#f56a00', backgroundColor: '#fde3cf' }} >
            
          { tooltip }

        </Avatar.Group>
        <Divider />
      </div>
      <div className='two'>
        <div className="canvas">
          <canvas ref={canvasRef} width={canvasSize[0]} height={canvasSize[1]}></canvas>
        </div>

        <div className='three'>
          
          <div className='color'>
            <ColorPicker trigger="hover" presets={[{label: '推荐', colors}]} defaultValue='#000'
            onChange={changeColor}></ColorPicker>
          </div>

          <div style={style} className='lineSize'>
            <Slider vertical defaultValue={lineSize.current} min={1} max={20} onChange={changeLineSize}/>
          </div>

          <div className='btn'>
            <Button onClick={clean}>清空</Button>
          </div>

          <div className='btn'>
            <Button onClick={beforeCan}>回撤</Button>
          </div>

          <div className='btn'>
            <Button onClick={()=>{isErase(false)}}>画笔</Button>
          </div>

          <div className='btn'>
            <Button onClick={()=>{isErase(true)}}>橡皮擦</Button>
          </div>

        </div>
      </div>
    </CanvasStyled>
  )
})

export default Home