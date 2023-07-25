import React, { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as Yup from 'yup'

import AutocompleteOption from '@mui/joy/AutocompleteOption'
import ListItemDecorator from '@mui/joy/ListItemDecorator'
import ListItemContent from '@mui/joy/ListItemContent'
import AvatarPicker from '@components/AvatarPicker'
import Autocomplete from '@mui/joy/Autocomplete'
import FormControl from '@mui/joy/FormControl'
import Typography from '@mui/joy/Typography'
import FormLabel from '@mui/joy/FormLabel'
import Textarea from '@mui/joy/Textarea'
import Avatar from '@mui/joy/Avatar'
import Select from '@mui/joy/Select'
import Option from '@mui/joy/Option'
import Button from '@mui/joy/Button'
import Stack from '@mui/joy/Stack'
import Input from '@mui/joy/Input'
import Grid from '@mui/joy/Grid'
import Box from '@mui/joy/Box'

import { ProjectStatus } from '@/types/project-status.enum'
import { useGetUsersQuery } from '@services/api'
import { getFileURL, getInitials } from '@utils'

interface IProjectFormProps {
  children?: React.ReactNode
  onSubmit: (values: IProjectForm, avatar: File | undefined) => void
  defaultValue?: Models.Project
}

export interface IProjectForm {
  name: string
  description: string
  // avatar: string
  alias: string
  status: string
  initial_date: string
  final_date: string
  user_id: number
}

const projectFormSchema = Yup.object().shape({
  name: Yup.string().required('Required'),
  description: Yup.string().required('Required'),
  // avatar: Yup.b().required('Required'),
  alias: Yup.string().required('Required'),
  status: Yup.string().required('Required'),
  initial_date: Yup.string().required('Required'),
  final_date: Yup.string().required('Required'),
  user_id: Yup.number().required('Required'),
})

const ProjectForm:React.FC<IProjectFormProps> = ({
  onSubmit,
  defaultValue,
}) => {
  const { data: users } = useGetUsersQuery(undefined, { refetchOnMountOrArgChange: true })
  const [avatar, setAvatar] = React.useState<File | undefined>(undefined)
  // const [status, setStatus] = React.useState<ProjectStatus>(ProjectStatus.Pending)
  const { handleSubmit, register, setValue, formState: { errors } } = useForm<IProjectForm>({
    defaultValues: {
      name: '',
      description: '',
      alias: '',
      status: ProjectStatus.Pending,
      initial_date: '',
      final_date: '',
    },
    resolver: yupResolver(projectFormSchema),
  })

  const handleChangeStatus = (
    _: React.SyntheticEvent | null,
    newValue: string | null,
  ) => {
    if (newValue) setValue('status', newValue)
  }

  useEffect(() => {
    if (defaultValue) {
      setValue('name', defaultValue.name)
      setValue('description', defaultValue.description)
      setValue('alias', defaultValue.alias)
      setValue('status', defaultValue.status)
      setValue('initial_date', defaultValue.initial_date)
      setValue('final_date', defaultValue.final_date)
      setValue('user_id', defaultValue.user_id)
    }
  }, [defaultValue])

  return (
    <form onSubmit={handleSubmit((values) => onSubmit(values, avatar))}>
      <Grid container spacing={2} m={0} alignItems="center">
        <Grid xs={4}>
          <Box width={300} height={300}>
            <AvatarPicker onChange={(file) => setAvatar(file)} defaultValue={defaultValue?.avatar} />
          </Box>
        </Grid>

        <Grid xs={8}>
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
                placeholder="Lorem ipsum dolor sit amet, consectetur adipiscing elit...."
                autoComplete="off"
                minRows={3}
                error={!!errors.name}
                {...register('description')}
              />

              {!!errors.name && <Typography level="body2" color="danger" alignSelf="flex-end">
                {errors.name.message}
              </Typography>}
            </FormControl>

            <Grid container gap={2} direction="row" wrap="nowrap">
              <Grid xs={6}>
                <FormControl>
                  <FormLabel>Alias</FormLabel>
                  <Input
                    type="text"
                    size="lg"
                    placeholder="Lorem..."
                    autoComplete="off"
                    error={!!errors.alias}
                    {...register('alias')}
                  />

                  {!!errors.alias && <Typography level="body2" color="danger" alignSelf="flex-end">
                    {errors.alias.message}
                  </Typography>}
                </FormControl>
              </Grid>

              <Grid xs={6} m={0}>
                <FormControl>
                  <FormLabel>Status</FormLabel>

                  <Select onChange={handleChangeStatus} defaultValue={ProjectStatus.Pending} size="lg">
                    {Object.values(ProjectStatus).map((status) => (
                      <Option key={status} value={status}>
                        {status}
                      </Option>
                    ))}
                  </Select>

                  {!!errors.status && <Typography level="body2" color="danger" alignSelf="flex-end">
                    {errors.status.message}
                  </Typography>}
                </FormControl>
              </Grid>
            </Grid>

            <Grid container gap={2} direction="row" wrap="nowrap">
              <Grid xs={6}>
                <FormControl>
                  <FormLabel>Inital Date</FormLabel>
                  <Input
                    type="date"
                    size="lg"
                    error={!!errors.initial_date}
                    {...register('initial_date')}
                  />

                  {!!errors.initial_date && <Typography level="body2" color="danger" alignSelf="flex-end">
                    {errors.initial_date.message}
                  </Typography>}
                </FormControl>
              </Grid>

              <Grid xs={6}>
                <FormControl>
                  <FormLabel>Final Date</FormLabel>
                  <Input
                    type="date"
                    size="lg"
                    error={!!errors.final_date}
                    {...register('final_date')}
                  />

                  {!!errors.final_date && <Typography level="body2" color="danger" alignSelf="flex-end">
                    {errors.final_date.message}
                  </Typography>}
                </FormControl>
              </Grid>
            </Grid>

            <FormControl>
              <FormLabel> Leader user</FormLabel>
              <Autocomplete
                options={users ?? (defaultValue?.user ? [defaultValue.user] : [])}
                // isOptionEqualToValue={(option, value) => option.id === value}
                getOptionLabel={(option) => option.name}
                defaultValue={defaultValue?.user}
                placeholder="Choose a user"
                key={defaultValue?.user_id}
                error={!!errors.user_id}
                size="lg"
                onChange={(_, option) => {
                  if (option) setValue('user_id', option?.id)
                }}
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

              {!!errors.user_id && <Typography level="body2" color="danger" alignSelf="flex-end">
                {errors.user_id.message}
              </Typography>}
            </FormControl>

            <Button type="submit" color="primary" size="lg">
              {defaultValue ? 'Update' : 'Create'}
            </Button>
          </Stack>
        </Grid>
      </Grid>
    </form>
  )
}

export default ProjectForm
