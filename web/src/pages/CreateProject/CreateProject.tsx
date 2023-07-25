import React from 'react'
import { useNavigate } from 'react-router-dom'

import Typography from '@mui/joy/Typography'

import ProjectForm, { IProjectForm } from '@components/ProjectForm'
import { useAppDispatch, uploadAvatarProject } from '@store'
import { useCreateProjectMutation } from '@services/api'

interface ICreateProjectProps {
  children?: React.ReactNode
}

const CreateProject: React.FC<ICreateProjectProps> = () => {
  const [createProject] = useCreateProjectMutation()
  const dispatch = useAppDispatch()
  const navigate = useNavigate()

  const onCreateProject = async (values: IProjectForm, avatar: File | undefined) => {
    console.warn('onCreateProject', values)
    const response = await createProject(values)
    if ('error' in response) return
    console.warn('response', response)
    if (avatar) {
      dispatch(uploadAvatarProject({ file: avatar, projectId: response.data.id }))
    }
    return navigate(`/projects/${response.data.id}`)
  }

  return (
    <>
      <Typography level="h2">Create Project</Typography>
      <ProjectForm onSubmit={onCreateProject} />
    </>
  )
}

export default CreateProject
