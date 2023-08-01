
import React from 'react'
import { toast } from 'react-toastify'

import ModalDialog from '@mui/joy/ModalDialog'
import Typography from '@mui/joy/Typography'
import Modal from '@mui/joy/Modal'

import TaskForm, { type ITaskForm } from '../TaskForm'
import { useCreateTaskMutation } from '@services/api'
import { modalTransitionProps } from '@utils'

interface ICreateTaskModalProps {
  children?: React.ReactNode
  projectId?: number
  taskId?: number
  onClose: () => void
}

const CreateTaskModal: React.FC<ICreateTaskModalProps> = ({
  projectId,
  taskId,
  onClose,
}) => {
  const [createTask] = useCreateTaskMutation()
  const onCreateTask = async (values: ITaskForm) => {
    const response = await createTask({
      ...values,
      parent_task_id: taskId,
      project_id: projectId as number,
    })
    if ('error' in response) return
    onClose()
    toast.success('Task created successfully')
  }

  return (
    <Modal
      open={Boolean(projectId || taskId)}
      onClose={onClose}
      {...modalTransitionProps}
    >
      <ModalDialog sx={{ width: 500, overflow: 'auto' }}>
        <Typography level="h4" fontWeight="bold">
          Create new {taskId ? 'SubTask' : 'Task'}
        </Typography>
        <Typography mb={2} textColor="text.tertiary">
          Fill in the information of the task
        </Typography>
        <TaskForm
          onSubmit={onCreateTask}
          onCancel={onClose}
        />
      </ModalDialog>
    </Modal>
  )
}

export default CreateTaskModal
