import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import styles from './Projects.module.scss'
import { motion } from 'framer-motion'

import LinearProgress from '@mui/joy/LinearProgress'
import DeleteIcon from '@mui/icons-material/Delete'
import ImageIcon from '@mui/icons-material/Image'
import AddIcon from '@mui/icons-material/Add'
import Typography from '@mui/joy/Typography'
import IconButton from '@mui/joy/IconButton'
import Avatar from '@mui/joy/Avatar'
import Button from '@mui/joy/Button'
import Table from '@mui/joy/Table'
import Stack from '@mui/joy/Stack'
import Card from '@mui/joy/Card'

import DeleteProjectModal from '@components/DeleteProjectModal'
import { ProjectStatus } from '@/types/project-status.enum'
import { useAuthenticated } from '@hooks/useAuthenticated'
import { getFileURL, getInitials, timeAgo } from '@utils'
import { useGetProjectsQuery } from '@services/api'
import { usePaginate } from '@/hooks/usePaginate'
import StatusBadge from '@components/StatusBadge'
import Pagination from '@components/Pagination'

interface IProjectsProps {
  children?: React.ReactNode
}

const Projects: React.FC<IProjectsProps> = () => {
  const navigate = useNavigate()
  const { userLogged } = useAuthenticated()
  const [projectToDelete, setProjectToDelete] = useState<number | undefined>(undefined)
  const { page, limit, handlePageClick } = usePaginate()
  const {
    projects,
    pageCount,
    total,
    refetch,
    isLoading,
    isFetching,
  } = useGetProjectsQuery(
    { page, limit },
    {
      refetchOnMountOrArgChange: true,
      selectFromResult: ({ data, ...otherProps }) => ({
        total: data?.total ?? 0,
        projects: data?.data ?? [],
        // Calculate the 'pageCount' based on the 'total' and 'limit',
        // rounding up the result using Math.ceil()
        pageCount: Math.ceil((data?.total ?? 0) / limit),
        ...otherProps
      })
    }
  )

  return (
    <>
      <DeleteProjectModal
        onClose={() => setProjectToDelete(undefined)}
        hasTasks={Boolean(projects.find((project) => project.id === projectToDelete)?.tasks_count)}
        projectId={projectToDelete}
        onDelete={refetch}
      />

      {(!Boolean(projects.length) && !isLoading) && (
        <Card
          variant="outlined"
          sx={{
            height: 500,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {isFetching && <LinearProgress sx={{ position: 'absolute', top: 0, left: 0, right: 0 }} />}
          <Stack>
            <Typography level="h2" textAlign="center">Ohhh no!</Typography>
            <Typography level="body2" my={2}>You don't have any projects yet</Typography>

            {userLogged?.is_admin && (
              <Button
                variant="soft"
                sx={{ borderRadius: 'xl' }}
                startDecorator={<AddIcon />}
                onClick={() => navigate('/projects/new')}
              >
                Create Project
              </Button>
            )}
          </Stack>
        </Card>
      )}

      {Boolean(projects.length) && (
        <Card
          variant="outlined"
          sx={{
            p: 0,
            zIndex: 1,
            overflow: 'auto',
          }}
        >
          {isFetching && <LinearProgress sx={{ height: 'auto' }} />}
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
              {projects.map((project, index) => (
                <motion.tr
                  initial={{ x: `${(index % 2 == 0) ? '-' : ''}50%`, opacity: 0 }}
                  transition={{ duration: 0.75, ease: 'easeInOut' }}
                  whileInView={{ x: 0, opacity: 1 }}
                  className={styles.project}
                  viewport={{ once: true }}
                  key={project.id}
                  onClick={(event) => {
                    event.preventDefault();
                    const target = event.target as HTMLElement;
                    const targetTagName = target.tagName.toLowerCase()
                    const allowedTags = ['td', 'tr']
                    if (!allowedTags.includes(targetTagName)) return
                    return navigate(`/projects/${project.id}`)
                  }}
                >
                  <td>
                    <Avatar
                      src={getFileURL(project.avatar)}
                      sx={{ mx: 'auto' }}
                      alt={project.name}
                      size="sm"
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
                        onClick={() => setProjectToDelete(project.id)}
                        variant="outlined"
                        size="sm"
                      >
                        <DeleteIcon />
                      </IconButton>
                    </td>
                  )}
                </motion.tr>
              ))}
            </tbody>
          </Table>
        </Card>
      )}

      <motion.div
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.75 }}
        initial={{ opacity: 0, y: '-100%' }}
        hidden={total < limit}
      >
        <Pagination
          currentPage={page}
          pageCount={pageCount}
          onPageChange={handlePageClick}
        />
      </motion.div>
    </>
  )
}

export default Projects
