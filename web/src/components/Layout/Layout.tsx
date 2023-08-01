import React from 'react'
import { Outlet, useLocation } from 'react-router-dom'

import Box from '@mui/joy/Box'

import { useAuthenticated } from '@hooks/useAuthenticated'
import Footer from '../Footer'
import Navbar from '../Navbar'

interface ILayoutProps {
  children?: React.ReactNode
}

const Layout:React.FC<ILayoutProps> = () => {
  const location = useLocation()
  const isLogin = location.pathname.includes('auth')

  const { isAuthenticated } = useAuthenticated()

  return (
    <>
      {isAuthenticated && <Navbar />}
      <Box
        component="main"
        sx={{ py: isLogin ? 0 : 4 }}
        className={isLogin ? '' : 'container'}
      >
        <Outlet />
      </Box>
      {isAuthenticated && <Footer />}
    </>
  )
}

export default Layout
