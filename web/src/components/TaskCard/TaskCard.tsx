import React, { useMemo, useState } from 'react'
import { yupResolver } from '@hookform/resolvers/yup'
import { useForm } from 'react-hook-form'
import * as Yup from 'yup'

import CalendarIcon from '@mui/icons-material/CalendarToday'
import SendIcon from '@mui/icons-material/Send'
import BadgeIcon from '@mui/icons-material/AssignmentInd'
import ListItemButton from '@mui/joy/ListItemButton'
import DeleteIcon from '@mui/icons-material/Delete'
import ListSubheader from '@mui/joy/ListSubheader'
import TimeIcon from '@mui/icons-material/Timer'
import EditIcon from '@mui/icons-material/Edit'
import ModalDialog from '@mui/joy/ModalDialog'
import AddIcon from '@mui/icons-material/Add'
import ModalClose from '@mui/joy/ModalClose'
import Typography from '@mui/joy/Typography'
import ListItem from '@mui/joy/ListItem'
import Textarea from '@mui/joy/Textarea'
import Divider from '@mui/joy/Divider'
import Button from '@mui/joy/Button'
import Avatar from '@mui/joy/Avatar'
import Modal from '@mui/joy/Modal'
import Stack from '@mui/joy/Stack'
import Sheet from '@mui/joy/Sheet'
import Grid from '@mui/joy/Grid'
import List from '@mui/joy/List'
import Card from '@mui/joy/Card'

import { useAuthenticated } from '@hooks/useAuthenticated'
import { TaskStatus } from '@/types/task-status.enum'
import { getFileURL, getInitials } from '@/utils'
import TaskForm, { ITaskForm } from '../TaskForm'
import DeleteTaskModal from '../DeleteTaskModal'
import DeleteCommentModal from '../DeleteCommentModal'
import CreateTaskModal from '../CreateTaskModal'
import {
  useCreateCommentMutation,
  useLazyGetTaskQuery,
  useUpdateCommentMutation,
  useUpdateTaskMutation
} from '@services/api'
import { Input, Link } from '@mui/joy'
import TagInput from '../TagInput/TagInput'

interface ITaskCardProps extends Models.Task {
  children?: React.ReactNode
  onUpdated?: () => void
}

interface CommentForm {
  title: string
  comment: string
  tags_ids: number[] | undefined
}

const commentFormSchema = Yup.object().shape({
  title: Yup.string().required('Title is required'),
  comment: Yup.string().required('Comment is required'),
  tags_ids: Yup.array(),
})

