import React from 'react'

import Button from '@mui/joy/Button'

import { signOut, useAppDispatch } from '@store'

interface IHomeProps {
  children?: React.ReactNode
}

const Home:React.FC<IHomeProps> = () => {
  const dispatch = useAppDispatch()

  return (
    <>
      <Button onClick={() => dispatch(signOut())}>
        Sign Out
      </Button>
    </>
  )
}

export default Home
