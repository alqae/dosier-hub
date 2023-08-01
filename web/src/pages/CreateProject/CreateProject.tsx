import React from 'react'
import { toast } from 'react-toastify'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'

import Typography from '@mui/joy/Typography'

import ProjectForm, { type IProjectForm } from '@components/ProjectForm'
import { useAppDispatch, uploadAvatarProject } from '@store'
import { useCreateProjectMutation } from '@services/api'
import { fromStringtoSqlTimestamp } from '@utils'

interface ICreateProjectProps {
  children?: React.ReactNode
}

const CreateProject: React.FC<ICreateProjectProps> = () => {
  const [createProject] = useCreateProjectMutation()
  const dispatch = useAppDispatch()
  const navigate = useNavigate()

  const onCreateProject = async (values: IProjectForm, avatar?: File) => {
    const response = await createProject({
      ...values,
      initial_date: fromStringtoSqlTimestamp(values.initial_date),
      final_date: fromStringtoSqlTimestamp(values.final_date),
    })
    if ('error' in response) return
    if (avatar) {
      dispatch(uploadAvatarProject({ file: avatar, projectId: response.data.id }))
    }
    toast.success('Project created successfully')
    return navigate(`/projects/${response.data.id}`)
  }

  return (
    <>
      <Typography
        level="h2"
        component={motion.h2}
        initial={{ x: '-100%' }}
        animate={{ x: 0 }}
        transition={{ duration: 0.75 }}
      >
        Create Project
      </Typography>
      <ProjectForm onSubmit={onCreateProject} />
    </>
  )
}

export default CreateProject
