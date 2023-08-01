import React, { useEffect, useMemo } from 'react'
import { yupResolver } from '@hookform/resolvers/yup'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import { motion } from 'framer-motion'
import * as Yup from 'yup'

import LinearProgress from '@mui/joy/LinearProgress'
import FormControl from '@mui/joy/FormControl'
import AspectRatio from '@mui/joy/AspectRatio'
import Typography from '@mui/joy/Typography'
import FormLabel from '@mui/joy/FormLabel'
import Divider from '@mui/joy/Divider'
import Button from '@mui/joy/Button'
import Input from '@mui/joy/Input'
import Stack from '@mui/joy/Stack'
import Grid from '@mui/joy/Grid'
import Box from '@mui/joy/Box'

import { uploadAvatarUser, useAppDispatch } from '@store'
import AvatarPicker from '@components/AvatarPicker'
import NotFound from '@assets/not-found.png'
import {
  useLazyGetUserLoggedQuery,
  useUpdatePasswordMutation,
  useUpdateProfileMutation,
  useLazyGetUserQuery,
} from '@services/api'

interface IUserFormProps {
  children?: React.ReactNode
  userId?: number
}

interface UpdateProfileForm {
  name: string
  email: string
}

interface UpdatePasswordForm {
  password: string
  password_confirmation: string
}

const updateProfileFormSchema = Yup.object().shape({
  name: Yup.string().required('Name is required'),
  email: Yup.string().email('Invalid email').required('Email is required')
})

const updatePasswordFormSchema = Yup.object().shape({
  password: Yup.string().required('Password is required'),
  password_confirmation: Yup.string()
    .required('Password confirmation is required')
    .oneOf([Yup.ref('password')], 'Passwords must match')
})

