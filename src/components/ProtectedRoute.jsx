import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = ({ allowedRoles }) => {
  const userStored = localStorage.getItem("user");
  const user = userStored ? JSON.parse(userStored) : null;

  // 1. Si pas de session, retour au login
  if (!user) return <Navigate to="/" replace />;

  // 2. Si des rôles sont définis, vérifier si l'utilisateur en possède un
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // Si l'utilisateur n'a pas le bon rôle, on le renvoie au dashboard
    return <Navigate to="/dashboard" replace />;
  }

  // 3. Accès autorisé
  return <Outlet />;
};

export default ProtectedRoute;