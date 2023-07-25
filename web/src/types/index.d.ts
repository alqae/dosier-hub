namespace Models {
  type BaseModel = {
    id: number
    // created_at: string
    // updated_at: string
  }

  type User = BaseModel & {
    id: number
    name: string
    email: string
    avatar: string
    created_at: string
    updated_at: string
  }

  type Project = BaseModel & {
    id: number
    name: string
    description: string
    avatar: string
    alias: string // unique
    status: string
    initial_date: string
    final_date: string
    user: Models.User // user id
    user_id: number
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
