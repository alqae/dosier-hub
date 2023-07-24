import React from 'react'
import * as Yup from 'yup'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { useNavigate, useSearchParams } from 'react-router-dom'

import FormControl from '@mui/joy/FormControl'
import Typography from '@mui/joy/Typography'
import FormLabel from '@mui/joy/FormLabel'
import Divider from '@mui/joy/Divider'
import Button from '@mui/joy/Button'
import Input from '@mui/joy/Input'
import Stack from '@mui/joy/Stack'
import Link from '@mui/joy/Link'

import { useForgotPasswordMutation, useResetPasswordMutation } from '@services/api'

interface IForgotPasswordProps {
  children?: React.ReactNode
}

interface ForgotPasswordForm {
  email: string
}

interface ResetPasswordForm {
  password: string
  confirmPassword: string
}

const forgotPasswordFormSchema = Yup.object().shape({
  email: Yup.string()
    .required('Email is required')
    .email('Email is invalid'),
})

const resetPasswordFormSchema = Yup.object().shape({
  password: Yup.string()
    .required('Password is required'),
  confirmPassword: Yup.string()
    .required('Confirm password is required')
    .oneOf([Yup.ref('password')], 'Passwords must match')
})

const ForgotPassword: React.FC<IForgotPasswordProps> = () => {
  const navigate = useNavigate()
  const [forgotPassword] = useForgotPasswordMutation()
  const forgotPasswordForm = useForm<ForgotPasswordForm>({
    defaultValues: {
      email: '',
    },
    mode: 'all',
    resolver: yupResolver(forgotPasswordFormSchema)
  })

  const onForgotPassword = async (values: ForgotPasswordForm) => {
    const response = await forgotPassword(values)
    if ('error' in response) return
    return navigate('/auth/sign-in')
  }

  const [resetPassword] = useResetPasswordMutation()
  const [searchParams] = useSearchParams()
  const token = searchParams.get('token')
  const resetPasswordForm = useForm<ResetPasswordForm>({
    defaultValues: {
      password: '',
      confirmPassword: ''
    },
    mode: 'all',
    resolver: yupResolver(resetPasswordFormSchema)
  })

  const onResetPassword = async (values: ResetPasswordForm) => {
    if (!token) return
    const response = await resetPassword({ password: values.password, token })
    console.warn(response);
    if ('error' in response) return
    return navigate('/auth/sign-in')
  }

  if (token) {
    return (
      <form onSubmit={resetPasswordForm.handleSubmit(onResetPassword)}>
        <Stack direction="column" spacing={2}>
          <div>
            <Typography level="h4" component="h1"><b>Reset your password</b></Typography>
            <Typography level="body2">
              Enter your new password and confirm it to reset your password.
            </Typography>
          </div>

          <FormControl>
            <FormLabel>Password</FormLabel>
            <Input
              type="password"
              size="lg"
              placeholder="********"
              autoComplete="off"
              error={!!resetPasswordForm.formState.errors.password}
              {...resetPasswordForm.register('password')}
            />

            {!!resetPasswordForm.formState.errors.password && <Typography level="body2" color="danger" alignSelf="flex-end">
              {resetPasswordForm.formState.errors.password.message}
            </Typography>}
          </FormControl>

          <FormControl>
            <FormLabel>Confirm password</FormLabel>
            <Input
              type="password"
              size="lg"
              placeholder="********"
              autoComplete="off"
              error={!!resetPasswordForm.formState.errors.confirmPassword}
              {...resetPasswordForm.register('confirmPassword')}
            />

            {!!resetPasswordForm.formState.errors.confirmPassword && <Typography level="body2" color="danger" alignSelf="flex-end">
              {resetPasswordForm.formState.errors.confirmPassword.message}
            </Typography>}
          </FormControl>

          <Divider orientation="horizontal" />
          <Button type="submit" disabled={!resetPasswordForm.formState.isValid}>Reset</Button>
          <Divider orientation="horizontal" />
          <Typography
            endDecorator={<Link onClick={() => navigate('/auth/sign-in')}>Sign In</Link>}
            fontSize="sm"
            sx={{ alignSelf: 'center' }}
          >
            Already have an account?
          </Typography>
          <Typography
            endDecorator={<Link onClick={() => navigate('/auth/sign-up')}>Sign up</Link>}
            fontSize="sm"
            sx={{ alignSelf: 'center' }}
          >
            Don't have an account?
          </Typography>
        </Stack>
      </form>
    )
  }

  return (
    <form onSubmit={forgotPasswordForm.handleSubmit(onForgotPassword)}>
      <Stack direction="column" spacing={2}>
        <div>
          <Typography level="h4" component="h1"><b>Forgot your password?</b></Typography>
          <Typography level="body2">
            Ohh no! Did you forget your password? Don't worry, it happens to the best of us. Enter your email and we will send you a link to reset your password.
          </Typography>
        </div>

        <FormControl>
          <FormLabel>Email</FormLabel>
          <Input
            type="email"
            size="lg"
            placeholder="johndoe@email.com"
            autoComplete="off"
            error={!!forgotPasswordForm.formState.errors.email}
            {...forgotPasswordForm.register('email')}
          />

          {!!forgotPasswordForm.formState.errors.email && <Typography level="body2" color="danger" alignSelf="flex-end">
            {forgotPasswordForm.formState.errors.email.message}
          </Typography>}
        </FormControl>

        <Divider orientation="horizontal" />
        <Button type="submit" disabled={!forgotPasswordForm.formState.isValid}>Reset</Button>
        <Divider orientation="horizontal" />
        <Typography
          endDecorator={<Link onClick={() => navigate('/auth/sign-in')}>Sign In</Link>}
          fontSize="sm"
          sx={{ alignSelf: 'center' }}
        >
          Already have an account?
        </Typography>
        <Typography
          endDecorator={<Link onClick={() => navigate('/auth/sign-up')}>Sign up</Link>}
          fontSize="sm"
          sx={{ alignSelf: 'center' }}
        >
          Don't have an account?
        </Typography>
      </Stack>
    </form>
  )
}

export default ForgotPassword
