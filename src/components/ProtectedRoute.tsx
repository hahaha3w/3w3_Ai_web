import { useAuth } from "@/hooks/useAuth";
import { ReactNode } from "react";

interface ProtectedRouteProps {
  children: ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  // 使用useAuth hook进行认证检查
  useAuth();
  
  return <>{children}</>;
};

export default ProtectedRoute;
