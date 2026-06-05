import { useAuth } from "./context/authContext";
import { Navigate } from "react-router-dom";
import { PageLoader } from "./components/LoadingSkeletons";

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) return <PageLoader />;
  if (!user)   return <Navigate to="/login" replace />;

  return children;
}