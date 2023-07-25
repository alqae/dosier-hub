import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import ListItemDecorator from '@mui/joy/ListItemDecorator'
import PersonIcon from '@mui/icons-material/Person'
import LogoutIcon from '@mui/icons-material/Logout'
import ListDivider from '@mui/joy/ListDivider'
import AddIcon from '@mui/icons-material/Add'
import ListIcon from '@mui/icons-material/List'
import IconButton from '@mui/joy/IconButton'
import MenuItem from '@mui/joy/MenuItem'
import Button from '@mui/joy/Button'
import Avatar from '@mui/joy/Avatar'
import Sheet from '@mui/joy/Sheet'
import Menu from '@mui/joy/Menu'
import Box from '@mui/joy/Box'

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
  
  const avatarURL = userLogged?.avatar ? getFileURL(userLogged?.avatar) : undefined
  
  return (
    <header>
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
          onClick={() => navigate('/')}
          sx={{ px: 2, backgroundColor: 'white', borderRadius: 'lg' }}
        >
          <img alt="Logo" src={Logo} width={150} />
        </IconButton>

        <Box sx={{ display: 'flex', flexDirection: 'row-reverse', flexShrink: 0 }}>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button
              startDecorator={<ListIcon />}
              sx={{ borderRadius: 'xl', display: { xs: 'none', md: 'inline-flex' } }}
              variant="outlined"
              onClick={() => navigate('/projects')}
            >
              All Projects
            </Button>
            
            <Button
              onClick={() => navigate('/projects/new')}
              startDecorator={<AddIcon />}
              sx={{ borderRadius: 'xl', display: { xs: 'none', md: 'inline-flex' } }}
            >
              New Project
            </Button>

            <IconButton sx={{ borderRadius: 'xl' }} onClick={(event) => setAnchorEl(event.currentTarget)}>
              <Avatar src={avatarURL} size="sm">{getInitials(userLogged?.name)}</Avatar>
              <KeyboardArrowDownIcon />
            </IconButton>

            <Menu
              variant="outlined"
              anchorEl={anchorEl}
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
              }}
            >
              <MenuItem
                onClick={() => {
                  navigate('/profile')
                  setAnchorEl(null) // close menu
                }}
              >
                <ListItemDecorator>
                  <PersonIcon />
                </ListItemDecorator>
                Profile
              </MenuItem>
              <ListDivider />
              <MenuItem
                onClick={() => {
                  dispatch(signOut())
                  setAnchorEl(null) // close menu
                }}
              >
                <ListItemDecorator>
                  <LogoutIcon />
                </ListItemDecorator>
                Log out
              </MenuItem>
            </Menu>
          </Box>
        </Box>
      </Sheet>
    </header>
  )
}

export default Navbar
