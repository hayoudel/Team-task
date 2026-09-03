import { Navigate } from "react-router-dom";
import { useApp } from "../context/AppContext";

interface ProtectedRouteProps {
  children: React.ReactNode;
  adminOnly?: boolean;
}

export default function ProtectedRoute({ children, adminOnly = false }: ProtectedRouteProps) {
  const { currentUser, isLoadingAuth } = useApp();

  // Tant qu'on n'a pas la réponse de /users/me, on n'affiche rien ni ne redirige.
  if (isLoadingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <p className="text-sm text-slate-400">Chargement...</p>
      </div>
    );
  }

  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  // Vu que c'est le back-office, on protège aussi contre un utilisateur
  // non-admin qui arriverait ici avec un cookie valide mais le mauvais rôle.
  if (adminOnly && currentUser.role !== "admin") {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}