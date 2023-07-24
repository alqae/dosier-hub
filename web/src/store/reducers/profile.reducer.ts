import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'

interface ProfileState {
  userLogged?: Models.User
}

const initialState: ProfileState = {
}

export const uploadAvatar = createAsyncThunk<void, File>(
  'profile/uploadAvatar',
  async (file) => {
    const apiURL = import.meta.env.API_URL || 'http://localhost:8000'
    const body = new FormData()
    body.append('avatar', file, file.name)
    const headers = new Headers()
    // headers.set('Content-Type', 'multipart/form-data')
    headers.set('Accept', 'application/json')
    headers.set('Authorization', `Bearer ${localStorage.getItem('token')}`)
    const response = await fetch(`${apiURL}/api/users/avatar`, { headers, method: 'POST', body })
    console.warn('response', response);
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
