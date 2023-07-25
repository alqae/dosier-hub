namespace Models {
  type BaseModel = {
    id: number
    // created_at: string
    // updated_at: string
  }

  type User = BaseModel & {
    name: string
    email: string
    avatar: string
    created_at: string
    updated_at: string
    is_admin: boolean
  }

  type Project = BaseModel & {
    name: string
    description: string
    avatar: string
    alias: string // unique
    status: string
    initial_date: string
    final_date: string
    user: Models.User // user id
    user_id: number
    tasks: Models.Task[] // task id
  }

  type Task = BaseModel & {
    name: string
    description: string
    alias: string
    status: string
    initial_date: string
    final_date: string
    time_spend: string
    project: Models.Project
    project_id: number
    parent_task_id: number
    users: Models.User[]
    users_ids: number[]
    tasks: Models.Task[]
  }
}

/*
  * Api
  * Here we can define the types of the responses from the API
  * We can use this types in the reducers to define the types of the actions
  * and in the components to define the types of the props
  */
namespace Api {
  // Generic types
  type Response<T> = {
    data: T
  }

  type Error = {
    error: string
    message: string
  }

  // Authentication
  namespace Auth {
    type AuthenticatedResponse = {
      user: Models.User
      token: string
    }
    // Sign In
    type SignInRequest = {
      email: string
      password: string
    }
    type SignUpRequest = {
    // Sign Up
      name: string
      email: string
      password: string
    }
    // Forgot Password
    type ForgotPasswordResponse = Response<void>
    type ForgotPasswordRequest = {
      email: string
    }
    // Reset Password
    type ResetPasswordResponse = Response<void>
    type ResetPasswordRequest = {
      token: string
      password: string
    }
  }
  // Projects
  namespace Project {
    // Create Project
    type CreateProjectRequest = {
      name: string
      description: string
      // avatar: File
      alias: string
      status: string
      initial_date: string
      final_date: string
    }

    namespace Task {
      type CreateTaskRequest = {
        name: string
        description: string | undefined
        alias: string | undefined
        status: TaskStatus
        initial_date: string | undefined
        final_date: string | undefined
        time_spend: string | undefined
        users_ids: number[]
        parent_task_id: number | undefined
        project_id: number
      }
    }
  }
  // Users
  namespace User {
    type UpdateProfileRequest = { 
      name: string
      email: string
    }
    type UpdatePasswordRequest = {
      password: string
    }
  }   
}
