import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import api from "../api/axios";


function ProtectedRoute({ children } : { children: React.ReactNode }) {
  // check for load state of the authentication
  // first variable is the current state the second one is the setter of the state 
  const [isLoading, setIsLoading] = useState(true);
  // check if the state is authenticated
  // useState default is the one initialize in its parameter
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        await api.get('/auth/me')
        setIsAuthenticated(true);
      } catch {
        setIsAuthenticated(false)
      } finally {
        setIsLoading(false);
      }
    }

    checkAuth()
  }, []);

  if (isLoading) {
    return <div>Loading...</div>
  }

  if (!isAuthenticated) {
    return <Navigate to='/login'/>
  } 

  return <>{children}</>
}

export default ProtectedRoute