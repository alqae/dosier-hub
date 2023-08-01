import React, { useState } from 'react'

import ModalDialog from '@mui/joy/ModalDialog'
import ModalClose from '@mui/joy/ModalClose'
import Typography from '@mui/joy/Typography'
import Divider from '@mui/joy/Divider'
import Avatar from '@mui/joy/Avatar'
import Stack from '@mui/joy/Stack'
import Modal from '@mui/joy/Modal'
import Card from '@mui/joy/Card'
import Link from '@mui/joy/Link'
import Box from '@mui/joy/Box'

import { getFileURL, getInitials, modalTransitionProps, timeAgo } from '@utils'
import CommentForm, { type ICommentForm } from '../CommentForm'
import { useAuthenticated } from '@hooks/useAuthenticated'
import { useUpdateCommentMutation } from '@services/api'
import DeleteCommentModal from '../DeleteCommentModal'

interface ICommentCardProps extends Models.Comment {
  children?: React.ReactNode
  onUpdate?: () => void
  onReply?: (comment: Models.Comment) => void
  level?: number
}

const CommentCard: React.FC<ICommentCardProps> = (props) => {
  const {
    id,
    user,
    title,
    comment,
    comments = [],
    tags,
    task_id,
    created_at,
    level = 1,
    onUpdate = () => { },
    onReply = () => { },
  } = props

  const [commentToDelete, setCommentToDelete] = useState<number | undefined>(undefined)
  const [commentToEdit, setCommentToEdit] = useState<number | undefined>(undefined)
  const [updateComment] = useUpdateCommentMutation()
  const { userLogged } = useAuthenticated()
  const maxLevel = 5

  const onUpdateComment = async (values: ICommentForm) => {
    const response = await updateComment({
      id: commentToEdit as number,
      title: values.title,
      comment: values.comment,
      tags_ids: values.tags_ids ?? [],
      parent_comment_id: values.parent_comment_id,
      task_id: task_id,
    })
    if ('error' in response) return
    setCommentToEdit(undefined)
    onUpdate()
  }

  return (
    <>
      {/* DELETE - COMMENT */}
      <DeleteCommentModal
        commentId={commentToDelete}
        onClose={() => setCommentToDelete(undefined)}
        hasReplies={Boolean(comments.length)}
        onDelete={() => {
          setCommentToDelete(undefined)
          onUpdate()
        }}
      />

      {/* EDIT - COMMENT */}
      <Modal
        open={Boolean(commentToEdit)}
        onClose={() => setCommentToEdit(undefined)}
        {...modalTransitionProps} 
      >
        <ModalDialog sx={{ width: 500, overflow: 'auto' }}>
          <ModalClose variant="outlined" />
          <Typography level="h4" fontWeight="bold">
            Edit Comment
          </Typography>

          <CommentForm
            defaultValue={props}
            onSubmit={onUpdateComment}
            onCancel={() => setCommentToEdit(undefined)}
          />
        </ModalDialog>
      </Modal>

      <Card
        variant="outlined"
        sx={{ display: 'flex', spacing: 2, mb: 2, flexDirection: 'row', position: 'relative' }}
      >
        <Avatar src={getFileURL(user?.avatar)}>{getInitials(user?.name)}</Avatar>

        <Box sx={{ position: 'absolute', right: '1rem', top: '1rem' }}>
          <Typography level="body2">{timeAgo(created_at)}</Typography>
        </Box>

        <div>
          <Typography display="block" fontWeight="bold" level="body2" textColor="text.tertiary">{user?.name}</Typography>
          <Typography display="block" level="body1" fontWeight="bold">{title}</Typography>
          <Typography level="body2">{comment}</Typography>
          {Boolean(tags?.length) && (
            <Stack spacing={1} direction="row" mt={1}>
              {tags?.map((tag) => (
                <Typography key={tag.id} variant="outlined" display="inline-block" fontSize="small" color="neutral">{tag.name}</Typography>
              ))}
            </Stack>
          )}
          <Stack spacing={1} mt={1} direction="row">
            {!(level >= maxLevel) && (
              <>
                <Link onClick={() => onReply(props)}>Reply</Link>
                <Divider orientation="vertical" />
              </>
            )}
            <Link onClick={() => setCommentToEdit(id)}>Edit</Link>
            {userLogged?.is_admin && (
              <>
                <Divider orientation="vertical" />
                <Link onClick={() => setCommentToDelete(id)}>Delete</Link>
              </>
            )}
          </Stack>
        </div>
      </Card>

      {Boolean(comments.length) && (
        <Box pl={4}>
          {comments.map((nestedComment) => (
            <CommentCard
              onReply={onReply}
              onUpdate={onUpdate}
              key={nestedComment.id}
              level={level + 1}
              {...nestedComment}
            />
          ))}
        </Box>
      )}
    </>
  )
}

export default CommentCard
