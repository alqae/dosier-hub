import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

import type { RootState } from '@store'

// Define a service using a base URL and expected endpoints
export const api = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: (import.meta.env.API_URL || 'http://localhost:8000').concat('/api'),
    prepareHeaders(headers, api) {
      const state = api.getState() as RootState
      const token = state.auth.token ?? localStorage.getItem('token')
      headers.set('Content-Type', 'application/json')
      headers.set('Accept', 'application/json')
      if (token) headers.set('Authorization', `Bearer ${token}`)
      return headers
    },
    responseHandler: async (response) => {
      const json = await response.json()
      if (response.ok) return json
      return Promise.reject(json?.message)
    },
    validateStatus: (response) => {
      return response.status != 200 || response.status.toString() != "OK"
    },
  }),
  endpoints: (builder) => ({
    // Profile
    getUserLogged: builder.query<Models.User, void>({
      query: () => 'whoami',
    }),
    // Authentication
    signIn: builder.mutation<Api.Auth.AuthenticatedResponse, Api.Auth.SignInRequest>({
      query: (body) => ({
        url: 'sign-in',
        method: 'POST',
        body,
      }),
    }),
    signUp: builder.mutation<Api.Auth.AuthenticatedResponse, Api.Auth.SignUpRequest>({
      query: (body) => ({
        url: 'sign-up',
        method: 'POST',
        body,
      }),
    }),
    signOut: builder.mutation<void, void>({
      query: () => ({
        url: 'sign-out',
        method: 'POST',
      }),
    }),
    forgotPassword: builder.mutation<Api.Auth.ForgotPasswordResponse, Api.Auth.ForgotPasswordRequest>({
      query: (body) => ({
        url: 'password/email',
        method: 'POST',
        body: body,
      }),
    }),
    resetPassword: builder.mutation<Api.Auth.ResetPasswordResponse, Api.Auth.ResetPasswordRequest>({
      query: (body) => ({
        url: 'password/reset',
        method: 'POST',
        body: body,
      }),
    }),
    // Users
    uploadAvatar: builder.mutation<Api.Response<Models.User>, FormData>({
      query: (body) => ({
        url: 'users/avatar',
        method: 'POST',
        body,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }),
    }),
  }),
})
    

// Export hooks for usage in function components, which are
// auto-generated based on the defined endpoints
export const {
  // Profile
  useGetUserLoggedQuery,
  // Authentication
  useSignUpMutation,
  useSignInMutation,
  useForgotPasswordMutation,
  useResetPasswordMutation,
  // Users
  useUploadAvatarMutation,
} = api