const UserForm: React.FC<IUserFormProps> = ({ userId }) => {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const [triggerUserLogged, { data: userLogged, isLoading }] = useLazyGetUserLoggedQuery()
  const [trigger, { data: userLoaded, isLoading: isLoadingUser }] = useLazyGetUserQuery()
  const [updateProfile, { isLoading: isLoadingUpdateProfile }] = useUpdateProfileMutation()
  const [updatePassword, { isLoading: isLoadingUpdatePassword }] = useUpdatePasswordMutation()
  const updatePasswordForm = useForm<UpdatePasswordForm>({
    defaultValues: {
      password: '',
      password_confirmation: ''
    },
    resolver: yupResolver(updatePasswordFormSchema)
  })

  const updateProfileForm = useForm<UpdateProfileForm>({
    defaultValues: {
      name: '',
      email: ''
    },
    resolver: yupResolver(updateProfileFormSchema)
  })

  const user = useMemo(() => {
    if (userId) {
      return userLoaded
    }

    return userLogged
  }, [userId, userLoaded, userLogged])

  useEffect(() => {
    refetch()
  }, [userId])

  const refetch = () => {
    if (userId) {
      trigger(userId)
    } else {
      triggerUserLogged()
    }
  }

  const onUpdateAvatar = async (file: File) => {
    dispatch(uploadAvatarUser([userLoaded?.id, file]))
  }

  const onUpdateProfile = async (values: UpdateProfileForm) => {
    const response = await updateProfile({ ...values, userId: user?.id as number })
    if ('error' in response) return
    toast.success('Profile updated successfully')
    refetch()
  }

  const onUpdatePassword = async (values: UpdatePasswordForm) => {
    const response = await updatePassword({ ...values, userId: user?.id as number })
    if ('error' in response) return
    toast.success('Password updated successfully')
    updatePasswordForm.reset()
  }

  useEffect(() => {
    if (user) {
      updateProfileForm.setValue('name', user.name)
      updateProfileForm.setValue('email', user.email)
    }
  }, [user])

  
  if (!isLoading && !isLoadingUser && userId && !userLoaded) {
    return (
      <AspectRatio variant="plain">
        <Stack spacing={2}>
          <Typography level="h1">Oops!</Typography>
          <Typography level="body2" mb={2}>we couldn't find the user</Typography>
          <div>
            <img src={NotFound} alt="not found" width={300} height="auto" />
          </div>
          <Button sx={{ borderRadius: 'xl' }} onClick={() => navigate('/users')}>
            Back to users
          </Button>
        </Stack>
      </AspectRatio>
    )
  }

  return (
    <>
      {(
        isLoading ||
        isLoadingUser ||
        isLoadingUpdateProfile ||
        isLoadingUpdatePassword
      ) && <LinearProgress />}

      <Typography
        component={motion.div}
        initial={{ opacity: 0, y: '-100%' }}
        transition={{ duration: 0.75 }}
        animate={{ opacity: 1, y: 0 }}
        level="h2"
        mb={3}
      >
        {Boolean(userLogged) ? 'Edit Profile' : (user?.name ?? `Unknown (${user?.id})`)}
      </Typography>

      <Grid container spacing={2}>
        <Grid
          xs={8}
          component={motion.div}
          initial={{ opacity: 0, x: '-100%' }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.75 }}
          viewport={{ once: true }}
        >
          <Typography level="h4" mb={2}>Personal Information</Typography>
          <form onSubmit={updateProfileForm.handleSubmit(onUpdateProfile)}>
            <Grid container spacing={2}>
              <Grid xs={6}>
                <FormControl>
                  <FormLabel>Name</FormLabel>
                  <Input
                    type="text"
                    autoComplete="off"
                    placeholder="John Doe"
                    error={!!updateProfileForm.formState.errors.name}
                    {...updateProfileForm.register('name')}
                  />

                  {!!updateProfileForm.formState.errors.name && <Typography level="body2" color="danger" alignSelf="flex-end">
                    {updateProfileForm.formState.errors.name.message}
                  </Typography>}
                </FormControl>
              </Grid>

              <Grid xs={6}>
                <FormControl>
                  <FormLabel>Email</FormLabel>
                  <Input
                    type="email"
                    autoComplete="off"
                    placeholder="johndoe@email.com"
                    error={!!updateProfileForm.formState.errors.email}
                    {...updateProfileForm.register('email')}
                  />

                  {!!updateProfileForm.formState.errors.email && <Typography level="body2" color="danger" alignSelf="flex-end">
                    {updateProfileForm.formState.errors.email.message}
                  </Typography>}
                </FormControl>
              </Grid>

              <Grid xs={12}>
                <Button type="submit" color="primary" variant="outlined" size="lg">
                  Update Profile
                </Button>
              </Grid>
            </Grid>
          </form>

          <Divider sx={{ my: 3 }} />

          <Typography level="h3" mb={2}>Change Password</Typography>
          <form onSubmit={updatePasswordForm.handleSubmit(onUpdatePassword)}>
            <Grid container spacing={2}>
              <Grid xs={6}>
                <FormControl>
                  <FormLabel>Password</FormLabel>
                  <Input
                    type="password"
                    autoComplete="off"
                    placeholder="********"
                    error={!!updatePasswordForm.formState.errors.password}
                    {...updatePasswordForm.register('password')}
                  />

                  {!!updatePasswordForm.formState.errors.password && <Typography level="body2" color="danger" alignSelf="flex-end">
                    {updatePasswordForm.formState.errors.password.message}
                  </Typography>}
                </FormControl>
              </Grid>

              <Grid xs={6}>
                <FormControl>
                  <FormLabel>Confirm Password</FormLabel>
                  <Input
                    type="password"
                    autoComplete="off"
                    placeholder="********"
                    error={!!updatePasswordForm.formState.errors.password_confirmation}
                    {...updatePasswordForm.register('password_confirmation')}
                  />

                  {!!updatePasswordForm.formState.errors.password_confirmation && <Typography level="body2" color="danger" alignSelf="flex-end">
                    {updatePasswordForm.formState.errors.password_confirmation.message}
                  </Typography>}
                </FormControl>
              </Grid>

              <Grid xs={12}>
                <Button type="submit" variant="outlined" color="primary" size="lg">
                  Change Password
                </Button>
              </Grid>
            </Grid>
          </form>
        </Grid>

        <Grid
          xs={4}
          display="flex"
          justifyContent="end"
          component={motion.div}
          viewport={{ once: true }}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.75 }}
        >
          <Box width={300} height={300}>
            <AvatarPicker onChange={onUpdateAvatar} defaultValue={user?.avatar} />
          </Box>
        </Grid>
      </Grid>
    </>
  )
}

export default UserForm
