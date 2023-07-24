import React from 'react'
import { Outlet } from 'react-router-dom'

interface ILayoutProps {
  children?: React.ReactNode
}

const Layout:React.FC<ILayoutProps> = () => {
  return (
    <main>
      <Outlet />
    </main>
  )
}

export default Layout
