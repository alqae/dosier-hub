import React from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import styles from './AuthenticationLayout.module.scss'

import Grid from '@mui/joy/Grid'

import { useAuthenticated } from '@hooks/useAuthenticated'
import AuthBanner from '@assets/auth-banner.svg'
import Sheet from '@mui/joy/Sheet'

interface IAuthenticationLayoutProps {
  children?: React.ReactNode
}

const AuthenticationLayout:React.FC<IAuthenticationLayoutProps> = () => {
  const { isAuthenticated } = useAuthenticated()

  if (isAuthenticated) {
    return <Navigate to="/" />
  }

  return (
    <>
      <Grid container height="100vh">
        <Grid container sm={6} className={styles.half} alignItems="center" justifyContent="center" color="red">
          {/* <img src={Logo} alt="Logo" width="80%" /> */}
          <img src={AuthBanner} alt="Logo" />
        </Grid>

        <Grid container sm={6} alignItems="center" justifyContent="center">
          <Sheet variant="plain" sx={{ width: '75%' }} color="primary">
            <Outlet />
          </Sheet>
        </Grid>
      </Grid>
    </>
  )
}

export default AuthenticationLayout
