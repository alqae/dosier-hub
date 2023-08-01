import React from 'react'

import UserForm from '@components/UserForm'

interface IProfileProps {
  children?: React.ReactNode
}

const Profile: React.FC<IProfileProps> = () => <UserForm />

export default Profile
