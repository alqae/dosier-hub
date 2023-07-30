import React, { useMemo, useState } from 'react'

import Typography from '@mui/joy/Typography'
import Stack from '@mui/joy/Stack'
import Card from '@mui/joy/Card'

import { TaskStatus } from '@/types/task-status.enum'
import { getTaskStatusColor } from '@utils'
import TaskDetail from '../TaskDetail'

interface ITaskCardProps extends Models.Task {
  children?: React.ReactNode
  onUpdated?: () => void
}

const TaskCard: React.FC<ITaskCardProps> = ({ onUpdated = () => { }, ...props }) => {
  const [showViewTaskModal, setShowViewTaskModal] = useState<boolean>(false)
  const statusColor = useMemo(() => getTaskStatusColor(props.status as TaskStatus), [props.status])

  return (
    <>
      <TaskDetail
        show={Boolean(showViewTaskModal)}
        onClose={() => setShowViewTaskModal(false)}
        onUpdated={onUpdated}
        {...props}
      />

      <Card
        key={props.id}
        variant="outlined"
        color={statusColor}
        onClick={() => setShowViewTaskModal(true)}
        sx={{ mb: 2, cursor: 'pointer', '&:hover': { transform: 'scale(1.05)' } }}
      >
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Typography level="h4" fontWeight="bold">{props.name}</Typography>
          <Typography
            level="h5"
            fontWeight="bold"
            color={statusColor}
          >
            {props.status}
          </Typography>
        </Stack>
      </Card>
    </>
  )
}

export default TaskCard
