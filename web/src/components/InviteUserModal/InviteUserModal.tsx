import React from 'react'
import { yupResolver } from '@hookform/resolvers/yup'
import { useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import * as Yup from 'yup'

import ModalDialog from '@mui/joy/ModalDialog'
import FormControl from '@mui/joy/FormControl'
import Typography from '@mui/joy/Typography'
import FormLabel from '@mui/joy/FormLabel'
import Button from '@mui/joy/Button'
import Modal from '@mui/joy/Modal'
import Stack from '@mui/joy/Stack'
import Input from '@mui/joy/Input'

import { useInviteUserMutation } from '@services/api'
import { modalTransitionProps } from '@utils'

interface IInviteUserModalProps {
  children?: React.ReactNode
  open: boolean
  onClose: () => void
}

interface InviteUserForm {
  email: string
}

const inviteUserFormSchema = Yup.object().shape({
  email: Yup.string()
    .required('Email is required')
    .email('Email is invalid'),
})

const InviteUserModal:React.FC<IInviteUserModalProps> = ({
  open,
  onClose,
}) => {
  const [inviteUser] = useInviteUserMutation()

  const { handleSubmit, register, reset, formState: { errors } } = useForm<InviteUserForm>({
    defaultValues: {
      email: '',
    },
    resolver: yupResolver(inviteUserFormSchema)
  })

  const onInvite = async (values: InviteUserForm) => {
    const response = await inviteUser(values)
    reset()
    if ('error' in response) return
    toast.success('User invited successfully')
    onClose()
  }

  return (
    <Modal open={open} onClose={onClose} {...modalTransitionProps}>
    <ModalDialog component="form" onSubmit={handleSubmit(onInvite)} variant="outlined">
      <Typography level="h4" fontWeight="bold">Invite User</Typography>
      <Typography level="body2" mb={2}>
        Please enter the email address of the user you want to invite.
      </Typography>

      <Stack spacing={2}>
        <FormControl>
          <FormLabel>Email</FormLabel>
          <Input
            type="email"
            error={!!errors.email}
            placeholder="john@doe.com"
            {...register('email')}
          />
          {!!errors.email && (
            <Typography level="body2" color="danger">
              {errors.email.message}
            </Typography>
          )}
        </FormControl>

        <Button type="submit">Invite User</Button>
        <Button
          color="neutral"
          variant="outlined"
          onClick={onClose}
        >
          Cancel
        </Button>
      </Stack>
    </ModalDialog>
  </Modal>
  )
}

export default InviteUserModal
