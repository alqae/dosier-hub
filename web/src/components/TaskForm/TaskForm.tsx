import React, { useEffect } from 'react'
import * as Yup from 'yup'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'

import AutocompleteOption from '@mui/joy/AutocompleteOption'
import ListItemDecorator from '@mui/joy/ListItemDecorator'
import ListItemContent from '@mui/joy/ListItemContent'
import Autocomplete from '@mui/joy/Autocomplete'
import FormControl from '@mui/joy/FormControl'
import Typography from '@mui/joy/Typography'
import FormLabel from '@mui/joy/FormLabel'
import Textarea from '@mui/joy/Textarea'
import Select from '@mui/joy/Select'
import Avatar from '@mui/joy/Avatar'
import Button from '@mui/joy/Button'
import Option from '@mui/joy/Option'
import Input from '@mui/joy/Input'
import Stack from '@mui/joy/Stack'
import Grid from '@mui/joy/Grid'

import { TaskStatus } from '@/types/task-status.enum'
import { useGetUsersQuery } from '@services/api'
import { getFileURL, getInitials } from '@utils'

interface ITaskFormProps {
  children?: React.ReactNode
  defaultValue?: Models.Task
  onSubmit: (values: ITaskForm) => void
  onCancel: () => void
}

export interface ITaskForm {
  name: string
  description: string | undefined
  alias: string | undefined
  status: TaskStatus
  initial_date: string | undefined
  final_date: string | undefined
  time_spend: string | undefined
  users_ids: number[]
}

const taskFormSchema = Yup.object().shape({
  name: Yup.string().required('Name is required'),
  description: Yup.string().optional(),
  alias: Yup.string().optional(),
  status: Yup.string().required('Status is required').oneOf(Object.values(TaskStatus)),
  initial_date: Yup.string().optional(),
  final_date: Yup.string().optional(),
  time_spend: Yup.string().optional(),
  users_ids: Yup.array().required('Users is required'),
})

const TaskForm: React.FC<ITaskFormProps> = ({
  onSubmit,
  onCancel,
  defaultValue,
}) => {
  const { data: users } = useGetUsersQuery(undefined, { refetchOnMountOrArgChange: true })

  const { handleSubmit, register, setValue, reset, formState: { errors } } = useForm<ITaskForm>({
    defaultValues: {
      name: '',
      description: '',
      alias: '',
      status: TaskStatus.Todo,
      initial_date: '',
      final_date: '',
      time_spend: '',
      users_ids: [],
    },
    resolver: yupResolver(taskFormSchema),
  })

  const handleChangeStatus = (
    _: React.SyntheticEvent | null,
    newValue: string | null,
  ) => {
    if (newValue) setValue('status', newValue as TaskStatus)
  }

  const onSave = (values: ITaskForm) => {
    onSubmit(values)
    reset()
  }

  useEffect(() => {
    if (defaultValue) {
      setValue('name', defaultValue.name)
      setValue('status', defaultValue.status as TaskStatus)
      if (defaultValue.description) setValue('description', defaultValue.description)
      if (defaultValue.alias) setValue('alias', defaultValue.alias)
      if (defaultValue.initial_date) setValue('initial_date', defaultValue.initial_date)
      if (defaultValue.final_date) setValue('final_date', defaultValue.final_date)
      if (defaultValue.time_spend) setValue('time_spend', defaultValue.time_spend)
      if (defaultValue.users) setValue('users_ids', defaultValue.users.map((user) => user.id))
    }
  }, [defaultValue])

  return (
    <form onSubmit={handleSubmit(onSave)}>
      <Stack spacing={2}>
        <FormControl>
          <FormLabel>Name</FormLabel>
          <Input
            type="text"
            size="lg"
            placeholder="Lorem ipsum"
            autoComplete="off"
            error={!!errors.name}
            {...register('name')}
          />

          {!!errors.name && <Typography level="body2" color="danger" alignSelf="flex-end">
            {errors.name.message}
          </Typography>}
        </FormControl>
        <FormControl>
          <FormLabel>Description</FormLabel>
          <Textarea
            size="lg"
            placeholder="Lorem ipsum dolor sit amet, consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore..."
            autoComplete="off"
            minRows={2}
            {...register('description')}
          />
        </FormControl>

        <Grid container spacing={2}>
          <Grid xs={6} py={0} pl={0}>
            <FormControl>
              <FormLabel>Inital Date</FormLabel>
              <Input
                type="date"
                size="lg"
                {...register('initial_date')}
              />
            </FormControl>
          </Grid>

          <Grid xs={6} py={0} pr={0}>
            <FormControl>
              <FormLabel>Final Date</FormLabel>
              <Input
                type="date"
                size="lg"
                {...register('final_date')}
              />
            </FormControl>
          </Grid>
        </Grid>

        <FormControl>
          <FormLabel> Alias</FormLabel>
          <Input
            type="text"
            size="lg"
            placeholder="Lorem..."
            autoComplete="off"
            {...register('alias')}
          />
        </FormControl>

        <Grid container spacing={2}>
          <Grid xs={6} py={0} pl={0}>
            <FormControl>
              <FormLabel>Status</FormLabel>

              <Select onChange={handleChangeStatus} defaultValue={TaskStatus.Todo} size="lg">
                {Object.values(TaskStatus).map((status) => (
                  <Option key={status} value={status}>
                    {status}
                  </Option>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid xs={6} py={0} pr={0}>
            <FormControl>
              <FormLabel>Time Spend</FormLabel>
              <Input
                type="text"
                size="lg"
                placeholder="1h 30m"
                autoComplete="off"
                {...register('time_spend')}
              />
            </FormControl>
          </Grid>
        </Grid>

        <FormControl>
          <FormLabel>Assign to</FormLabel>
          <Autocomplete
            multiple
            options={users ?? []}
            getOptionLabel={(option) => option.name}
            defaultValue={defaultValue?.users}
            placeholder="Choose a user"
            size="lg"
            onChange={(_, value) => setValue('users_ids', value.map((user) => user.id))}
            renderOption={(props, option) => (
              <AutocompleteOption {...props} value={option.id}>
                <ListItemDecorator>
                  <Avatar src={getFileURL(option.avatar)}>
                    {getInitials(option.name)}
                  </Avatar>
                </ListItemDecorator>
                <ListItemContent sx={{ fontSize: 'sm' }}>
                  {option.name}
                </ListItemContent>
              </AutocompleteOption>
            )}
          />
        </FormControl>

        <Button type="submit">
          {defaultValue ? 'Update' : 'Create'}
        </Button>
        <Button
          color="neutral"
          variant="outlined"
          onClick={onCancel}
        >
          Cancel
        </Button>
      </Stack>
    </form>
  )
}

export default TaskForm
