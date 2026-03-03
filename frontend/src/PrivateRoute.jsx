// src/PrivateRoute.jsx
import { Navigate } from 'react-router-dom'
import { useAuth } from './context/AuthContext'

const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth()
  console.log("PrivateRoute - loading:", loading, "user:", user);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-600"></div>
      </div>
    )
  }

  return user ? children : <Navigate to="/" replace />
}

export default PrivateRoute
