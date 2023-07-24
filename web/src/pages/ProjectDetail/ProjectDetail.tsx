import React from 'react'
import { useParams } from 'react-router-dom'

interface IProjectDetailProps {
  children?: React.ReactNode
}

const ProjectDetail:React.FC<IProjectDetailProps> = () => {
  const { projectId } = useParams()
  return (
    <>
      ProjectDetail {projectId}
    </>
  )
}

export default ProjectDetail
