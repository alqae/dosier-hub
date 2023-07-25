import React from 'react'
import { toast } from 'react-toastify'

import WarningRoundedIcon from '@mui/icons-material/WarningRounded'
import ModalDialog from '@mui/joy/ModalDialog'
import Typography from '@mui/joy/Typography'
import Divider from '@mui/joy/Divider'
import Button from '@mui/joy/Button'
import Modal from '@mui/joy/Modal'
import Box from '@mui/joy/Box'

import { useDeleteProjectMutation } from '@services/api'

interface IDeleteProjectModalProps {
  children?: React.ReactNode
  onClose: () => void
  onDelete?: () => void
  projectId?: number
}

const DeleteProjectModal:React.FC<IDeleteProjectModalProps> = ({
  projectId,
  onClose,
  onDelete
}) => {
  const [deleteProject] = useDeleteProjectMutation()

  const onDeleteProject = async (projectId: number) => {
    const response = await deleteProject(projectId)
    if ('error' in response) return
    if (onDelete) onDelete()
    toast.success('Project deleted successfully')
  }

  return (
    <Modal open={Boolean(projectId)} onClose={() => onClose()}>
        <ModalDialog
          variant="outlined"
          role="alertdialog"
          aria-labelledby="alert-dialog-modal-title"
          aria-describedby="alert-dialog-modal-description"
        >
          <Typography
            id="alert-dialog-modal-title"
            component="h2"
            startDecorator={<WarningRoundedIcon />}
          >
            Confirm
          </Typography>
          <Divider />
          <Typography id="alert-dialog-modal-description" textColor="text.tertiary">
            Are you sure you want to delete this project?
          </Typography>
          <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end', pt: 2 }}>
            <Button variant="plain" color="neutral" onClick={() => onClose()}>
              Cancel
            </Button>
            <Button variant="solid" color="danger" onClick={() => {
              onDeleteProject(projectId as number)
              onClose()
            }}>
              Ok
            </Button>
          </Box>
        </ModalDialog>
      </Modal>
  )
}

export default DeleteProjectModal
