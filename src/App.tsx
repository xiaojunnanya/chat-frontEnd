import React, { memo } from 'react'
import type { FC, ReactNode } from 'react'
import routes from './router'
import { useRoutes } from 'react-router-dom'

interface IPerson{
  children?: ReactNode
}

const App: FC<IPerson> = memo(() => {
  return (
    <div>
        {
          useRoutes(routes)
        }
    </div>
  )
})

export default App