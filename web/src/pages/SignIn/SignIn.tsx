import React from 'react'
import * as Yup from 'yup'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { yupResolver } from '@hookform/resolvers/yup'

import FormControl from '@mui/joy/FormControl'
import Typography from '@mui/joy/Typography'
import FormLabel from '@mui/joy/FormLabel'
import Divider from '@mui/joy/Divider'
import Button from '@mui/joy/Button'
import Input from '@mui/joy/Input'
import Stack from '@mui/joy/Stack'
import Link from '@mui/joy/Link'

import { signInSuccess, useAppDispatch } from '@store'
import { useSignInMutation } from '@services/api'

interface ISignInProps {
  children?: React.ReactNode
}

interface SignInForm {
  email: string
  password: string
}

const signInFormSchema = Yup.object().shape({
  email: Yup.string()
    .required('Email is required')
    .email('Email is invalid'),
  password: Yup.string()
    .required('Password is required')
})

const SignIn: React.FC<ISignInProps> = () => {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()

  const [signIn] = useSignInMutation()
  const { handleSubmit, register, formState: { errors, isValid } } = useForm<SignInForm>({
    defaultValues: {
      email: '',
      password: ''
    },
    mode: 'all',
    resolver: yupResolver(signInFormSchema)
  })

  const onSignIn = async (values: SignInForm) => {
    const response = await signIn(values)
    if ('error' in response) return
    dispatch(signInSuccess(response.data))
  }

  return (
    <form onSubmit={handleSubmit(onSignIn)}>
      <Stack direction="column" spacing={2}>
        <div>
          <Typography level="h4" component="h1"><b>Welcome!</b></Typography>
          <Typography level="body2">
            Hello again! Enter your data to access your account. We are delighted to have you back. Sign in and explore everything we have to offer!
          </Typography>
        </div>

        <FormControl>
          <FormLabel>Email</FormLabel>
          <Input
            type="email"
            size="lg"
            placeholder="johndoe@email.com"
            autoComplete="off"
            error={!!errors.email}
            {...register('email')}
          />

          {!!errors.email && <Typography level="body2" color="danger" alignSelf="flex-end">
            {errors.email.message}
          </Typography>}
        </FormControl>

        <FormControl>
          <FormLabel>Password</FormLabel>
          <Input
            type="password"
            size="lg"
            placeholder="password"
            autoComplete="off"
            error={!!errors.password}
            {...register('password')}
          />

          {!!errors.password && <Typography level="body2" color="danger" alignSelf="flex-end">
            {errors.password.message}
          </Typography>}
        </FormControl>

        <Divider orientation="horizontal" />
        <Button type="submit" disabled={!isValid}>Log in</Button>
        <Divider orientation="horizontal" />
        <Typography
          endDecorator={<Link onClick={() => navigate('/auth/sign-up')}>Sign up</Link>}
          fontSize="sm"
          sx={{ alignSelf: 'center' }}
        >
          Don't have an account?
        </Typography>
        <Typography
          endDecorator={<Link onClick={() => navigate('/auth/forgot-password')}>Reset here</Link>}
          fontSize="sm"
          sx={{ alignSelf: 'center' }}
        >
          Did you forget your password?
        </Typography>
      </Stack>
    </form>
  )
}

export default SignIn
