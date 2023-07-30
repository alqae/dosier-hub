import React from 'react'
import { toast } from 'react-toastify'
import { useNavigate, useParams } from 'react-router-dom'

import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import Typography from '@mui/joy/Typography'
import Button from '@mui/joy/Button'

import { useGetProjectQuery, useUpdateProjectMutation } from '@services/api'
import ProjectForm, { type IProjectForm } from '@components/ProjectForm'
import { useAppDispatch, uploadAvatarProject } from '@store'

interface IEditProjectProps {
  children?: React.ReactNode
}

const EditProject:React.FC<IEditProjectProps> = () => {
  const [updateProject] = useUpdateProjectMutation()
  const { projectId } = useParams()
  const { data: project } = useGetProjectQuery(Number(projectId), { skip: !projectId, refetchOnMountOrArgChange: true })
  const dispatch = useAppDispatch()
  const navigate = useNavigate()

  const onUpdateProject = async (values: IProjectForm, avatar: File | undefined) => {
    const response = await updateProject({ ...values, id: project?.id as number })
    if ('error' in response) return
    if (avatar) {
      dispatch(uploadAvatarProject({ file: avatar, projectId: response.data.id }))
    }
    toast.success('Project updated successfully')
    return navigate(`/projects/${response.data.id}`, { replace: true })
  }

  return (
    <>
      <Button
        variant="plain"
        startDecorator={<ArrowBackIcon />}
        onClick={() => navigate(`/projects/${project?.id}`)}
      >
        Go Back
      </Button>
      <Typography level="h2">Edit - {project?.name}</Typography>
      <ProjectForm onSubmit={onUpdateProject} defaultValue={project} />
    </>
  )
}

export default EditProject
