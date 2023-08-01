import React, { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'

import LinearProgress from '@mui/joy/LinearProgress'
import DeleteIcon from '@mui/icons-material/Delete'
import PersonIcon from '@mui/icons-material/Person'
import EditIcon from '@mui/icons-material/Edit'
import AddIcon from '@mui/icons-material/Add'
import IconButton from '@mui/joy/IconButton'
import Typography from '@mui/joy/Typography'
import Avatar from '@mui/joy/Avatar'
import Button from '@mui/joy/Button'
import Table from '@mui/joy/Table'
import Stack from '@mui/joy/Stack'
import Card from '@mui/joy/Card'

import { useAuthenticated } from '@hooks/useAuthenticated'
import { useGetUsersPaginatedQuery } from '@services/api'
import InviteUserModal from '@components/InviteUserModal'
import DeleteUserModal from '@components/DeleteUserModal'
import { usePaginate } from '@hooks/usePaginate'
import Pagination from '@components/Pagination'
import { getFileURL, timeAgo } from '@/utils'

interface IUsersProps {
  children?: React.ReactNode
}

const Users: React.FC<IUsersProps> = () => {
  const [showInviteUserModal, setShowInviteUserModal] = useState(false)
  const [userToDelete, setUserToDelete] = useState<number | undefined>(undefined)
  const { page, limit, handlePageClick } = usePaginate()
  const { userLogged } = useAuthenticated()
  const navigate = useNavigate()

  const { users, total, pageCount, isFetching, isLoading, refetch } = useGetUsersPaginatedQuery(
    { page, limit },
    {
      refetchOnMountOrArgChange: true,
      selectFromResult: ({ data, ...otherProps }) => ({
        total: data?.total ?? 0,
        users: data?.data ?? [],
        // Calculate the 'pageCount' based on the 'totalProjects' and 'limit',
        // rounding up the result using Math.ceil()
        pageCount: Math.ceil((data?.total ?? 0) / limit),
        ...otherProps
      })
    }
  )

  const _userToDelete = useMemo<Models.User | undefined>(() => {
    return users.find((user) => user.id === userToDelete)
  }, [userToDelete])

  useEffect(() => {
    if (userLogged && !userLogged?.is_admin) {
      navigate('/projects')
    }
  }, [userLogged])

  return (
    <>
      <DeleteUserModal
        user={_userToDelete}
        onDelete={refetch}
        onClose={() => setUserToDelete(undefined)}
      />

      <InviteUserModal
        open={showInviteUserModal}
        onClose={() => {
          setShowInviteUserModal(false)
          refetch()
        }}
      />

      <Stack
        initial={{ opacity: 0, y: -100 }}
        transition={{ duration: 0.75 }}
        animate={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        component={motion.div}
        justifyContent="space-between"
        alignItems="center"
        direction="row"
        mb={3}
      >
        <Typography level="h2">Users</Typography>

        <Button
          variant="outlined"
          startDecorator={<AddIcon />}
          sx={{ borderRadius: 'xl' }}
          onClick={() => setShowInviteUserModal(true)}
        >
          Invite User
        </Button>
      </Stack>

      <motion.div
        initial={{ scaleY: 0 }}
        animate={{ scaleY: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.75 }}
      >
        {(!Boolean(users.length) && !isLoading) && (
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
              <Typography level="body1" my={2} textAlign="center">
                You don't have any users yet,<br />it's time to invite them!
              </Typography>
            </Stack>
          </Card>
        )}

        {Boolean(users.length) && (
          <Card
            variant="outlined"
            sx={{
              p: 0,
              zIndex: 1,
              overflow: 'auto',
            }}
          >
            {isFetching && <LinearProgress sx={{ height: 'auto' }} />}
            <Table stickyHeader>
              <thead>
                <tr>
                  <th></th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Created At</th>
                  <th>Updated At</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {users.map((user, index) => (
                  <motion.tr
                    initial={{ x: `${(index % 2 == 0) ? '-' : ''}50%`, opacity: 0 }}
                    transition={{ duration: 0.75, ease: 'easeInOut' }}
                    whileInView={{ x: 0, opacity: 1 }}
                    viewport={{ once: true }}
                    key={user.id}
                    onClick={(event) => {
                      event.preventDefault()
                      const target = event.target as HTMLElement
                      const targetTagName = target.tagName.toLowerCase()
                      const allowedTags = ['td', 'tr', 'p']
                      if (!allowedTags.includes(targetTagName)) return
                      return navigate(`/users/${user.id}/edit`)
                    }}
                  >
                    <td>
                      <Avatar
                        src={getFileURL(user.avatar)}
                        sx={{ mx: 'auto' }}
                        alt={user.name}
                        size="sm"
                      >
                        <PersonIcon />
                      </Avatar>
                    </td>
                    <td>
                      <Typography level="body2" textOverflow="ellipsis" whiteSpace="nowrap" overflow="hidden">
                        {user.name ?? `Unknown (${user.id})`}
                      </Typography>
                    </td>
                    <td>
                      <Typography level="body2" textOverflow="ellipsis" whiteSpace="nowrap" overflow="hidden">
                        {user.email}
                      </Typography>
                    </td>
                    <td>
                      <Typography level="body2" textOverflow="ellipsis" whiteSpace="nowrap" overflow="hidden">
                        {timeAgo(user.created_at)}
                      </Typography>
                    </td>
                    <td>
                      <Typography level="body2" textOverflow="ellipsis" whiteSpace="nowrap" overflow="hidden">
                        {timeAgo(user.updated_at)}
                      </Typography>
                    </td>
                    <td>
                      <Stack spacing={2} direction="row" justifyContent="center">
                        <IconButton
                          onClick={() => setUserToDelete(user.id)}
                          variant="outlined"
                          color="danger"
                          size="sm"
                        >
                          <DeleteIcon />
                        </IconButton>
                        <IconButton
                          onClick={() => navigate(`/users/${user.id}/edit`)}
                          variant="outlined"
                          size="sm"
                        >
                          <EditIcon />
                        </IconButton>
                      </Stack>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </Table>
          </Card>
        )}
      </motion.div>

      <motion.div
        hidden={total < limit}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.75 }}
        initial={{ opacity: 0, y: '-100%' }}
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

export default Users
