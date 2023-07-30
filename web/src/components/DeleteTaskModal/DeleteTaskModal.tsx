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
  hasSubtasks?: boolean
  taskId?: number
}

const DeleteTaskModal: React.FC<IDeleteTaskModalProps> = ({
  taskId,
  onClose,
  hasSubtasks = false,
  onDelete = () => { },
}) => {
  const [deleteTask] = useDeleteTaskMutation()

  const onDeleteTask = async () => {
    const response = await deleteTask(taskId as number)
    if ('error' in response) return
    toast.success('Task deleted successfully')
    onClose()
    onDelete()
  }

  return (
    <Modal open={Boolean(taskId)} onClose={onClose}>
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
          Are you sure you want to delete this task?<br />
          {hasSubtasks && (
            <>
              <Typography display="inline-block" mt={2} component="b" fontWeight="bold">NOTE: </Typography>
              &nbsp;This task has <Typography display="inline-block" component="b" fontWeight="bold">subtasks</Typography> and will be deleted too
            </>
          )}
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
