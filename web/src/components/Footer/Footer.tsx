import React from 'react'

import GitHubIcon from '@mui/icons-material/GitHub'
import LinkedInIcon from '@mui/icons-material/LinkedIn'
import Typography from '@mui/joy/Typography'
import IconButton from '@mui/joy/IconButton'
import Divider from '@mui/joy/Divider'
import Sheet from '@mui/joy/Sheet'
import Link from '@mui/joy/Link'

import Stack from '@mui/joy/Stack'

interface IFooterProps {
  children?: React.ReactNode
}

const Footer: React.FC<IFooterProps> = () => {
  const year = new Date().getFullYear()

  return (
    <footer>
      <Sheet
        variant="solid"
        color="neutral"
        invertedColors
        sx={{
          bgcolor: `neutral.800`,
          flexGrow: 1,
          py: 4,
          borderRadius: { xs: 0, sm: 'xs' },
          justifyContent: 'center',
          display: 'flex',
        }}
      >
        <Stack direction="column" alignItems="center" width={400} spacing={2}>
          <Stack
            direction="row"
            justifyContent="center"
            spacing={1}
            divider={<Divider orientation="vertical" />}
          >
            <Link href="https://github.com/alqae" target="_blank">
              <IconButton variant="plain">
                <GitHubIcon />
              </IconButton>
            </Link>

            <Link href="https://www.linkedin.com/in/js-mart/" target="_blank">
              <IconButton variant="plain">
                <LinkedInIcon />
              </IconButton>
            </Link>
          </Stack>

          <Divider sx={{ my: 2 }} orientation="horizontal" />

          <Typography>
            <Link href="#">Info</Link>
            &nbsp;&#8729;&nbsp;
            <Link href="#">Support</Link>
            &nbsp;&#8729;&nbsp;
            <Link href="#">Marketing</Link>
          </Typography>

          <Typography>
            <Link href="#">Terms of Use</Link>
            &nbsp;&#8729;&nbsp;
            <Link href="#">Privacy Policy</Link>
          </Typography>

          <Typography level="body2" sx={{ color: (theme) => theme.vars.palette.text.primary }} textColor="primary" fontWeight="bold">
            Copyright {year}
          </Typography>
        </Stack>
      </Sheet>
    </footer>
  )
}

export default Footer
