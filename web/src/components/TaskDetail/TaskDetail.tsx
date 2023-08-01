import React, { useCallback, useEffect, useMemo, useState } from 'react'

import CalendarIcon from '@mui/icons-material/CalendarMonth'
import BadgeIcon from '@mui/icons-material/AssignmentInd'
import ListItemContent from '@mui/joy/ListItemContent'
import DeleteIcon from '@mui/icons-material/Delete'
import ListSubheader from '@mui/joy/ListSubheader'
import TimeIcon from '@mui/icons-material/Timer'
import EditIcon from '@mui/icons-material/Edit'
import ModalDialog from '@mui/joy/ModalDialog'
import AddIcon from '@mui/icons-material/Add'
import ModalClose from '@mui/joy/ModalClose'
import Typography from '@mui/joy/Typography'
import ListItem from '@mui/joy/ListItem'
import Divider from '@mui/joy/Divider'
import Button from '@mui/joy/Button'
import Avatar from '@mui/joy/Avatar'
import Modal from '@mui/joy/Modal'
import Stack from '@mui/joy/Stack'
import Sheet from '@mui/joy/Sheet'
import Grid from '@mui/joy/Grid'
import List from '@mui/joy/List'

import { useLazyGetTaskQuery, useUpdateTaskMutation } from '@services/api'
import { getFileURL, getInitials, modalTransitionProps, timeAgo } from '@utils'
import TaskForm, { type ITaskForm } from '../TaskForm'
import { TaskStatus } from '@/types/task-status.enum'
import CreateTaskModal from '../CreateTaskModal'
import DeleteTaskModal from '../DeleteTaskModal'
import CommentsSection from '../CommentsSection'
import StatusBadge from '../StatusBadge'
import TaskCard from '../TaskCard'
import LinearProgress from '@mui/joy/LinearProgress'

interface ITaskDetailProps extends Models.Task {
  children?: React.ReactNode
  show: boolean
  onClose: () => void
  onUpdated?: () => void
}

const TaskDetail: React.FC<ITaskDetailProps> = ({
  show,
  onClose,
  onUpdated = () => { },
  ...props
}) => {
  const [showDeleteTaskModal, setShowDeleteTaskModal] = useState<boolean>(false)
  const [showEditTaskModal, setShowEditTaskModal] = useState<boolean>(false)
  const [showCreateTaskModal, setShowCreateTaskModal] = useState(false)
  const [updateTask] = useUpdateTaskMutation()
  const [trigger, { data: taskUpdated }] = useLazyGetTaskQuery()
  const refetch = useCallback(() => trigger(props.id), [props.id])

  const task = useMemo<Models.Task>(() => taskUpdated ?? props, [taskUpdated, props])
  const {
    comments = [],
    users = [],
    tasks: subTasks = [],
    time_spend,
    status,
    parent_task_id,
  } = task

  const onUpdateTask = async (values: ITaskForm) => {
    const response = await updateTask({ ...values, id: task.id, project_id: task.project_id })
    if ('error' in response) return
    refetch()
    setShowEditTaskModal(false)
    onUpdated()
  }

  useEffect(() => {
    if (show) trigger(task.id)
  }, [show])


  return (
    <>
      {/* EDIT */}
      <Modal
        open={showEditTaskModal}
        onClose={() => setShowEditTaskModal(false)}
        {...modalTransitionProps}
      >
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

      {/* DELETE */}
      <DeleteTaskModal
        taskId={showDeleteTaskModal ? task.id : undefined}
        onClose={() => setShowDeleteTaskModal(false)}
        hasSubtasks={Boolean(subTasks.length)}
        onDelete={() => {
          onUpdated()
          onClose()
        }}
      />

      {/* CREATE - SUBTASK */}
      <CreateTaskModal
        projectId={showCreateTaskModal ? task.project_id : undefined}
        taskId={showCreateTaskModal ? task.id : undefined}
        onClose={() => {
          setShowCreateTaskModal(false)
          refetch()
        }}
      />

      <Modal
        open={show}
        onClose={onClose}
        {...modalTransitionProps}
        sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
      >
        <Sheet
          variant="outlined"
          sx={{
            width: '75%',
            overflowY: 'auto',
            p: 3,
            outline: 'none',
            maxHeight: '80%'
          }}
        >
          <ModalClose variant="outlined" />

          <Grid container spacing={4}>
            <Grid xs={8}>
              <Typography
                mb={3}
                level="h1"
                endDecorator={
                  <Stack spacing={1} direction="row" alignItems="start">
                    <StatusBadge status={status as TaskStatus} />

                    {Boolean(parent_task_id) && (
                      <Typography
                        display="inline-block"
                        variant="outlined"
                        fontSize="medium"
                        color="neutral"
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

              {!Boolean(parent_task_id) && (
                <>
                  <LinearProgress determinate value={task.progress} color="success" />
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

              {subTasks?.map((subTask) => (
                <TaskCard
                  {...subTask}
                  key={subTask.id}
                  onUpdated={() => {
                    onUpdated()
                    refetch()
                  }}
                />
              ))}

              <Divider sx={{ my: 3 }} />

              <CommentsSection
                taskId={task.id}
                comments={comments}
                onUpdated={refetch}
              />
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
                  <ListSubheader>
                    <Typography startDecorator={<BadgeIcon />} level="body1">
                      Alias
                    </Typography>
                  </ListSubheader>

                  <List>
                    <ListItem>
                      <ListItemContent>{task.alias ?? 'N/A'}</ListItemContent>
                    </ListItem>
                  </List>
                </ListItem>

                <ListItem nested>
                  <ListSubheader>
                    <Typography startDecorator={<CalendarIcon />} level="body1">
                      Created at
                    </Typography>
                  </ListSubheader>

                  <List>
                    <ListItem>
                      <ListItemContent>{timeAgo(task.created_at)}</ListItemContent>
                    </ListItem>
                  </List>
                </ListItem>

                {Boolean(time_spend) && (
                  <ListItem nested>
                    <ListSubheader>
                      <Typography startDecorator={<TimeIcon />} level="body1">
                        TimeSpend
                      </Typography>
                    </ListSubheader>

                    <List>
                      <ListItem>
                        <ListItemContent>{time_spend}</ListItemContent>
                      </ListItem>
                    </List>
                  </ListItem>
                )}

                {Boolean(users.length) && (
                  <ListItem nested>
                    <ListSubheader>
                      <Typography startDecorator={<BadgeIcon />} level="body1">
                        Assigned to
                      </Typography>
                    </ListSubheader>

                    <List>
                      {users.map((user) => (
                        <ListItem key={user.id}>
                          <Stack spacing={1} direction="row" alignItems="center">
                            <Avatar src={getFileURL(user?.avatar)}>
                              {getInitials(user?.name)}
                            </Avatar>
                            <Typography>{user?.name}</Typography>
                          </Stack>
                        </ListItem>
                      ))}
                    </List>
                  </ListItem>
                )}
              </List>

              <Button
                onClick={() => setShowEditTaskModal(true)}
                startDecorator={<EditIcon />}
                variant="outlined"
                color="warning"
                sx={{ mt: 3 }}
                size="md"
                fullWidth
              >
                Edit
              </Button>

              <Button
                onClick={() => setShowDeleteTaskModal(true)}
                startDecorator={<DeleteIcon />}
                variant="outlined"
                color="danger"
                sx={{ mt: 1 }}
                size="md"
                fullWidth
              >
                Delete
              </Button>
            </Grid>
          </Grid>
        </Sheet>
      </Modal>
    </>
  )
}

export default TaskDetail
