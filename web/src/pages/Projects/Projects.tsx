import React, { useState } from 'react'
import styles from './Projects.module.scss'
import { useNavigate } from 'react-router-dom'

import LinearProgress from '@mui/joy/LinearProgress'
import DeleteIcon from '@mui/icons-material/Delete'
import Typography from '@mui/joy/Typography'
import IconButton from '@mui/joy/IconButton'
import Table from '@mui/joy/Table'
import Sheet from '@mui/joy/Sheet'

import DeleteProjectModal from '@components/DeleteProjectModal'
import { useGetProjectsQuery } from '@services/api'
import { getFileURL } from '@utils/getFileURL'

interface IProjectsProps {
  children?: React.ReactNode
}

const Projects: React.FC<IProjectsProps> = () => {
  const navigate = useNavigate()
  const { data: projects, isLoading, refetch } = useGetProjectsQuery(undefined, {
    refetchOnMountOrArgChange: true,
  })
  const [projectToDelete, setProjectToDelete] = useState<number | undefined>(undefined)

  return (
    <>
      <DeleteProjectModal
        projectId={projectToDelete}
        onClose={() => setProjectToDelete(undefined)}
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
        }}
      >
        {isLoading && <LinearProgress />}
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
              <th>Actions</th>
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
                  <img src={getFileURL(project.avatar)} alt={project.name} />
                </td>
                <td>{project.name}</td>
                <td>{project.alias}</td>
                <td>
                  <Typography
                    startDecorator={<img src={getFileURL(project.avatar)} alt={project.name} />}
                    sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}
                  >
                    {project.user.name}
                  </Typography>
                </td>
                <td>{project.status}</td>
                <td>{project.initial_date}</td>
                <td>{project.final_date}</td>
                <td>
                  <IconButton
                    size="sm"
                    variant="outlined"
                    onClick={() => setProjectToDelete(project.id)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Sheet>
    </>
  )
}

export default Projects
