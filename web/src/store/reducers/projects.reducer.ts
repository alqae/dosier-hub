import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'

interface ProjectsState {
}

const initialState: ProjectsState = {
}

export const uploadAvatarProject = createAsyncThunk<void, { file: File, projectId: Models.Project['id'] }>(
  'projects/uploadAvatarProject',
  async ({ file, projectId }) => {
    const apiURL = import.meta.env.API_URL || 'http://localhost:8000'
    const body = new FormData()
    body.append('avatar', file, file.name)
    const headers = new Headers()
    headers.set('Accept', 'application/json') // This is important to work with Laravel
    headers.set('Authorization', `Bearer ${localStorage.getItem('token')}`)
    const response = await fetch(
      `${apiURL}/api/projects/${projectId}/avatar`,
      { headers, method: 'POST', body }
    )
    const data = await response.json()
    return data
  }
)

const ProjectsSlice = createSlice({
  name: 'projects',
  initialState,
  reducers: {
    // setProjects: (state, action: PayloadAction<Models.Project[]>) => {
    //   state.projects = action.payload
    // },
  },
})

export const {  } = ProjectsSlice.actions
export default ProjectsSlice.reducer
