import { useTokenStore } from "@/store/token"
import { useEffect } from "react"
import { useNavigate, useNavigation } from "react-router"

export const useAuth = () => {
  const token = useTokenStore()
  const navigate = useNavigate()
  useEffect(() => {
    if (!token.token) {
      navigate("/auth/login")
    }
    
  }, [token.token, navigate]) 
}