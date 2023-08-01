import { useEffect } from 'react'
import { useSelector } from 'react-redux'

import { RootState, setUserLogged, useAppDispatch } from '@store'
import { useLazyGetUserLoggedQuery } from '@/services/api'

export const useAuthenticated = (): {
  isAuthenticated: boolean
  userLogged?: Models.User
} => {
  const [trigger, { data }] = useLazyGetUserLoggedQuery()
  const token = useSelector<RootState, RootState['auth']['token']>((state) => state.auth.token)
  const userLogged = useSelector<RootState, Models.User | undefined>((state) => state.profile.userLogged)
  const dispatch = useAppDispatch()
  useEffect(() => {
    if (!userLogged) {
      trigger()
    }
  }, [trigger, userLogged])

  useEffect(() => {
    if (data) {
      dispatch(setUserLogged({
        ...data,
        is_admin: Boolean(data.is_admin)
      }))
    }
  }, [data])

  return {
    isAuthenticated: Boolean(token),
    userLogged,
  }
}
