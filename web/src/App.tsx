import {
  createRoutesFromElements,
  createBrowserRouter,
  RouterProvider,
  Route,
  Outlet,
  Navigate,
  useNavigate,
} from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import { CssVarsProvider, ScopedCssBaseline } from '@mui/joy'

import { useAuthenticated } from '@hooks/useAuthenticated'
import theme from '@config/theme'

import ForgotPassword from '@pages/ForgotPassword'
import ProjectDetail from '@pages/ProjectDetail'
import CreateProject from '@pages/CreateProject'
import EditProject from '@pages/EditProject'
import EditUser from '@pages/EditUser'
import Projects from '@pages/Projects'
import Profile from '@pages/Profile'
import SignUp from '@pages/SignUp'
import SignIn from '@pages/SignIn'
import Users from '@pages/Users'

import AuthenticationLayout from '@components/AuthenticationLayout'
import Layout from '@components/Layout'

import '@styles/globals.scss'
import 'react-toastify/dist/ReactToastify.min.css'
import { useEffect } from 'react'

const AuthenticatedRoute = () => {
  const { isAuthenticated } = useAuthenticated()
  return isAuthenticated ? <Outlet /> : <Navigate to="/auth/sign-in" />
}

const AdminRoute = () => {
  const { userLogged } = useAuthenticated()
  const navigate = useNavigate()

  useEffect(() => {
    if (userLogged && !userLogged?.is_admin) {
      navigate('/projects')
    }
  }, [userLogged])

  return <Outlet />
}

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<Layout />} errorElement={<Navigate to="/projects" />}>
      <Route path="auth" element={<AuthenticationLayout />}>
        <Route path="sign-up" element={<SignUp />} />
        <Route path="sign-in" element={<SignIn />} />
        <Route path="forgot-password" element={<ForgotPassword />} />
      </Route>

      <Route path="/" element={<AuthenticatedRoute />}>
        {/* General Routes */}
        <Route path="profile" element={<Profile />}/>
        <Route path="projects" element={<Projects />}/>
        <Route path="projects/:projectId" element={<ProjectDetail />}/>

        {/* Admin Routes */}
        <Route element={<AdminRoute />}>
          <Route path="users" element={<Users />}/>
          <Route path="projects/new" element={<CreateProject />}/>
          <Route path="users/:userId/edit" element={<EditUser />}/>
          <Route path="projects/:projectId/edit" element={<EditProject />}/>
        </Route>
      </Route>
    </Route>
  )
)

function App() {
  return (
    <>
      <CssVarsProvider theme={theme} defaultMode="dark">
        <ScopedCssBaseline>
          <RouterProvider router={router} fallbackElement={<span>Fallback?</span>} />
        </ScopedCssBaseline>
      </CssVarsProvider>
      <ToastContainer />
    </>
  )
}

export default App
