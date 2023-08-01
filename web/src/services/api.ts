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
    getUsers: builder.query<Models.User[], void>({
      query: () => 'users',
    }),
    getUsersPaginated: builder.query<Api.PaginationResponse<Models.User[]>, Api.PaginationRequest>({
      query: (params) => ({
        url: 'users',
        params,
      }),
    }),
    getUser: builder.query<Models.User, number>({
      query: (id) => `users/${id}`,
    }),
    inviteUser: builder.mutation<Models.User, Api.User.InviteUserRequest>({
      query: (body) => ({
        url: 'users/invite',
        method: 'POST',
        body,
      }),
    }),
    deleteUser: builder.mutation<Models.User, number>({
      query: (id) => ({
        url: `users/${id}`,
        method: 'DELETE',
      }),
    }),
    updateProfile: builder.mutation<Models.User, Api.User.UpdateProfileRequest & { userId: Models.User['id'] }>({
      query: ({ userId, ...body }) => ({
        url: `users/${userId}`,
        method: 'PUT',
        body,
      }),
    }),
    updatePassword: builder.mutation<Models.User, Api.User.UpdatePasswordRequest & { userId: Models.User['id'] }>({
      query: ({ userId, ...body }) => ({
        url: `users/${userId}/password`,
        method: 'PUT',
        body,
      }),
    }),
    uploadAvatar: builder.mutation<{ success: string }, FormData>({
      query: (body) => ({
        url: 'users/avatar',
        method: 'POST',
        body,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }),
    }),
    // Projects
    getProjects: builder.query<Api.PaginationResponse<Models.Project[]>, Api.PaginationRequest>({
      query: (params) => ({
        url: 'projects',
        params,
      }),
    }),
    getProject: builder.query<Models.Project, number>({
      query: (id) => `projects/${id}`,
    }),
    createProject: builder.mutation<Models.Project, Api.Project.CreateProjectRequest>({
      query: (body) => ({
        url: 'projects',
        method: 'POST',
        body,
      }),
    }),
    updateProject: builder.mutation<Models.Project, Partial<Models.Project>>({
      query: ({ id, ...body }) => ({
        url: `projects/${id}`,
        method: 'PUT',
        body,
      }),
    }),
    deleteProject: builder.mutation<void, number>({
      query: (id) => ({
        url: `projects/${id}`,
        method: 'DELETE',
      }),
    }),
    // Projects - Tasks
    getTask: builder.query<Models.Task, number>({
      query: (id) => `tasks/${id}`,
    }),
    createTask: builder.mutation<Models.Task, Api.Project.Task.CreateTaskRequest>({
      query: (body) => ({
        url: `projects/${body.project_id}/tasks`,
        method: 'POST',
        body,
      }),
    }),
    updateTask: builder.mutation<Models.Task, Partial<Models.Task>>({
      query: ({ id, ...body }) => ({
        url: `tasks/${id}`,
        method: 'PUT',
        body,
      }),
    }),
    deleteTask: builder.mutation<void, number>({
      query: (id) => ({
        url: `/tasks/${id}`,
        method: 'DELETE',
      }),
    }),
    // Projects - Tasks - Comments
    getComments: builder.query<Models.Comment[], number>({
      query: (id) => `tasks/${id}/comments`,
    }),
    createComment: builder.mutation<Models.Comment, Api.Project.Comment.CreateCommentRequest>({
      query: (body) => ({
        url: `tasks/${body.task_id}/comments`,
        method: 'POST',
        body,
      }),
    }),
    updateComment: builder.mutation<Models.Comment, Partial<Models.Comment>>({
      query: ({ id, ...body }) => ({
        url: `comments/${id}`,
        method: 'PUT',
        body,
      }),
    }),
    deleteComment: builder.mutation<void, number>({
      query: (id) => ({
        url: `comments/${id}`,
        method: 'DELETE',
      }),
    }),
    // Tags
    getTags: builder.query<Models.Tag[], void>({
      query: () => `tags`,
    }),
    createTag: builder.mutation<Models.Tag, Api.Tag.CreateTagRequest>({
      query: (body) => ({
        url: 'tags',
        method: 'POST',
        body,
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
  useGetUsersQuery,
  useGetUsersPaginatedQuery,
  useGetUserQuery,
  useLazyGetUserLoggedQuery,
  useLazyGetUserQuery,
  useUpdateProfileMutation,
  useUpdatePasswordMutation,
  useUploadAvatarMutation,
  useInviteUserMutation,
  useDeleteUserMutation,
  // Projects
  useGetProjectsQuery,
  useGetProjectQuery,
  useCreateProjectMutation,
  useUpdateProjectMutation,
  useDeleteProjectMutation,
  // Projects - Tasks
  useGetTaskQuery,
  useLazyGetTaskQuery,
  useCreateTaskMutation,
  useUpdateTaskMutation,
  useDeleteTaskMutation,
  // Projects - Tasks - Comments
  useGetCommentsQuery,
  useCreateCommentMutation,
  useUpdateCommentMutation,
  useDeleteCommentMutation,
  // Tags
  useGetTagsQuery,
  useCreateTagMutation,
} = api
