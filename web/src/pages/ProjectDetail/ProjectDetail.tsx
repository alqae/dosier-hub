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
import AspectRatio from '@mui/joy/AspectRatio'
import AddIcon from '@mui/icons-material/Add'
import { ColorPaletteProp } from '@mui/joy'
import ListItem from '@mui/joy/ListItem'
import Avatar from '@mui/joy/Avatar'
import Button from '@mui/joy/Button'
import Stack from '@mui/joy/Stack'
import Grid from '@mui/joy/Grid'
import List from '@mui/joy/List'

import DeleteProjectModal from '@components/DeleteProjectModal'
import { ProjectStatus } from '@/types/project-status.enum'
import { useAuthenticated } from '@hooks/useAuthenticated'
import CreateTaskModal from '@components/CreateTaskModal'
import { useGetProjectQuery } from '@services/api'
import { getFileURL } from '@utils/getFileURL'
import TaskCard from '@components/TaskCard'
import { getInitials } from '@utils'

interface IProjectDetailProps {
  children?: React.ReactNode
}

const ProjectDetail: React.FC<IProjectDetailProps> = () => {
  const [projectToDelete, setProjectToDelete] = useState<number | undefined>(undefined)
  const [showCreateTaskModal, setShowCreateTaskModal] = useState(false)
  const { userLogged } = useAuthenticated()
  const { projectId } = useParams()
  const navigate = useNavigate()

  const { data: project, isLoading, refetch } = useGetProjectQuery(Number(projectId), { skip: !projectId, refetchOnMountOrArgChange: true })

  const statusColor = useMemo<OverridableStringUnion<ColorPaletteProp, TypographyPropsColorOverrides>>(
    () => {
      switch (project?.status) {
        case ProjectStatus.Pending:
          return 'warning'
        case ProjectStatus.Active:
        case ProjectStatus.Completed:
          return 'success'
        default:
          return 'neutral'
      }
    },
    [project?.status]
  )

  if (isLoading) {
    return (
      <AspectRatio variant="plain">
        <CircularProgress />
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

      <CreateTaskModal
        projectId={showCreateTaskModal ? project.id : undefined}
        onClose={() => {
          setShowCreateTaskModal(false)
          refetch()
        }}
      />

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

          <Typography mb={5}>{project.description}</Typography>

          <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
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

          {project.tasks?.map((task) => (
            <TaskCard
              {...task}
              key={task.id}
              onUpdated={() => refetch()}
            />
          ))}
        </Grid>

        <Grid xs={4}>
          <AspectRatio variant="plain" ratio="1/1">
            <Avatar
              src={getFileURL(project.avatar)}
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
                  <Stack spacing={1} direction="row" alignItems="center">
                    <Avatar
                      src={getFileURL(project.user?.avatar)}
                    >
                      {getInitials(project.user?.name)}
                    </Avatar>
                    <Typography>{project.user?.name}</Typography>
                  </Stack>
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

          {userLogged?.is_admin && (
            <>
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
            </>
          )}
        </Grid>
      </Grid>
    </>
  )
}

export default ProjectDetail
