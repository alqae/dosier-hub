import React from 'react'

import CalendarIcon from '@mui/icons-material/CalendarMonth'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import PersonPinIcon from '@mui/icons-material/PersonPin'
import ListItemContent from '@mui/joy/ListItemContent'
import BadgeIcon from '@mui/icons-material/BadgeSharp'
import ListSubheader from '@mui/joy/ListSubheader'
import AspectRatio from '@mui/joy/AspectRatio'
import AddIcon from '@mui/icons-material/Add'
import Typography from '@mui/joy/Typography'
import ListItem from '@mui/joy/ListItem'
import Skeleton from '@mui/joy/Skeleton'
import Button from '@mui/joy/Button'
import Stack from '@mui/joy/Stack'
import Grid from '@mui/joy/Grid'
import List from '@mui/joy/List'

interface IProjectDetailSkeletonProps {
  children?: React.ReactNode
}

export const ProjectDetailSkeleton: React.FC<IProjectDetailSkeletonProps> = () => (
  <Grid container spacing={5} mt={5}>
    <Grid xs={8}>
      <Button variant="plain" startDecorator={<ArrowBackIcon />} disabled>
        Go Back
      </Button>

      <Typography level="h1" mb={3}>
        <Skeleton sx={{ width: '75%', display: 'block' }}>
          Project
        </Skeleton>
      </Typography>


      <Typography mb={5} width="100%">
        <Skeleton sx={{ display: 'block' }}>
          Lorem Ipsum is simply dummy text of the printing and typesetting industry.
          Lorem Ipsum has been the industry's standard dummy text ever since the 1500s,
          when an unknown printer took a galley of type and scrambled it to make a type
          specimen book. It has survived not only five centuries, but also the leap into
          electronic typesetting, remaining essentially unchanged. It was popularised in
          the 1960s with the release of Letraset sheets containing Lorem Ipsum passages,
          and more recently with desktop publishing software like Aldus PageMaker including
          versions of Lorem Ipsum.
        </Skeleton>
      </Typography>

      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography level="h3" mb={1} fontWeight="bold">Tasks</Typography>

        <Button
          startDecorator={<AddIcon />}
          sx={{ borderRadius: 'xl' }}
          variant="outlined"
          disabled
        >
          Add Task
        </Button>
      </Stack>
    </Grid>

    <Grid xs={4}>
      <AspectRatio variant="plain" ratio="1/1">
        <Skeleton variant="circular" sx={{ width: '100%', height: '100%' }} />
      </AspectRatio>

      <Skeleton variant="rectangular" sx={{ mb: 1, mx: 0, width: 75, height: 24 }} />

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
                <Skeleton variant="circular" width={40} height={40} />
                <Typography>
                  <Skeleton>Johnny Doe</Skeleton>
                </Typography>
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
              <ListItemContent>
                <Typography>
                  <Skeleton>QWERTY - 123</Skeleton>
                </Typography>
              </ListItemContent>
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
              <ListItemContent>
                <Typography>
                  <Skeleton>XXXX XX XX XX:XX</Skeleton>
                </Typography>
              </ListItemContent>
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
              <ListItemContent>
                <Typography>
                  <Skeleton>XXXX XX XX XX:XX</Skeleton>
                </Typography>
              </ListItemContent>
            </ListItem>
          </List>
        </ListItem>
      </List>
    </Grid>
  </Grid>
)

export default ProjectDetailSkeleton
