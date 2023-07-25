import React, { useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

import Typography, { TypographyPropsColorOverrides } from '@mui/joy/Typography'
import CircularProgress from '@mui/material/CircularProgress'
import CalendarIcon from '@mui/icons-material/CalendarMonth'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import SearchOffIcon from '@mui/icons-material/SearchOff'
import type { OverridableStringUnion } from '@mui/types'
import BadgeIcon from '@mui/icons-material/BadgeSharp'
import ListItemButton from '@mui/joy/ListItemButton'
import DeleteIcon from '@mui/icons-material/Delete'
import ListSubheader from '@mui/joy/ListSubheader'
import EditIcon from '@mui/icons-material/Edit'
import ModalDialog from '@mui/joy/ModalDialog'
import FormControl from '@mui/joy/FormControl'
import AspectRatio from '@mui/joy/AspectRatio'
import AddIcon from '@mui/icons-material/Add'
import { ColorPaletteProp } from '@mui/joy'
import FormLabel from '@mui/joy/FormLabel'
import ListItem from '@mui/joy/ListItem'
import Avatar from '@mui/joy/Avatar'
import Button from '@mui/joy/Button'
import Input from '@mui/joy/Input'
import Stack from '@mui/joy/Stack'
import Modal from '@mui/joy/Modal'
import Grid from '@mui/joy/Grid'
import List from '@mui/joy/List'

import DeleteProjectModal from '@components/DeleteProjectModal'
import { ProjectStatus } from '@/types/project-status.enum'
import { useGetProjectQuery } from '@services/api'
import { getFileURL } from '@utils/getFileURL'
import { getInitials } from '@/utils'

interface IProjectDetailProps {
  children?: React.ReactNode
}

const ProjectDetail: React.FC<IProjectDetailProps> = () => {
  const [projectToDelete, setProjectToDelete] = useState<number | undefined>(undefined)
  const [showCreateTaskModal, setShowCreateTaskModal] = useState(false)
  const { projectId } = useParams()
  const navigate = useNavigate()

  const { data: project, isLoading } = useGetProjectQuery(Number(projectId), { skip: !projectId, refetchOnMountOrArgChange: true })

  const statusColor = useMemo<OverridableStringUnion<ColorPaletteProp, TypographyPropsColorOverrides>>(
      () => {
      switch (project?.status) {
        case ProjectStatus.Pending:
          return 'warning'
        case ProjectStatus.Active:
          return 'success'
        case ProjectStatus.Completed:
          return 'primary'
        default:
          return 'neutral'
      }
    }, [project?.status]
  )

  if (isLoading) {
    return (
      <AspectRatio variant="plain">
        <CircularProgress/>
      </AspectRatio>
    )
  }

  if (!project) {
    return (
      <AspectRatio variant="plain">
        <div>
          <SearchOffIcon sx={{ color: 'text.tertiary', fontSize: '25rem' }} />
          <div>
            <Typography level="h1" mb={3}>Project not found</Typography>
            <Button
              startDecorator={<ArrowBackIcon />}
              onClick={() => navigate('/projects')}
            >
              Back to projects
            </Button>
          </div>
        </div>
      </AspectRatio>
    )
  }

  return (
    <>
      <DeleteProjectModal
        projectId={projectToDelete}
        onClose={() => setProjectToDelete(undefined)}
        onDelete={() => navigate('/projects')}
      />

      <Modal open={showCreateTaskModal} onClose={() => setShowCreateTaskModal(false)}>
        <ModalDialog
          aria-labelledby="basic-modal-dialog-title"
          aria-describedby="basic-modal-dialog-description"
          sx={{ width: 500 }}
        >
          <Typography level="h4" fontWeight="bold">
            Create new task
          </Typography>
          <Typography mb={2} textColor="text.tertiary">
            Fill in the information of the task
          </Typography>
          <form
            onSubmit={(event: React.FormEvent<HTMLFormElement>) => {
              event.preventDefault()
              setShowCreateTaskModal(false)
            }}
          >
            <Stack spacing={2}>
              <FormControl>
                <FormLabel>Name</FormLabel>
                <Input autoFocus required />
              </FormControl>
              <FormControl>
                <FormLabel>Description</FormLabel>
                <Input required />
              </FormControl>

              <Button type="submit">Create</Button>
              <Button
                variant="outlined"
                color="neutral"
                onClick={() => setShowCreateTaskModal(false)}
              >
                Cancel
              </Button>
            </Stack>
          </form>
        </ModalDialog>
      </Modal>

      <Grid container spacing={5} mt={5}>
        <Grid xs={8}>
          <Button
            variant="plain"
            startDecorator={<ArrowBackIcon />}
            onClick={() => navigate('/projects')}
          >
            Go Back
          </Button>
          <Typography level="h1" mb={3}>{project.name}</Typography>

          <Typography level="h2" mb={1} fontWeight="bold">Description</Typography>
          <Typography mb={5}>{project.description}</Typography>

          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Typography level="h3" mb={1} fontWeight="bold">Tasks</Typography>

            <Button
              startDecorator={<AddIcon />}
              sx={{ borderRadius: 'xl' }}
              variant="outlined"
              onClick={() => setShowCreateTaskModal(true)}
            >
              Add Task
            </Button>
          </Stack>
        </Grid>

        <Grid xs={4}>
          <AspectRatio variant="plain" ratio="1/1">
            <Avatar
              src={project ? getFileURL(project.avatar) : undefined}
              sx={{ width: '100%', height: 'auto' }}
            />
          </AspectRatio>

          <Typography variant="outlined" display="inline-block" color={statusColor} mb={1} mx={0}>
            {project.status}
          </Typography>

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
              <ListSubheader><BadgeIcon sx={{ mr: 1 }} />Leader</ListSubheader>
              <List>
                <ListItem>
                  <Typography startDecorator={
                    <Avatar
                      src={getFileURL(project.user?.avatar)}  
                    >{getInitials(project.user?.name)}</Avatar>
                  }>
                    {project.user?.name}
                  </Typography>
                </ListItem>
              </List>
            </ListItem>

            <ListItem nested>
              <ListSubheader><BadgeIcon sx={{ mr: 1 }} />Alias</ListSubheader>
              <List>
                <ListItem>
                  <ListItemButton>{project.alias}</ListItemButton>
                </ListItem>
              </List>
            </ListItem>

            <ListItem nested>
              <ListSubheader><CalendarIcon sx={{ mr: 1 }} />Initial Date</ListSubheader>
              <List>
                <ListItem>
                  <ListItemButton>{project.initial_date}</ListItemButton>
                </ListItem>
              </List>
            </ListItem>

            <ListItem nested>
              <ListSubheader><CalendarIcon sx={{ mr: 1 }} />Final Date</ListSubheader>
              <List>
                <ListItem>
                  <ListItemButton>{project.final_date}</ListItemButton>
                </ListItem>
              </List>
            </ListItem>
          </List>

          <Button
            startDecorator={<EditIcon />}
            variant="outlined"
            color="warning"
            sx={{ mt: 3 }}
            size="md"
            fullWidth
            onClick={() => navigate(`/projects/${projectId}/edit`)}
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
            onClick={() => setProjectToDelete(projectId ? Number(projectId) : undefined)}
          >
            Delete
          </Button>
        </Grid>
      </Grid>
    </>
  )
}

export default ProjectDetail
