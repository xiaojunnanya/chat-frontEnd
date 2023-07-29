import React, { memo } from 'react'
import type { FC, ReactNode } from 'react'

interface IPerson{
  children?: ReactNode
}

const Friend: FC<IPerson> = memo(() => {
  return (
    <div>
      <div>功能：有加好友，加群聊</div>
      <div>哪些好友（要不要设计点击料头直接进去和其聊天，感觉要涉及到路由的那个想法）</div>
      <div>加入的群聊</div>
    </div>
  )
})

export default Friend