import React, { useMemo, useRef, useState } from 'react'

import Typography from '@mui/joy/Typography'
import Link from '@mui/joy/Link'
import Box from '@mui/joy/Box'

import CommentForm, { type ICommentForm } from '../CommentForm'
import { useCreateCommentMutation } from '@services/api'
import CommentCard from '../CommentCard'

interface ICommentsSectionProps {
  children?: React.ReactNode
  comments: Models.Comment[]
  taskId: Models.Comment['id']
  onUpdated?: () => void
}

const CommentsSection: React.FC<ICommentsSectionProps> = ({
  taskId,
  comments: taskComments = [],
  onUpdated = () => { },
}) => {
  const [commentToReply, setCommentToReply] = useState<Models.Comment | undefined>()
  const [commentsToShow, setCommentsToShow] = useState<number>(3)
  const commentFormContainer = useRef<HTMLDivElement>(null)
  const [createComment] = useCreateCommentMutation()

  const onCreateComment = async (values: ICommentForm) => {
    const response = await createComment({
      task_id: taskId,
      title: values.title,
      comment: values.comment,
      tags_ids: values.tags_ids ?? [],
      parent_comment_id: values.parent_comment_id,
    })
    if ('error' in response) return
    onUpdated()
    if (commentToReply) setCommentToReply(undefined)
  }

  const comments = useMemo(
    () => taskComments.slice(0, commentsToShow),
    [taskComments, commentsToShow]
  )
    
  return (
    <div ref={commentFormContainer}>
      <Typography level="h3" mb={1} fontWeight="bold">Comments</Typography>

      <Box mb={Boolean(comments.length) ? 2 : 0}>
        <CommentForm
          onSubmit={onCreateComment}
          parentComment={commentToReply}
          onCancelReply={() => setCommentToReply(undefined)}
        />
      </Box>

      {comments.map((comment) => (
        <CommentCard
          onReply={(comment) => {
            setCommentToReply(comment)
            commentFormContainer.current?.scrollIntoView({ behavior: 'smooth' })
          }}
          onUpdate={onUpdated}
          key={comment.id}
          {...comment}
        />
      ))}

      {taskComments.length > commentsToShow && (
        <Link onClick={() => setCommentsToShow(commentsToShow + 3)}>
          Show more comments
        </Link>
      )}
    </div>
  )
}

export default CommentsSection
