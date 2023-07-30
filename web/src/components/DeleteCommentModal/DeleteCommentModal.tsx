import React from 'react'
import { toast } from 'react-toastify'

import WarningRoundedIcon from '@mui/icons-material/WarningRounded'
import ModalDialog from '@mui/joy/ModalDialog'
import Typography from '@mui/joy/Typography'
import Divider from '@mui/joy/Divider'
import Button from '@mui/joy/Button'
import Modal from '@mui/joy/Modal'
import Box from '@mui/joy/Box'

import { useDeleteCommentMutation } from '@services/api'

interface IDeleteCommentModalProps {
  children?: React.ReactNode
  onClose: () => void
  onDelete?: () => void
  commentId?: number
  hasReplies?: boolean
}

const DeleteCommentModal: React.FC<IDeleteCommentModalProps> = ({
  commentId,
  onClose,
  hasReplies = false,
  onDelete = () => { },
}) => {
  const [deleteComment] = useDeleteCommentMutation()

  const onDeleteComment = async () => {
    const response = await deleteComment(commentId as number)
    if ('error' in response) return
    toast.success('Comment deleted successfully')
    onClose()
    onDelete()
  }

  return (
    <Modal open={Boolean(commentId)} onClose={onClose}>
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
          Are you sure you want to delete this comment?<br />
          {hasReplies && (
            <>
              <Typography display="inline-block" mt={2} component="b" fontWeight="bold">NOTE: </Typography>
              &nbsp;This comment has <Typography display="inline-block" component="b" fontWeight="bold">replies</Typography> and will be deleted too
            </>
          )}
        </Typography>
        <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end', pt: 2 }}>
          <Button variant="plain" color="neutral" onClick={() => onClose()}>
            Cancel
          </Button>
          <Button variant="solid" color="danger" onClick={() => {
            onDeleteComment()
            onClose()
          }}>
            Ok
          </Button>
        </Box>
      </ModalDialog>
    </Modal>
  )
}

export default DeleteCommentModal
