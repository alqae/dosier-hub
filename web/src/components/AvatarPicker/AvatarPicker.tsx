import React from 'react'
import { useFilePicker } from 'use-file-picker'

import ImageIcon from '@mui/icons-material/Image'
import EditIcon from '@mui/icons-material/Edit'
import AddIcon from '@mui/icons-material/Add'
import IconButton from '@mui/joy/IconButton'
import Tooltip from '@mui/joy/Tooltip'
import Avatar from '@mui/joy/Avatar'
import Badge from '@mui/joy/Badge'

import { getFileURL } from '@utils/getFileURL'

interface IAvatarPickerProps {
  children?: React.ReactNode
  onChange?: (avatar: File) => void
  defaultValue?: string
}

const AvatarPicker:React.FC<IAvatarPickerProps> = ({ defaultValue, onChange }) => {
  const [openFileSelector, { filesContent,  }] = useFilePicker({
    readAs: 'DataURL',
    accept: 'image/*',
    multiple: true,
    limitFilesConfig: { max: 1 },
    maxFileSize: 50,
    onFilesSuccessfulySelected: (file) => {
      console.log(file)
      onChange && onChange(file.plainFiles[0])
    }
  })

  const initalAvatar = defaultValue ? 
    defaultValue.startsWith('http') ? defaultValue : getFileURL(defaultValue)
  : undefined

  return (
    <Tooltip title="Add your avatar" variant="outlined">
      <Badge
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        variant="plain"
        badgeContent={
          <IconButton
            onClick={() => openFileSelector()}
            size="sm"
            color="primary"
            sx={{ padding: 0 }}
          >
            {filesContent.length > 0 ? <EditIcon /> : <AddIcon />}
          </IconButton>
        }
        badgeInset="14%"
        sx={{ '--Badge-paddingX': '0px', width: '100%', height: '100%' }}
      >
        <Avatar
          src={filesContent.length > 0 ? filesContent[0].content : initalAvatar}
          sx={{ width: '100%', height: '100%', cursor: 'pointer' }}
          size="lg"
          onClick={() => openFileSelector()}
          variant="outlined"
        >
          <ImageIcon sx={{ color: 'text.tertiary', fontSize: '3rem' }} />
        </Avatar>
      </Badge>
    </Tooltip>
  )
}

export default AvatarPicker
