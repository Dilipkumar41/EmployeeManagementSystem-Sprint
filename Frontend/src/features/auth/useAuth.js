import { useSelector } from 'react-redux'

export const ROLES = {
  HR: 'HR',
  MANAGER: 'Manager',
  EMPLOYEE: 'Employee',
}

const useAuth = () => {
  const { token, user, role, status, error } = useSelector((s) => s.auth || {})

  return {
    isAuthenticated: !!token,
    token,
    user,
    role,
    status,
    error,
    isHR: role === ROLES.HR,
    isManager: role === ROLES.MANAGER,
    isEmployee: role === ROLES.EMPLOYEE,
  }
}

export default useAuth
