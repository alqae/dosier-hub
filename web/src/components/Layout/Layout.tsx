import React from 'react'
import { Outlet } from 'react-router-dom'

import { useAuthenticated } from '@hooks/useAuthenticated'
import Navbar from '../Navbar'
import Footer from '../Footer'

interface ILayoutProps {
  children?: React.ReactNode
}

const Layout:React.FC<ILayoutProps> = () => {
  const { isAuthenticated } = useAuthenticated()
  return (
    <>
      {isAuthenticated && <Navbar />}
      <main>
        <Outlet />
      </main>
      {isAuthenticated && <Footer />}
    </>
  )
}

export default Layout
