import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
import { RootState } from '../store'

interface ProfileState {
  userLogged?: Models.User
}

const initialState: ProfileState = {
}

export const uploadAvatarUser = createAsyncThunk<void, [number | undefined, File]>(
  'profile/uploadAvatar',
  async ([id, file], { dispatch, getState }) => {
    const apiURL = import.meta.env.API_URL || 'http://localhost:8000'
    const body = new FormData()
    body.append('avatar', file, file.name)
    const headers = new Headers()
    headers.set('Accept', 'application/json') // This is important to work with Laravel
    headers.set('Authorization', `Bearer ${localStorage.getItem('token')}`)
    const url = `${apiURL}/api/users${id ? `/${id}` : ''}/avatar`
    const response = await fetch(url, { headers, method: 'POST', body })
    if (!id) {
      const data = await response.json()
      const state = getState() as RootState
      const userLogged = state.profile.userLogged as Models.User
      dispatch(setUserLogged({
        ...userLogged,
        avatar: data.success,
        is_admin: Boolean(userLogged.is_admin)
      }))
    }
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
