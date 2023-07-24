import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
import { RootState } from '../store'

interface ProfileState {
  userLogged?: Models.User
}

const initialState: ProfileState = {
}

export const uploadAvatar = createAsyncThunk<void, File>(
  'profile/uploadAvatar',
  async (file, { dispatch, getState }) => {
    const apiURL = import.meta.env.API_URL || 'http://localhost:8000'
    const body = new FormData()
    body.append('avatar', file, file.name)
    const headers = new Headers()
    headers.set('Accept', 'application/json') // This is important to work with Laravel
    headers.set('Authorization', `Bearer ${localStorage.getItem('token')}`)
    const response = await fetch(`${apiURL}/api/users/avatar`, { headers, method: 'POST', body })
    const data = await response.json()
    const state = getState() as RootState
    const userLogged = state.profile.userLogged as Models.User
    dispatch(setUserLogged({ ...userLogged, avatar: data.success }))
    return
  }
)


const ProfileSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: {
    setUserLogged: (state, action: PayloadAction<Models.User | undefined>) => {
      state.userLogged = action.payload
    },
    clearUserLogged: (state) => {
      state.userLogged = undefined
    }
  },
})

export const { setUserLogged, clearUserLogged } = ProfileSlice.actions
export default ProfileSlice.reducer
