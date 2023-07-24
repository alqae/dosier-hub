namespace Models {
  type User = {
    id: number
    name: string
    email: string
    avatar: string
    created_at: string
    updated_at: string
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
    // Sign In
    // type SignInResponse = {
    //   user: Models.User
    //   token: string
    // }
    type AuthenticatedResponse = {
      user: Models.User
      token: string
    }
    type SignInRequest = {
      email: string
      password: string
    }
    // Sign Up
    // type SignUpResponse = SignInResponse
    type SignUpRequest = {
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
}
