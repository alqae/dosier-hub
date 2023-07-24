import {
  createRoutesFromElements,
  createBrowserRouter,
  RouterProvider,
  Route,
  Outlet,
  Navigate,
} from 'react-router-dom'
import { CssVarsProvider, ScopedCssBaseline } from '@mui/joy'

import { useAuthenticated } from '@hooks/useAuthenticated'
import theme from '@config/theme'

import ForgotPassword from '@pages/ForgotPassword'
import SignUp from '@pages/SignUp'
import SignIn from '@pages/SignIn'
import Home from '@pages/Home'

import AuthenticationLayout from '@components/AuthenticationLayout'
import Layout from '@components/Layout'

import '@styles/globals.scss'
// import 'animate.css/animate.css'

const AuthenticatedRoute = () => {
  const { isAuthenticated } = useAuthenticated()
  return isAuthenticated ? <Outlet /> : <Navigate to="/auth/sign-in" />
}

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<Layout />}>
      <Route path="auth" element={<AuthenticationLayout />}>
        <Route path="sign-up" element={<SignUp />} />
        <Route path="sign-in" element={<SignIn />} />
        <Route path="forgot-password" element={<ForgotPassword />} />
      </Route>

      <Route path="/" element={<AuthenticatedRoute />}>
        <Route path="/" element={<Home />}/>
      </Route>
    </Route>
  )
)

function App() {
  return (
    <CssVarsProvider theme={theme} defaultMode="dark">
      <ScopedCssBaseline>
        <RouterProvider router={router} fallbackElement={<span>Fallback?</span>} />
      </ScopedCssBaseline>
    </CssVarsProvider>
  )
}

export default App