import { CardPropsColorOverrides, ColorPaletteProp } from '@mui/joy'
import type { OverridableStringUnion } from '@mui/types'

import { TaskStatus } from '@/types/task-status.enum'

export const getTaskStatusColor = (status: TaskStatus): OverridableStringUnion<ColorPaletteProp, CardPropsColorOverrides> => {
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
