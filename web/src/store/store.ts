import logger from 'redux-logger'
import { toast } from 'react-toastify'
import { persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import thunk, { ThunkDispatch } from 'redux-thunk'
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux'
import {
  configureStore,
  combineReducers,
  MiddlewareAPI,
  Middleware,
  isRejectedWithValue,
  AnyAction,
  Store
} from '@reduxjs/toolkit'

import { api } from '@services/api'

import authReducer from './reducers/auth.reducer'
import profileReducer from './reducers/profile.reducer'

const reducer = combineReducers({
  auth: authReducer,
  profile: profileReducer,
  [api.reducerPath]: api.reducer,
})

export const httpErrorInterceptor: Middleware = (_: MiddlewareAPI) => (next) => (action) => {
  if (isRejectedWithValue(action)) {
    const message = action.payload?.error ?? 'Something went wrong'
    toast.error(message)
  }

  return next(action)
}

const middleware = [
  thunk,
  ...(
    import.meta.env.NODE_ENV !== 'production' ?
      [
        /* Development middleware */
        logger,
      ] : [
        /* Production middleware */
      ]
  ),
  api.middleware,
  httpErrorInterceptor,
]

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['auth'],
}

const persistedReducer = persistReducer(persistConfig, reducer)

export const store = configureStore({
  reducer: persistedReducer,
  middleware,
  devTools: import.meta.env.NODE_ENV !== 'production',
})

// 1. Get the root state's type from reducers
export type RootState = ReturnType<typeof store.getState>
// 2. Create a type for thunk dispatch
export type AppThunkDispatch = ThunkDispatch<RootState, any, AnyAction>
// 3. Create a type for store using RootState and Thunk enabled dispatch
export type AppStore = Omit<Store<RootState, AnyAction>, "dispatch"> & {
  dispatch: AppThunkDispatch;
};
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
// export type AppDispatch = typeof store.dispatch

// you can also create some redux hooks using the above explicit types
export const useAppDispatch = () => useDispatch<AppThunkDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
