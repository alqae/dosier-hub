import { useSelector } from 'react-redux'

import { RootState, setUserLogged, useAppDispatch } from '@store'

export const useAuthenticated = (): {
  isAuthenticated: boolean
  userLogged?: Models.User
} => {
  const token = useSelector<RootState, RootState['auth']['token']>((state) => state.auth.token)
  var userLogged = useSelector<RootState, Models.User | undefined>((state) => state.profile.userLogged)
  const dispatch = useAppDispatch()
  if (!userLogged && token) {
    const apiURL = import.meta.env.API_URL || 'http://localhost:8000'
    const headers = new Headers()
    headers.set('Authorization', `Bearer ${token}`)
    fetch(`${apiURL}/api/whoami`, { headers })
      .then<Api.Response<Models.User | undefined>>(res => res.json())
      .then(res => {
        userLogged = res.data
        dispatch(setUserLogged(res.data))
      })
  }
  return {
    isAuthenticated: !!token,
    userLogged,
  }
}
