import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { getDashboardPathByRole, normalizeRole } from '../utils/auth'

const ProtectedRoute = ({ allowedRole, children }) => {
  const { isAuthenticated, user } = useAuth()

  const storedRole = normalizeRole(localStorage.getItem('userRole')) || normalizeRole(user?.role)
  const token = localStorage.getItem('userToken') || localStorage.getItem('lms-token')

  if (!isAuthenticated || !token || !storedRole) {
    return <Navigate to="/" replace />
  }

  const requiredRole = normalizeRole(allowedRole)
  if (requiredRole && storedRole !== requiredRole) {
    return <Navigate to={getDashboardPathByRole(storedRole)} replace />
  }

  return children
}

export default ProtectedRoute
