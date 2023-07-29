import React, { memo, useEffect, useRef, useState } from 'react'
import type { FC, ReactNode } from 'react'
import { CahtStyled } from './style'
import { getFriend, storageChat, getStorageChat } from '@/service/modules'
import { useNavigate } from 'react-router-dom'
import { Button } from 'antd'

import { io } from "socket.io-client";
import { SOCKET_CHAT_URL } from '@/service/config'
import { useAppSelector, useAppShallowEqual } from '@/store'

interface IPerson{
  children?: ReactNode
}
//对象的类型
interface Item{
  username: string,
  userId: string,
  img: string
}

interface userInfoType{
  username: string,
  userId: string,
  img: string
}

const Chat: FC<IPerson> = memo(() => {
  const navigate = useNavigate()
  const chartContent = useRef<HTMLDivElement>(null)
  const [ socket, setSocket ] = useState<any>()
  // 用户好友
  const [friendInfo, setFriendInfo ] = useState<Item[]>([])
  // 当前聊天的index，展示高亮
  const [ activeIndex, setActiveIndex ] = useState<number>(-1)
  

  // 纪录当前在线人的信息
  const [ onlinePerson, setOnlinePerson ] = useState<any[]>([])
  // 文本域的信息
  const [ chat, setChat ] = useState<any>('')
  // 保存当前聊天人的socketid
  const [ socketId, setSocketId ] = useState<string>('')
  // 保存聊天记录的盒子
  const [ keepMsgCon, setKeepMsgCon ] = useState<any>([])
  // 纪录是否在线
  const [ isOnline, setIsOnline ] = useState<boolean>(false)

  // 用户信息
  const { userInfo } = useAppSelector((state) =>(
    {
      userInfo: state.home.selfInfo
    }
  ), useAppShallowEqual)

    // 获取好友信息
  useEffect(()=>{
    getFriend().then(res =>{
      setFriendInfo(res.data.data);
    })
  },[])

  useEffect(()=>{
    // let res = await getFriend()

    const socketIo = io(SOCKET_CHAT_URL, {
      query: {
        userId: userInfo.userId,
        username:userInfo.username
      },
    });

    setSocket(socketIo)
    // 广播哪些用户在线
    socketIo.on('online', (data: any) =>{
      console.log('聊天用户在线', data.userList);
      // 在我接受到用户上线的时候，直接更新数据，更新是否在线
      setOnlinePerson(data.userList)
      
      // 这边有问题，多好友的时候，无法同步上线，还是需要用过点击来实现
      // 在切换应用的时候应该都在线的，不设置这个是对的，在用户刚上线和下线的时候直接渲染
      // 但是画布那边是不在线的，接受不到
      // 应该是要分消息在线和画布在线两种情况的
         
      // for (const it of friendInfo) {
      //   for (const item of data.userList) {
      //     // console.log(item);
      //     if(it.userId == item.userId){
      //       console.log('111');
            
      //       setIsOnline(true)
      //       return;
      //     }else{
      //       console.log('222');
            
      //       setIsOnline(false)
      //     }
      //   }
      // }

    })

    socketIo.on('msg', (msg:any)=>{
      console.log(msg);
      
      setKeepMsgCon((prevKeepMsgCon: any) => [...prevKeepMsgCon, msg]);
    })

    return ()=>{
      socketIo.disconnect()
    }
    // 这个socketId不能加，我们要保持socketid在对一个用户交流的时候相同
  },[userInfo.userId, friendInfo])
  
  

  useEffect(()=>{
    chatPosition()
  },[keepMsgCon])

  // 窗口始终保持在最下方
  const chatPosition = () =>{
    // 添加宏任务让其最后执行
    setTimeout(()=>{
      if(chartContent.current){
        chartContent.current.scrollTo({
          top: chartContent.current.scrollHeight,
          behavior: "smooth"
        });
      }
    },0)
  }

  // 点击好友进行聊天
  const chatToFriend = (item: Item, index: number) =>{
    setActiveIndex(index)
    // 将通过路径进入页面（后面实现）
    // navigate(`/home?sendName=${userInfo.username}&acceptName=${item.username}`)

    // 获取有关本人聊天记录来初始化存储聊天纪录的盒子
    getStorageChat(item.userId).then(res =>{
      setKeepMsgCon(res.data.data)
    })

    // 查找在线列表有没有交流好友的id，看看在不在线
    const isOnline = onlinePerson.find(it => it.userId === item.userId)
    console.log(isOnline);
    
    if(isOnline){
      
      // 在线进行socket
      // 设置好友的sockid
      setSocketId(isOnline.socketId)
      //设置在线
      setIsOnline(true)
    }else{
      // 不在线进行http
      setIsOnline(false)
      setSocketId('')
    }

    chatPosition()
   
  }

  // 点击发送：发送方的id+接受放的socketid+msg+接收方的id+时间
  const clickSend = () =>{
    if(!chat.length) return
    // 点击发送将输入框置空
    setChat('')
    let sendMsg = {
      sendId:userInfo.userId,
      acceptId:friendInfo[activeIndex].userId,
      acceptSocketId:socketId,
      message:chat,
      time: new Date().getTime()
    }

    const toMsg = [...keepMsgCon, sendMsg]
    setKeepMsgCon(toMsg)
    if(socketId){
      // 在线走socket
      socket.emit('sendMsg',sendMsg)
    }else{
      // 不在线走http
      storageChat(sendMsg)
    } 
  }


  const handleKeyDown = (e: any) =>{
    if(e.keyCode === 13){
      // 回车键禁用默认事件，执行发送的函数
      e.preventDefault()
      clickSend()
    }
  }

  // 在这里对数据进行一层过滤，然后加上class进行渲染
  const setDic = keepMsgCon.map((item: any, index: number) =>{
    // 说明我是发送方
    if( item?.sendId === userInfo?.userId && item?.acceptId === friendInfo?.[activeIndex]?.userId ){
        return (
          <div className='chat-message isSend' key={index}>     
            <div className='message-content'> { item.message } </div>
            <img src={userInfo.img} alt="" />
          </div>
        )
    }
    // 说明我是接受方
    if( item?.sendId === friendInfo?.[activeIndex]?.userId && item?.acceptId === userInfo?.userId ){
      return (
        <div className='chat-message isAccept' key={index}>
          <img src={friendInfo[activeIndex].img} alt="" />
          <div className='message-content'> { item.message } </div>
        </div>
      )
    }
  })

  return (
    <CahtStyled onKeyDown={(e)=>{handleKeyDown(e)}}>
      <div className="content">
          <div className="leftList">
            <ul>
              {
                  friendInfo.map((item, index) =>{
                    return (
                      <li key={index} onClick={()=>{chatToFriend(item, index)}} className={ activeIndex === index ? 'active': '' }>
                        <img src={item.img} alt="" />
                        <span>{ item.username }</span>
                      </li>
                    )
                  })
              }
            </ul>
          </div>
          <div className="rightChat">
              {
                activeIndex === -1 ? <div className='noChat'>点击左侧聊天</div> : (
                    <>
                      <div className="title">{ friendInfo[activeIndex].username }-{ isOnline ? '在线': '离线' }</div>
                      <div className="chatCont" ref={chartContent}>
                        <div className='chat-container'>{ setDic }</div>
                      </div>
                      <div className="sendMeg">
                        <div>
                          <textarea maxLength={200} autoFocus autoComplete='on' placeholder='快和好友聊天吧' value={chat} 
                          onChange={(e)=>{setChat(e.target.value)}}></textarea>
                        </div>
                        <Button onClick={clickSend}>发送</Button>
                      </div>
                    </>
                )
              }
          </div>
      </div>
      {/* <div className='headImg'>
        <img src={userInfo.img} alt="" />
      </div> */}
    </CahtStyled>
  )
})

export default Chat