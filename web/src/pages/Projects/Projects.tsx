import React, { useState } from 'react'
import styles from './Projects.module.scss'
import { useNavigate } from 'react-router-dom'

import LinearProgress from '@mui/joy/LinearProgress'
import DeleteIcon from '@mui/icons-material/Delete'
import ImageIcon from '@mui/icons-material/Image'
import Typography from '@mui/joy/Typography'
import IconButton from '@mui/joy/IconButton'
import Avatar from '@mui/joy/Avatar'
import Stack from '@mui/joy/Stack'
import Table from '@mui/joy/Table'
import Sheet from '@mui/joy/Sheet'
import Link from '@mui/joy/Link'

import DeleteProjectModal from '@components/DeleteProjectModal'
import { ProjectStatus } from '@/types/project-status.enum'
import { useAuthenticated } from '@hooks/useAuthenticated'
import { getFileURL, getInitials, timeAgo } from '@utils'
import { useGetProjectsQuery } from '@services/api'
import StatusBadge from '@components/StatusBadge'

interface IProjectsProps {
  children?: React.ReactNode
}

const Projects: React.FC<IProjectsProps> = () => {
  const navigate = useNavigate()
  const { userLogged } = useAuthenticated()
  const { data: projects, isLoading, refetch } = useGetProjectsQuery(undefined, {
    refetchOnMountOrArgChange: true,
  })
  const [projectToDelete, setProjectToDelete] = useState<number | undefined>(undefined)
  
  return (
    <>
      <DeleteProjectModal
        onClose={() => setProjectToDelete(undefined)}
        hasTasks={Boolean(projects?.find((project) => project.id === projectToDelete)?.tasks_count)}
        projectId={projectToDelete}
        onDelete={refetch}
      />

      <Sheet
        sx={{
          '--TableCell-height': '40px',
          // the number is the amount of the header rows.
          '--TableHeader-height': 'calc(1 * var(--TableCell-height))',
          height: 500,
          overflow: 'auto',
          background: (
            theme,
          ) => `linear-gradient(${theme.vars.palette.background.surface} 30%, rgba(255, 255, 255, 0)),
          linear-gradient(rgba(255, 255, 255, 0), ${theme.vars.palette.background.surface} 70%) 0 100%,
          radial-gradient(
            farthest-side at 50% 0,
            rgba(0, 0, 0, 0.12),
            rgba(0, 0, 0, 0)
          ),
          radial-gradient(
              farthest-side at 50% 100%,
              rgba(0, 0, 0, 0.12),
              rgba(0, 0, 0, 0)
            )
            0 100%`,
          backgroundSize: '100% 40px, 100% 40px, 100% 14px, 100% 14px',
          backgroundRepeat: 'no-repeat',
          backgroundAttachment: 'local, local, scroll, scroll',
          backgroundPosition:
            '0 var(--TableHeader-height), 0 100%, 0 var(--TableHeader-height), 0 100%',
          backgroundColor: 'background.surface',
          ...(!projects?.length && !isLoading ? {
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
          } : {})
        }}
      >
        {isLoading ? <LinearProgress /> : (
          !projects?.length ? (
            <Typography
              level="h2"
              mb={3}
              endDecorator={userLogged?.is_admin && <Link onClick={() => navigate('/projects/new')}>create one</Link>}
            >
              No projects found
            </Typography>
          ) : (
            <Table stickyHeader className={styles.table}>
              <thead>
                <tr>
                  <th></th>
                  <th>Name</th>
                  <th>Alias</th>
                  <th>User</th>
                  <th>Status</th>
                  <th>Initial Date</th>
                  <th>Final Date</th>
                  {userLogged?.is_admin && <th>Actions</th>}
                </tr>
              </thead>
              <tbody>
                {projects?.map((project) => (
                  <tr key={project.name} className={styles.project} onClick={(event) => {
                    event.preventDefault();
                    const target = event.target as HTMLElement;
                    const targetTagName = target.tagName.toLowerCase()
                    const allowedTags = ['td', 'tr']
                    if (!allowedTags.includes(targetTagName)) return
                    return navigate(`/projects/${project.id}`)
                  }}>
                    <td>
                      <Avatar
                        src={getFileURL(project.avatar)}
                        alt={project.name}
                        size="sm"
                        sx={{ mx: 'auto' }}
                      >
                        <ImageIcon />
                      </Avatar>
                    </td>
                    <td>{project.name}</td>
                    <td>{project.alias}</td>
                    <td>
                      <Stack direction="row" alignItems="center" justifyContent="center" spacing={1}>
                        <Avatar
                          src={getFileURL(project.user.avatar)}
                          alt={project.name}
                          size="sm"
                        >
                          {getInitials(project.user.name)}
                        </Avatar>
                        <Typography>{project.user.name}</Typography>
                      </Stack>
                    </td>
                    <td><StatusBadge status={project.status as ProjectStatus} /></td>
                    <td>{timeAgo(project.initial_date)}</td>
                    <td>{timeAgo(project.final_date)}</td>
                    {userLogged?.is_admin && (
                      <td>
                        <IconButton
                          size="sm"
                          variant="outlined"
                          onClick={() => setProjectToDelete(project.id)}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </Table>
          )
        )}
      </Sheet>
    </>
  )
}

export default Projects
