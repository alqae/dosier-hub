import React, { useMemo } from 'react'

import Typography from '@mui/joy/Typography'
import { SxProps } from '@mui/material'

import { ProjectStatus } from '@/types/project-status.enum'
import { TaskStatus } from '@/types/task-status.enum'

interface IStatusBadgeProps {
  status: ProjectStatus | TaskStatus
  children?: React.ReactNode
  sx?: SxProps
}

const StatusBadge: React.FC<IStatusBadgeProps> = ({ status, sx = {} }) => {
  const statusColor = useMemo(() => {
    switch (status) {
      case ProjectStatus.Completed:
      case TaskStatus.Done:
        return 'success'
      case ProjectStatus.Pending:
      case TaskStatus.Todo:
        return 'warning'
      case ProjectStatus.Active:
      case TaskStatus.InProgress:
        return 'info'
      default:
        return 'neutral';
    }
  }, [status])

  return (
    <Typography
      variant="outlined"
      display="inline-block"
      fontSize="medium"
      color={statusColor}
      sx={sx}
    >
      {status}
    </Typography>
  )
}

export default StatusBadge
