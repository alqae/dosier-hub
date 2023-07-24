import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'

import { setUserLogged } from './profile.reducer'

interface AuthState {
  token?: string | null
}

const initialState: AuthState = {
  token: localStorage.getItem('token'),
}

export const signInSuccess = createAsyncThunk<void, Api.Auth.AuthenticatedResponse>(
  'auth/signInSuccess',
  async (payload, { dispatch }) => {
    dispatch(setUserLogged(payload.user))
    dispatch(setToken(payload.token))
    return
  }
)

export const signOut = createAsyncThunk<void, void>(
  'auth/signOut',
  async (_, { dispatch }) => {
    const apiURL = import.meta.env.API_URL || 'http://localhost:8000'
    const headers = new Headers()
    headers.set('Content-Type', 'application/json')
    headers.set('Accept', 'application/json')
    headers.set('Authorization', `Bearer ${localStorage.getItem('token')}`)
    await fetch(`${apiURL}/api/sign-out`, { headers, method: 'POST' })
    dispatch(clearToken())
    dispatch(setUserLogged(undefined))
    return
  }
)

const AuthSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setToken(state, action: PayloadAction<string>) {
      localStorage.setItem('token', action.payload)
      state.token = action.payload
    },
    clearToken(state) {
      localStorage.removeItem('token')
      state.token = null
    }
  },
})

export const { setToken, clearToken } = AuthSlice.actions
export default AuthSlice.reducer
