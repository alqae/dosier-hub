import React, { useEffect, useState } from 'react'
import { yupResolver } from '@hookform/resolvers/yup'
import { useForm } from 'react-hook-form'
import * as Yup from 'yup'

import ReplyIcon from '@mui/icons-material/Reply'
import ClearIcon from '@mui/icons-material/Clear'
import SendIcon from '@mui/icons-material/Send'
import FormControl from '@mui/joy/FormControl'
import Typography from '@mui/joy/Typography'
import Textarea from '@mui/joy/Textarea'
import Button from '@mui/joy/Button'
import Stack from '@mui/joy/Stack'
import Input from '@mui/joy/Input'

import TagInput from '../TagInput'

type ICommentFormProps = {
  defaultValue?: Models.Comment
  onSubmit: (values: ICommentForm) => void
  onCancel?: () => void
  onCancelReply?: () => void
  parentComment?: Models.Comment
}

export interface ICommentForm {
  title: string
  comment: string
  tags_ids: number[] | undefined
  parent_comment_id: number | undefined
}

const commentFormSchema = Yup.object().shape({
  title: Yup.string().required('Title is required'),
  comment: Yup.string().required('Comment is required'),
  tags_ids: Yup.array(),
  parent_comment_id: Yup.number(),
})

const CommentForm: React.FC<ICommentFormProps> = ({
  onSubmit,
  onCancel,
  defaultValue,
  parentComment,
  onCancelReply = () => { },
}) => {
  const [tags, setTags] = useState<Models.Tag[]>([])
  const {
    reset,
    handleSubmit,
    register,
    setValue,
    formState: { errors, isValid },
  } = useForm<ICommentForm>({
    criteriaMode: 'all',
    defaultValues: {
      title: '',
      comment: '',
      tags_ids: [],
    },
    resolver: yupResolver(commentFormSchema)
  })

  useEffect(() => {
    if (defaultValue) {
      reset({
        title: defaultValue.title,
        comment: defaultValue.comment,
        tags_ids: defaultValue.tags.map((tag) => tag.id),
      })

      setTags(defaultValue.tags)
    }

    if (parentComment) {
      setValue('parent_comment_id', parentComment.id)
    } else {
      setValue('parent_comment_id', undefined)
    }
  }, [
    defaultValue,
    parentComment
  ])

  const _onSubmit = (values: ICommentForm) => {
    onSubmit(values)
    onCancelReply()
    setTags([])
    reset()
  }

  return (
    <form onSubmit={handleSubmit(_onSubmit)}>
      <Stack
        direction={(defaultValue) ? 'column' : 'row'}
        mt={parentComment ? 4 : 0}
        alignItems="start"
        spacing={1}
      >
        <Stack flex={1} spacing={1} width={(defaultValue) ? '100%' : 'auto'} position="relative">
          {parentComment && (
            <Stack
              sx={{
                backgroundColor: (theme) => theme.vars.palette.primary[500],
                opacity: 0.8,
                p: 1,
                mx: 0,
                position: 'absolute',
                width: '100%',
                borderTopLeftRadius: 12,
                borderTopRightRadius: 12,
                top: -31,
              }}
              direction="row"
              spacing={2}
            >
              <ReplyIcon />
              <Typography level="body2" textColor="white">
                Replying to <Typography fontWeight="bold">{parentComment.title}</Typography>
              </Typography>
            </Stack>
          )}

          <FormControl>
            <Input
              size="md"
              type="text"
              sx={{ m: '0 !important' }}
              placeholder="Type a title for your comment..."
              error={!!errors.title}
              {...register('title')}
            />
            {errors.title && (
              <Typography level="body2" color="danger">
                {errors.title.message}
              </Typography>
            )}
          </FormControl>

          <FormControl>
            <Textarea
              size="md"
              minRows={2}
              sx={{ flex: 1 }}
              placeholder="Type your comment here..."
              error={!!errors.comment}
              {...register('comment')}
            />
            {errors.comment && (
              <Typography level="body2" color="danger">
                {errors.comment.message}
              </Typography>
            )}
          </FormControl>

          <TagInput
            onChange={(v) => {
              setTags(v)
              setValue('tags_ids', v.map((tag) => tag.id))
            }}
            onAddTag={(newTag) => {
              setTags([...tags, newTag])
              setValue('tags_ids', [...tags, newTag].map((tag) => tag.id))
            }}
            defaultValue={[]}
            value={tags}
          />
        </Stack>

        {defaultValue ? (
          <>
            <Button type="submit" fullWidth>Update</Button>

            <Button
              variant="outlined"
              color="neutral"
              onClick={onCancel}
              fullWidth
            >
              Cancel
            </Button>
          </>
        ) : (
          <Stack spacing={1}>
            <Button size="md" type="submit" disabled={!isValid}><SendIcon /></Button>
            {parentComment && (
              <Button
                size="md"
                type="button"
                color="neutral"
                onClick={onCancelReply}
              >
                <ClearIcon />
              </Button>
            )}
          </Stack>
        )}
      </Stack>
    </form>
  )
}

export default CommentForm
