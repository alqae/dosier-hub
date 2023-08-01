import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'

import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import ListItemDecorator from '@mui/joy/ListItemDecorator'
import LightModeIcon from '@mui/icons-material/LightMode'
import DarkModeIcon from '@mui/icons-material/DarkMode'
import ListItemContent from '@mui/joy/ListItemContent'
import PersonIcon from '@mui/icons-material/Person'
import LogoutIcon from '@mui/icons-material/Logout'
import ListIcon from '@mui/icons-material/List'
import ListDivider from '@mui/joy/ListDivider'
import IconButton from '@mui/joy/IconButton'
import { useColorScheme } from '@mui/joy'
import MenuItem from '@mui/joy/MenuItem'
import Button from '@mui/joy/Button'
import Switch from '@mui/joy/Switch'
import Avatar from '@mui/joy/Avatar'
import Stack from '@mui/joy/Stack'
import Sheet from '@mui/joy/Sheet'
import Menu from '@mui/joy/Menu'

import { useAuthenticated } from '@hooks/useAuthenticated'
import { signOut, useAppDispatch } from '@store'
import { getInitials, getFileURL } from '@utils'
import Logo from '@assets/logo.svg'

interface INavbarProps {
  children?: React.ReactNode
}

const Navbar: React.FC<INavbarProps> = () => {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null)
  const { userLogged } = useAuthenticated()
  const dispatch = useAppDispatch()
  const navigate = useNavigate()

  const handleCloseMenu = () => setAnchorEl(null) // close menu
  const { mode, setMode } = useColorScheme()

  return (
    <motion.header
      viewport={{ once: true }}
      initial={{ y: '-100%' }}
      animate={{ y: 0 }}
      transition={{ duration: 0.75 }}
    >
      <Sheet
        variant="solid"
        color="primary"
        invertedColors
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexGrow: 1,
          p: 2,
          borderRadius: 0,
          minWidth: 'min-content',
          background: (theme) =>
            `linear-gradient(to top, ${theme.vars.palette.primary[600]}, ${theme.vars.palette.primary[500]})`,
        }}
      >
        <IconButton
          size="sm"
          variant="soft"
          onClick={() => navigate('/projects')}
          sx={{ px: 2, backgroundColor: 'white', borderRadius: 'lg' }}
        >
          <img alt="Logo" src={Logo} width={150} />
        </IconButton>

        <Stack spacing={2} direction="row">
          <Button
            startDecorator={<ListIcon />}
            sx={{ borderRadius: 'xl' }}
            variant="outlined"
            onClick={() => navigate('/projects')}
          >
            All Projects
          </Button>

          {userLogged?.is_admin && (
            <Button
              startDecorator={<PersonIcon />}
              sx={{ borderRadius: 'xl' }}
              variant="outlined"
              onClick={() => navigate('/users')}
            >
              All Users
            </Button>
          )}

          <IconButton sx={{ borderRadius: 'xl' }} onClick={(event) => setAnchorEl(event.currentTarget)}>
            <Avatar src={getFileURL(userLogged?.avatar)} size="sm">
              {getInitials(userLogged?.name)}
            </Avatar>
            <KeyboardArrowDownIcon />
          </IconButton>

          <Menu
            variant="outlined"
            anchorEl={anchorEl}
            component={motion.div}
            key={Boolean(anchorEl).toString()}
            viewport={{ once: true }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            open={Boolean(anchorEl)}
            onClose={() => setAnchorEl(null)}
            placement="bottom-start"
            disablePortal
            size="sm"
            sx={{
              '--ListItemDecorator-size': '24px',
              '--ListItem-minHeight': '40px',
              '--ListDivider-gap': '4px',
              minWidth: 200,
              zIndex: 10
            }}
          >
            <MenuItem
              onClick={() => {
                handleCloseMenu()
                navigate('/profile')
              }}
            >
              <ListItemDecorator>
                <PersonIcon />
              </ListItemDecorator>
              Profile
            </MenuItem>
            <ListDivider />
            <MenuItem>
              <ListItemContent
                sx={{ textAlign: 'center' }}
                onClick={() => setMode(mode === 'dark' ? 'light' : 'dark')}
              >
                <Switch
                  startDecorator={<LightModeIcon />}
                  endDecorator={<DarkModeIcon />}
                  checked={mode === 'dark'}
                />
              </ListItemContent>
            </MenuItem>
            <MenuItem
              onClick={() => {
                handleCloseMenu()
                dispatch(signOut())
              }}
            >
              <ListItemDecorator>
                <LogoutIcon />
              </ListItemDecorator>
              Log out
            </MenuItem>
          </Menu>
        </Stack>
      </Sheet>
    </motion.header>
  )
}

export default Navbar
