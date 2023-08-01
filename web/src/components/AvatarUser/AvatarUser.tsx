import React from 'react'

import type { OverrideProps } from '@mui/material/OverridableComponent'
import Avatar, { type AvatarTypeMap } from '@mui/joy/Avatar'
import PersonIcon from '@mui/icons-material/Person'

import { getFileURL, getInitials } from '@utils'

interface IAvatarUserProps extends OverrideProps<AvatarTypeMap, 'div'> {
  children?: React.ReactNode
  user: Models.User
}

const AvatarUser:React.FC<IAvatarUserProps> = ({ user, ...props }) => {
  return (
    <Avatar src={getFileURL(user?.avatar)} {...props}>
      {user?.name ? getInitials(user?.name) : <PersonIcon />}
    </Avatar>
  )
}

export default AvatarUser
