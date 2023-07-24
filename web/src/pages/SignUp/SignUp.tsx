import React from 'react'
import * as Yup from 'yup'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { useFilePicker } from 'use-file-picker'
import { yupResolver } from '@hookform/resolvers/yup'

import ImageIcon from '@mui/icons-material/Image'
import EditIcon from '@mui/icons-material/Edit'
import FormControl from '@mui/joy/FormControl'
import AddIcon from '@mui/icons-material/Add'
import Typography from '@mui/joy/Typography'
import IconButton from '@mui/joy/IconButton'
import FormLabel from '@mui/joy/FormLabel'
import Divider from '@mui/joy/Divider'
import Tooltip from '@mui/joy/Tooltip'
import Button from '@mui/joy/Button'
import Avatar from '@mui/joy/Avatar'
import Badge from '@mui/joy/Badge'
import Input from '@mui/joy/Input'
import Stack from '@mui/joy/Stack'
import Link from '@mui/joy/Link'
import Grid from '@mui/joy/Grid'

import { useAppDispatch, signInSuccess, uploadAvatar } from '@store'
import { useSignUpMutation } from '@services/api'

interface ISignUpProps {
  children?: React.ReactNode
}

interface SignUpForm {
  name: string
  email: string
  password: string
}

const signUpFormSchema = Yup.object().shape({
  name: Yup.string()
    .required('Name is required'),
  email: Yup.string()
    .required('Email is required')
    .email('Email is invalid'),
  password: Yup.string()
    .required('Password is required')
})

const SignUp: React.FC<ISignUpProps> = () => {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const [signUp] = useSignUpMutation()

  const [openFileSelector, { plainFiles, filesContent }] = useFilePicker({
    readAs: 'DataURL',
    accept: 'image/*',
    multiple: true,
    limitFilesConfig: { max: 1 },
    maxFileSize: 50,
  })
  const { handleSubmit, register, formState: { errors, isValid } } = useForm<SignUpForm>({
    defaultValues: {
      name: '',
      email: '',
      password: ''
    },
    mode: 'all',
    resolver: yupResolver(signUpFormSchema)
  })

  const onSignUp = async (values: SignUpForm) => {
    const avatar = plainFiles.length > 0 ? plainFiles[0] : undefined
    const response = await signUp(values)
    if ('error' in response) return
    dispatch(signInSuccess(response.data))
    if (avatar) {
      dispatch(uploadAvatar(plainFiles[0]))
    }
  }

  return (
    <form onSubmit={handleSubmit(onSignUp)}>
      <Stack direction="column" spacing={2}>
        <div>
          <Typography level="h4" component="h1"><b>Welcome!</b></Typography>
          <Typography level="body2">Welcome to <b>Dosier-hub</b>! Register now and join our community. Complete the form to start enjoying all our services. It's easy and fast!</Typography>
        </div>

        <Grid container direction="row-reverse">
          <Grid xs={12} sm={6} md={4} container alignItems="center" justifyContent="center">
            <Tooltip title="Add your avatar" variant="outlined">
              <Badge
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                variant="plain"
                badgeContent={
                  <IconButton
                    onClick={() => openFileSelector()}
                    size="sm"
                    color="primary"
                    sx={{ padding: 0 }}
                  >
                    {filesContent.length > 0 ? <EditIcon /> : <AddIcon />}
                  </IconButton>
                }
                badgeInset="14%"
                sx={{ '--Badge-paddingX': '0px' }}
              >
                <Avatar
                  src={filesContent.length > 0 ? filesContent[0].content : undefined}
                  variant="outlined"
                  sx={{ width: 150, height: 150, cursor: 'pointer' }}
                  onClick={() => openFileSelector()}
                >
                  <ImageIcon sx={{ color: 'text.tertiary', fontSize: '3rem' }} />
                </Avatar>
              </Badge>
            </Tooltip>
          </Grid>

          <Grid xs={12} sm={6} md={8} container gap={2} direction="column">
            <FormControl>
              <FormLabel>Name</FormLabel>
              <Input
                type="text"
                size="lg"
                placeholder="John Doe"
                autoComplete="off"
                error={!!errors.name}
                {...register('name')}
              />

              {!!errors.name && <Typography level="body2" color="danger" alignSelf="flex-end">
                {errors.name.message}
              </Typography>}
            </FormControl>

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
          </Grid>
        </Grid>

        <Divider orientation="horizontal" />
        <Button type="submit" disabled={!isValid}>Sign Up</Button>
        <Typography
          endDecorator={<Link onClick={() => navigate('/auth/sign-in')}>Sign In</Link>}
          fontSize="sm"
          sx={{ alignSelf: 'center' }}
        >
          Already have an account?
        </Typography>
      </Stack>
    </form>
  )
}

export default SignUp
