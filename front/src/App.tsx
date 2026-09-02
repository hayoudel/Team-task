import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { AppProvider, useApp } from "./context/AppContext";

import { AdminLayout } from "./components/layout/AdminLayout";
import { Login } from "./pages/Login";
import { Dashboard } from "./pages/Dashboard";
import { Users } from "./pages/Users";
import { Projects } from "./pages/Projects";
import { ProjectDetail } from "./pages/ProjectDetail";
import { Tasks } from "./pages/Tasks";
import { Assignments } from "./pages/Assignments";
import { Roles } from "./pages/Roles";
import { Profile } from "./pages/Profile";

function AppRoutes() {
  const { currentUser, isLoadingAuth } = useApp();

  // On attend que /me ait terminé
  if (isLoadingAuth) {
    return <div>Chargement...</div>;
  }

  return (
    <Routes>
      <Route
        path="/"
        element={
          currentUser
            ? <Navigate to="/admin/dashboard" replace />
            : <Navigate to="/login" replace />
        }
      />

      <Route
        path="/login"
        element={
          currentUser
            ? <Navigate to="/admin/dashboard" replace />
            : <Login />
        }
      />

      <Route
        path="/admin"
        element={
          currentUser
            ? <AdminLayout />
            : <Navigate to="/login" replace />
        }
      >
        <Route
          index
          element={<Navigate to="/admin/dashboard" replace />}
        />

        <Route path="dashboard" element={<Dashboard />} />
        <Route path="users" element={<Users />} />
        <Route path="projects" element={<Projects />} />
        <Route path="project/:id" element={<ProjectDetail />} />
        <Route path="tasks" element={<Tasks />} />
        <Route path="assignments" element={<Assignments />} />
        <Route path="roles" element={<Roles />} />
        <Route path="profile" element={<Profile />} />
      </Route>

      <Route
        path="*"
        element={<Navigate to="/login" replace />}
      />
    </Routes>
  );
}

function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AppProvider>
  );
}

export default App;