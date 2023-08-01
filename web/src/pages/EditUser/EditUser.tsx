import React from 'react'
import { useNavigate, useParams } from 'react-router-dom'

import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import Button from '@mui/joy/Button'

import UserForm from '@components/UserForm'

interface IEditUserProps {
  children?: React.ReactNode
}

const EditUser: React.FC<IEditUserProps> = () => {
  const { userId } = useParams()
  const navigate = useNavigate()

  return (
    <>
      <Button
        variant="plain"
        startDecorator={<ArrowBackIcon />}
        onClick={() => navigate('/users')}
      >
        Go Back
      </Button>

      <UserForm userId={userId ? Number(userId) : undefined} />
    </>
  )
}

export default EditUser
