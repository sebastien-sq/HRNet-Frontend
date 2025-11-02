import { configureStore } from '@reduxjs/toolkit'
import employeesReducer from '../slices/EmployeeSlice'
import { persistStore, persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage'

const persistConfig = {
  key: 'employees',
  storage,
}
const persistedReducer = persistReducer(persistConfig, employeesReducer)

export const store = configureStore({
  reducer: {
    employees: persistedReducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware({
  serializableCheck: {
    ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
    ignoredPaths: ['employees._persist'],
  },
}),
  devTools: import.meta.env.ENVIRONMENT === 'development',
})
export const persistor = persistStore(store)

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch 