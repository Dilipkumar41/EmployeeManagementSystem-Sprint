import { combineReducers } from '@reduxjs/toolkit'
import authReducer from '../features/auth/authSlice'
import meReducer from '../features/me/meSlice'
import employeesReducer from '../features/employees/employeesSlice'
import departmentsReducer from '../features/departments/departmentsSlice'
import leavesReducer from '../features/leaves/leavesSlice'
import usersReducer from '../features/users/usersSlice'
import rolesReducer from '../features/roles/rolesSlice'

const rootReducer = combineReducers({
   auth: authReducer,
  employees: employeesReducer,
  leaves: leavesReducer,
  departments: departmentsReducer,
  users: usersReducer,
  roles: rolesReducer,
  me: meReducer,
})

export default rootReducer