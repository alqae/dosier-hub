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
import { modalTransitionProps } from '@utils'

interface IDeleteProjectModalProps {
  children?: React.ReactNode
  onClose: () => void
  onDelete?: () => void
  hasTasks?: boolean
  projectId?: number
}

const DeleteProjectModal: React.FC<IDeleteProjectModalProps> = ({
  projectId,
  onClose,
  hasTasks = false,
  onDelete = () => { },
}) => {
  const [deleteProject] = useDeleteProjectMutation()

  const onDeleteProject = async (projectId: number) => {
    const response = await deleteProject(projectId)
    if ('error' in response) return
    toast.success('Project deleted successfully')
    onDelete()
  }

  return (
    <Modal
      onClose={onClose}
      open={Boolean(projectId)}
      {...modalTransitionProps}
    >
      <ModalDialog variant="outlined" sx={{ width: 400 }}>
        <Typography
          pb={2}
          component="h2"
          startDecorator={<WarningRoundedIcon />}
        >
          Confirm
        </Typography>
        <Divider />
        <Typography textColor="text.tertiary" pt={2}>
          Are you sure you want to delete this project?<br />
          {hasTasks && (
            <>
              <Typography display="inline-block" mt={2} component="b" fontWeight="bold">NOTE: </Typography>
              &nbsp;This project has <Typography display="inline-block" component="b" fontWeight="bold">tasks</Typography> and will be deleted too
            </>
          )}
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
