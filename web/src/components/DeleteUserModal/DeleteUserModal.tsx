import React from 'react'
import { toast } from 'react-toastify'

import WarningRoundedIcon from '@mui/icons-material/WarningRounded'
import ModalDialog from '@mui/joy/ModalDialog'
import Typography from '@mui/joy/Typography'
import Divider from '@mui/joy/Divider'
import Button from '@mui/joy/Button'
import Modal from '@mui/joy/Modal'
import Box from '@mui/joy/Box'

import { useDeleteUserMutation } from '@services/api'

interface IDeleteUserModalProps {
  children?: React.ReactNode
  onDelete: () => void
  onClose: () => void
  user: Models.User | undefined
}

const DeleteUserModal:React.FC<IDeleteUserModalProps> = ({
  user,
  onDelete,
  onClose,
}) => {
  const [deleteUser] = useDeleteUserMutation()

  const onDeleteUser = async () => {
    const response = await deleteUser(user?.id as number)
    if ('error' in response) return
    toast.success('User deleted successfully')
    onClose()
    onDelete()
  }

  return (
    <Modal open={Boolean(user)} onClose={onClose}>
      <ModalDialog variant="outlined"  sx={{ width: 400 }}>
        <Typography
          pb={2}
          component="h2"
          startDecorator={<WarningRoundedIcon />}
        >
          Confirm
        </Typography>
        <Divider />
        <Typography textColor="text.tertiary" pt={2}>
          Are you sure you want to delete <Typography component="b" fontWeight="bold">{user?.name ?? 'Unknown'}</Typography>?
        </Typography>
        <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end', pt: 2 }}>
          <Button variant="plain" color="neutral" onClick={() => onClose()}>
            Cancel
          </Button>
          <Button variant="solid" color="danger" onClick={() => {
            onDeleteUser()
            onClose()
          }}>
            Ok
          </Button>
        </Box>
      </ModalDialog>
    </Modal>
  )
}

export default DeleteUserModal
