import React from 'react'
import { toast } from 'react-toastify'

import WarningRoundedIcon from '@mui/icons-material/WarningRounded'
import ModalDialog from '@mui/joy/ModalDialog'
import Typography from '@mui/joy/Typography'
import Divider from '@mui/joy/Divider'
import Button from '@mui/joy/Button'
import Modal from '@mui/joy/Modal'
import Box from '@mui/joy/Box'

import { useDeleteTaskMutation } from '@services/api'

interface IDeleteTaskModalProps {
  children?: React.ReactNode
  onClose: () => void
  onDelete?: () => void
  taskId?: number
}

const DeleteTaskModal: React.FC<IDeleteTaskModalProps> = ({
  taskId,
  onClose,
  onDelete,
}) => {
  const [deleteTask] = useDeleteTaskMutation()

  const onDeleteTask = async () => {
    const response = await deleteTask(taskId as number)
    if ('error' in response) return
    toast.success('Task deleted successfully')
    onClose()
    onDelete?.()
  }

  return (
    <Modal open={Boolean(taskId)} onClose={onClose}>
      <ModalDialog variant="outlined" >
        <Typography
          id="alert-dialog-modal-title"
          component="h2"
          startDecorator={<WarningRoundedIcon />}
        >
          Confirm
        </Typography>
        <Divider />
        <Typography id="alert-dialog-modal-description" textColor="text.tertiary">
          Are you sure you want to delete this task?
        </Typography>
        <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end', pt: 2 }}>
          <Button variant="plain" color="neutral" onClick={() => onClose()}>
            Cancel
          </Button>
          <Button variant="solid" color="danger" onClick={() => {
            onDeleteTask()
            onClose()
          }}>
            Ok
          </Button>
        </Box>
      </ModalDialog>
    </Modal>
  )
}

export default DeleteTaskModal
