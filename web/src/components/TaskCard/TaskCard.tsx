import React, { useMemo, useState } from 'react'

import CalendarIcon from '@mui/icons-material/CalendarToday'
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
import Divider from '@mui/joy/Divider'
import Button from '@mui/joy/Button'
import Avatar from '@mui/joy/Avatar'
import Modal from '@mui/joy/Modal'
import Stack from '@mui/joy/Stack'
import Sheet from '@mui/joy/Sheet'
import Grid from '@mui/joy/Grid'
import List from '@mui/joy/List'
import Card from '@mui/joy/Card'

import {  useLazyGetTaskQuery, useUpdateTaskMutation } from '@/services/api'
import { TaskStatus } from '@/types/task-status.enum'
import { getFileURL, getInitials } from '@/utils'
import TaskForm, { ITaskForm } from '../TaskForm'
import DeleteTaskModal from '../DeleteTaskModal'
import CreateTaskModal from '../CreateTaskModal'

interface ITaskCardProps extends Models.Task {
  children?: React.ReactNode
  onUpdated?: () => void
}

const TaskCard: React.FC<ITaskCardProps> = (props) => {
  const [showViewTaskModal, setShowViewTaskModal] = useState<boolean>(false)
  const [showDeleteTaskModal, setShowDeleteTaskModal] = useState<boolean>(false)
  const [showEditTaskModal, setShowEditTaskModal] = useState<boolean>(false)
  const [showCreateTaskModal, setShowCreateTaskModal] = useState(false)
  const [updateTask] = useUpdateTaskMutation()
  const [trigger, { data: taskUpdated }] = useLazyGetTaskQuery()
  const task = useMemo<Models.Task>(() => taskUpdated ?? props, [taskUpdated, props])

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
