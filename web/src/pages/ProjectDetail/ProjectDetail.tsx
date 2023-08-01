import React, { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

import CalendarIcon from '@mui/icons-material/CalendarMonth'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import PersonPinIcon from '@mui/icons-material/PersonPin'
import ListItemContent from '@mui/joy/ListItemContent'
import BadgeIcon from '@mui/icons-material/BadgeSharp'
import LinearProgress from '@mui/joy/LinearProgress'
import DeleteIcon from '@mui/icons-material/Delete'
import ListSubheader from '@mui/joy/ListSubheader'
import EditIcon from '@mui/icons-material/Edit'
import AspectRatio from '@mui/joy/AspectRatio'
import AddIcon from '@mui/icons-material/Add'
import Typography from '@mui/joy/Typography'
import ListItem from '@mui/joy/ListItem'
import Avatar from '@mui/joy/Avatar'
import Button from '@mui/joy/Button'
import Stack from '@mui/joy/Stack'
import Grid from '@mui/joy/Grid'
import List from '@mui/joy/List'

import DeleteProjectModal from '@components/DeleteProjectModal'
import { ProjectStatus } from '@/types/project-status.enum'
import ProjectDetailSkeleton from './ProjectDetailSkeleton'
import { useAuthenticated } from '@hooks/useAuthenticated'
import CreateTaskModal from '@components/CreateTaskModal'
import { useGetProjectQuery } from '@services/api'
import StatusBadge from '@components/StatusBadge'
import AvatarUser from '@components/AvatarUser'
import { getFileURL } from '@utils/getFileURL'
import NotFound from '@assets/not-found.png'
import TaskCard from '@components/TaskCard'
import { timeAgo } from '@utils'

interface IProjectDetailProps {
  children?: React.ReactNode
}

const ProjectDetail: React.FC<IProjectDetailProps> = () => {
  const [projectToDelete, setProjectToDelete] = useState<number | undefined>(undefined)
  const [showCreateTaskModal, setShowCreateTaskModal] = useState(false)
  const { userLogged } = useAuthenticated()
  const { projectId } = useParams()
  const navigate = useNavigate()

  const { data: project, isLoading, refetch } = useGetProjectQuery(
    Number(projectId),
    { skip: !projectId, refetchOnMountOrArgChange: true }
  )

  if (!isLoading && !project) {
    return (
      <AspectRatio variant="plain">
        <Stack spacing={2}>
          <Typography level="h1">Oops!</Typography>
          <Typography level="body2" mb={2}>we couldn't find the project</Typography>
          <div>
            <img src={NotFound} alt="not found" width={300} height="auto" />
          </div>
          <Button sx={{ borderRadius: 'xl' }} onClick={() => navigate('/projects')}>
            Back to projects
          </Button>
        </Stack>
      </AspectRatio>
    )
  }

  return (
    <>
      <DeleteProjectModal
        projectId={projectToDelete}
        hasTasks={Boolean(project?.tasks?.length)}
        onDelete={() => navigate('/projects')}
        onClose={() => setProjectToDelete(undefined)}
      />

      <CreateTaskModal
        projectId={showCreateTaskModal ? project?.id : undefined}
        onClose={() => {
          setShowCreateTaskModal(false)
          refetch()
        }}
      />

      {isLoading && <LinearProgress />}
      {(isLoading && !project) && <ProjectDetailSkeleton />}
      {project && (
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

            <LinearProgress determinate value={project.progress} color="success" />

            <Stack direction="row" justifyContent="space-between" alignItems="center" mt={2} mb={2}>
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

            <StatusBadge
              status={project.status as ProjectStatus}
              sx={{ mb: 1, mx: 0 }}
            />

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
                  <Typography startDecorator={<PersonPinIcon />} level="body1">
                    Leader
                  </Typography>
                </ListSubheader>

                <List>
                  <ListItem>
                    <Stack spacing={1} direction="row" alignItems="center">
                      <AvatarUser user={project.user} />
                      <Typography>{project.user?.name ?? `Unknown (${project.user?.id})`}</Typography>
                    </Stack>
                  </ListItem>
                </List>
              </ListItem>

              <ListItem nested>

                <ListSubheader>
                  <Typography startDecorator={<BadgeIcon />} level="body1">
                    Alias
                  </Typography>
                </ListSubheader>

                <List>
                  <ListItem>
                    <ListItemContent>{project.alias}</ListItemContent>
                  </ListItem>
                </List>
              </ListItem>

              <ListItem nested>
                <ListSubheader>
                  <Typography startDecorator={<CalendarIcon />} level="body1">
                    Initial Date
                  </Typography>
                </ListSubheader>

                <List>
                  <ListItem>
                    <ListItemContent>{timeAgo(project.initial_date)}</ListItemContent>
                  </ListItem>
                </List>
              </ListItem>

              <ListItem nested>
                <ListSubheader>
                  <Typography startDecorator={<CalendarIcon />} level="body1">
                    Final Date
                  </Typography>
                </ListSubheader>

                <List>
                  <ListItem>
                    <ListItemContent>{timeAgo(project.final_date)}</ListItemContent>
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
      )}
    </>
  )
}

export default ProjectDetail
