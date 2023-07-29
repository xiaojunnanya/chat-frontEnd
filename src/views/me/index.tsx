import React, { memo } from 'react'
import type { FC, ReactNode } from 'react'

interface IPerson{
  children?: ReactNode
}

const Me: FC<IPerson> = memo(() => {
  return (
    <div>
      <div>修改账户密码</div>
      <div>更改头像</div>
    </div>
  )
})

export default Me