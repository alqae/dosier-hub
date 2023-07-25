import React from 'react'

import ProjectForm, { IProjectForm } from '@components/ProjectForm'

import { useAppDispatch, uploadAvatarProject } from '@store'
import { useGetProjectQuery, useUpdateProjectMutation } from '@services/api'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import Typography from '@mui/joy/Typography'

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
    const response = await updateProject({ ...values, id: project.id })
    if ('error' in response) return
    console.warn('response', response)
    if (avatar) {
      dispatch(uploadAvatarProject({ file: avatar, projectId: response.data.id }))
    }

    return navigate(`/projects/${response.data.id}`, { replace: true })
  }

  return (
    <>
      <Typography level="h2">Edit - {project?.name}</Typography>
      <ProjectForm onSubmit={onUpdateProject} defaultValue={project} />
    </>
  )
}

export default EditProject