const TaskCard: React.FC<ITaskCardProps> = (props) => {
  const [commentToDelete, setCommentToDelete] = useState<number | undefined>(undefined)
  const [showDeleteTaskModal, setShowDeleteTaskModal] = useState<boolean>(false)
  const [showViewTaskModal, setShowViewTaskModal] = useState<boolean>(false)
  const [showEditTaskModal, setShowEditTaskModal] = useState<boolean>(false)
  const [showCreateTaskModal, setShowCreateTaskModal] = useState(false)
  const [commentsToShow, setCommentsToShow] = useState<number>(3)
  const [commentToEdit, setCommentToEdit] = useState<number | undefined>(undefined)
  const [trigger, { data: taskUpdated }] = useLazyGetTaskQuery()
  const [createComment] = useCreateCommentMutation()
  const [updateComment] = useUpdateCommentMutation()
  const [updateTask] = useUpdateTaskMutation()
  const { userLogged } = useAuthenticated()

  const task = useMemo<Models.Task>(() => taskUpdated ?? props, [taskUpdated, props])
  const commentForm = useForm<CommentForm>({
    defaultValues: {
      title: '',
      comment: '',
      tags_ids: [],
    },
    resolver: yupResolver(commentFormSchema)
  })

  const comments = useMemo<Models.Comment[]>(() => {
    return task?.comments?.slice(0, commentsToShow);
  }, [task?.comments, commentsToShow])

  const getTaskStatusColor = (status: TaskStatus) => {
    switch (status) {
      case TaskStatus.InProgress:
        return 'warning'
      case TaskStatus.Done:
        return 'success'
      case TaskStatus.Todo:
      default:
        return 'info'
    }
  }

  const onComment = async (values: CommentForm) => {
    const response = await createComment({
      title: values.title,
      comment: values.comment,
      tags_ids: values.tags_ids ?? [],
      task_id: task.id,
      parent_comment_id: undefined,
    })
    if ('error' in response) return
    commentForm.reset()
    trigger(task.id)
  }

  const onUpdateComment = async (values: CommentForm) => {
    const response = await updateComment({
      id: commentToEdit as number,
      ...values,
      task_id: task.id,
      parent_comment_id: undefined,
    })
    if ('error' in response) return
    commentForm.reset()
    setCommentToEdit(undefined)
    trigger(task.id)
  }

  const onUpdateTask = async (values: ITaskForm) => {
    const response = await updateTask({ ...values, id: task.id, project_id: task.project_id })
    if ('error' in response) return
    await trigger(task.id)
    setShowEditTaskModal(false)
    props.onUpdated?.()
  }

  return (
    <>
      {/* DELETE */}
      <DeleteTaskModal
        taskId={showDeleteTaskModal ? task.id : undefined}
        onClose={() => {
          setShowDeleteTaskModal(false)
        }}
        onDelete={() => {
          props.onUpdated?.()
          setShowViewTaskModal(false)
        }}
      />

      {/* DELETE - COMMENT */}
      <DeleteCommentModal
        commentId={commentToDelete}
        onClose={() => setCommentToDelete(undefined)}
        onDelete={() => {
          trigger(task.id)
          setCommentToDelete(undefined)
        }}
      />

      {/* EDIT */}
      <Modal open={showEditTaskModal} onClose={() => setShowEditTaskModal(false)}>
        <ModalDialog sx={{ width: 500, overflow: 'auto' }}>
          <Typography level="h4" fontWeight="bold">
            Edit - {task.name}
          </Typography>
          <Typography mb={2} textColor="text.tertiary">
            Fill in the information of the task
          </Typography>
          <TaskForm
            defaultValue={task}
            onSubmit={onUpdateTask}
            onCancel={() => setShowEditTaskModal(false)}
          />
        </ModalDialog>
      </Modal>

      {/* EDIT - COMMENT */}
      <Modal open={Boolean(commentToEdit)} onClose={() => setCommentToEdit(undefined)}>
        <ModalDialog sx={{ width: 500, overflow: 'auto' }}>
          <ModalClose variant="outlined" />
          <form onSubmit={commentForm.handleSubmit(onUpdateComment)}>
            <Stack spacing={2}>
              <Typography level="h4" fontWeight="bold">
                Edit Comment
              </Typography>

              <Textarea
                size="md"
                minRows={2}
                sx={{ flex: 1 }}
                error={!!commentForm.formState.errors.comment}
                {...commentForm.register('comment')}
              />

              <Button type="submit">
                Update
              </Button>

              <Button
                variant="outlined"
                color="neutral"
                onClick={() => setCommentToEdit(undefined)}
              >
                Cancel
              </Button>
            </Stack>
          </form>
        </ModalDialog>
      </Modal>


      {/* CREATE - SUBTASK */}
      <CreateTaskModal
        projectId={showCreateTaskModal ? task.project_id : undefined}
        taskId={showCreateTaskModal ? task.id : undefined}
        onClose={() => {
          setShowCreateTaskModal(false)
          trigger(task.id)
        }}
      />

      {/* VIEW */}
      <Modal
        open={showViewTaskModal}
        onClose={() => setShowViewTaskModal(false)}
        sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
      >
        <Sheet variant="outlined" sx={{ width: '75%', overflowY: 'auto', p: 3, outline: 'none', maxHeight: '80%' }}>
          <ModalClose variant="outlined" />

          <Grid container spacing={4}>
            <Grid xs={8}>
              <Typography
                mb={3}
                level="h1"
                endDecorator={
                  <Stack spacing={1} direction="row" alignItems="start">
                    <Typography
                      variant="outlined"
                      display="inline-block"
                      color={getTaskStatusColor(task.status as TaskStatus)}
                      fontSize="medium"
                    >
                      {task.status}
                    </Typography>
                    {Boolean(task.parent_task_id) && (
                      <Typography
                        variant="outlined"
                        display="inline-block"
                        color="neutral"
                        fontSize="medium"
                      >
                        SubTask
                      </Typography>
                    )}
                  </Stack>
                }
              >
                {task.name}
              </Typography>
              <Typography mb={5}>{task.description}</Typography>

              {!Boolean(task.parent_task_id) && (
                <>
                  <Divider sx={{ my: 3 }} />
                  <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
                    <Typography level="h3" mb={1} fontWeight="bold">SubTasks</Typography>
                    <Button
                      onClick={() => setShowCreateTaskModal(true)}
                      startDecorator={<AddIcon />}
                      sx={{ borderRadius: 'xl' }}
                      variant="outlined"
                    >
                      Add SubTask
                    </Button>
                  </Stack>
                </>
              )}

              {task?.tasks?.map((subTask) => (
                <TaskCard
                  {...subTask}
                  key={subTask.id}
                  onUpdated={() => trigger(task.id)}
                />
              ))}

              <Divider sx={{ my: 3 }} />
              <Typography level="h3" mb={1} fontWeight="bold">Comments</Typography>

              <form onSubmit={commentForm.handleSubmit(onComment)}>
                <Stack direction="row" spacing={1} mb={3} alignItems="start">
                  <Stack flex={1} spacing={1}>
                    <Input
                      size="md"
                      type="text"
                      placeholder="Type a title for your comment..."
                      error={!!commentForm.formState.errors.title}
                      {...commentForm.register('title')}
                    />
                    {commentForm.formState.errors.title && (
                      <Typography level="body2" color="danger">
                        {commentForm.formState.errors.title.message}
                      </Typography>
                    )}
                    <Textarea
                      size="md"
                      minRows={2}
                      sx={{ flex: 1 }}
                      placeholder="Type your comment here..."
                      error={!!commentForm.formState.errors.comment}
                      {...commentForm.register('comment')}
                    />
                    {commentForm.formState.errors.comment && (
                      <Typography level="body2" color="danger">
                        {commentForm.formState.errors.comment.message}
                      </Typography>
                    )}

                    <TagInput onChange={(v) => commentForm.setValue('tags_ids', v)} defaultValue={[]} />
                  </Stack>
                  <Button size="md" type="submit"><SendIcon /></Button>
                </Stack>
              </form>

              {comments.map((comment) => (
                <Stack spacing={2} mb={2} direction="row" key={comment.id}>
                  <Avatar src={getFileURL(comment?.user?.avatar)}>{getInitials(comment.user.name)}</Avatar>

                  <div>
                    <Typography display="block" fontWeight="bold" level="body2" textColor="text.tertiary">{comment.user.name}</Typography>
                    <Typography display="block" level="body1" fontWeight="bold">{comment.title}</Typography>
                    <Typography level="body2">{comment.comment}</Typography>
                    {Boolean(comment.tags?.length) && (
                      <Stack spacing={1} direction="row" mt={1}>
                        {comment.tags?.map((tag) => (
                          <Typography key={tag.id} variant="outlined" display="inline-block" fontSize="small" color="neutral">{tag.name}</Typography>
                        ))}
                      </Stack>
                    )}
                    <Stack spacing={1} mt={1} direction="row">
                      <Link>Reply</Link>
                      <Divider orientation="vertical" />
                      <Link onClick={() => {
                        commentForm.setValue('comment', comment.comment)
                        setCommentToEdit(comment.id)
                      }}>Edit</Link>
                      {userLogged?.is_admin && (
                        <>
                          <Divider orientation="vertical" />
                          <Link onClick={() => setCommentToDelete(comment.id)}>Delete</Link>
                        </>
                      )}
                    </Stack>
                  </div>
                </Stack>
              ))}

              {task?.comments?.length > commentsToShow && (
                <Link onClick={() => setCommentsToShow(commentsToShow + 3)}>
                  Show more comments
                </Link>
              )}
            </Grid>

            <Grid xs={4} mt={4}>
              <List
                variant="outlined"
                size="lg"
                sx={{
                  bgcolor: 'background.body',
                  borderRadius: 'sm',
                  boxShadow: 'sm',
                }}
              >
                <ListItem nested>
                  <ListSubheader><BadgeIcon sx={{ mr: 1 }} />Alias</ListSubheader>
                  <List>
                    <ListItem>
                      <ListItemButton>{task.alias ?? 'N/A'}</ListItemButton>
                    </ListItem>
                  </List>
                </ListItem>

                {Boolean(task.time_spend) && <ListItem nested>
                  <ListSubheader><TimeIcon sx={{ mr: 1 }} />TimeSpend</ListSubheader>
                  <List>
                    <ListItem>
                      <ListItemButton>{task.time_spend}</ListItemButton>
                    </ListItem>
                  </List>
                </ListItem>}

                {Boolean(task.initial_date) && <ListItem nested>
                  <ListSubheader><CalendarIcon sx={{ mr: 1 }} />Initial Date</ListSubheader>
                  <List>
                    <ListItem>
                      <ListItemButton>{task.initial_date}</ListItemButton>
                    </ListItem>
                  </List>
                </ListItem>}

                {Boolean(task.final_date) && <ListItem nested>
                  <ListSubheader><CalendarIcon sx={{ mr: 1 }} />Final Date</ListSubheader>
                  <List>
                    <ListItem>
                      <ListItemButton>{task.final_date}</ListItemButton>
                    </ListItem>
                  </List>
                </ListItem>}

                {Boolean(task.users?.length) && <ListItem nested>
                  <ListSubheader><BadgeIcon sx={{ mr: 1 }} />Assigned to</ListSubheader>
                  <List>
                    {task.users?.map((user) => (
                      <ListItem key={user.id}>
                        <Stack spacing={1} direction="row" alignItems="center">
                          <Avatar
                            src={getFileURL(user?.avatar)}
                          >
                            {getInitials(user?.name)}
                          </Avatar>
                          <Typography>{user?.name}</Typography>
                        </Stack>
                      </ListItem>
                    ))}
                  </List>
                </ListItem>}
              </List>

              <Button
                startDecorator={<EditIcon />}
                variant="outlined"
                color="warning"
                sx={{ mt: 3 }}
                size="md"
                fullWidth
                onClick={() => setShowEditTaskModal(true)}
              >
                Edit
              </Button>

              <Button
                startDecorator={<DeleteIcon />}
                variant="outlined"
                color="danger"
                sx={{ mt: 1 }}
                size="md"
                fullWidth
                onClick={() => setShowDeleteTaskModal(true)}
              >
                Delete
              </Button>
            </Grid>
          </Grid>
        </Sheet>
      </Modal>

      <Card
        key={task.id}
        variant="outlined"
        color={getTaskStatusColor(task.status as TaskStatus)}
        onClick={() => setShowViewTaskModal(true)}
        sx={{ mb: 2, cursor: 'pointer', '&:hover': { transform: 'scale(1.05)' } }}
      >
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Typography level="h4" fontWeight="bold">{task.name}</Typography>
          <Typography
            level="h5"
            fontWeight="bold"
            color={getTaskStatusColor(task.status as TaskStatus)}
          >
            {task.status}
          </Typography>
        </Stack>
      </Card>
    </>
  )
}

export default TaskCard
