import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { AppProvider, useApp } from "./context/AppContext";
import ProtectedRoute from "./components/ProtectedRoute";

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
  const { currentUser } = useApp();

  return (
    <Routes>
      <Route
        path="/"
        element={<Navigate to={currentUser ? "/admin/dashboard" : "/login"} replace />}
      />

      <Route
        path="/login"
        element={currentUser ? <Navigate to="/admin/dashboard" replace /> : <Login />}
      />

      <Route
        path="/admin"
        element={
          <ProtectedRoute>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/admin/dashboard" replace />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="users" element={<Users />} />
        <Route path="projects" element={<Projects />} />
        <Route path="project/:id" element={<ProjectDetail />} />
        <Route path="tasks" element={<Tasks />} />
        <Route path="assignments" element={<Assignments />} />
        <Route path="roles" element={<Roles />} />
        <Route path="profile" element={<Profile />} />
      </Route>

      <Route path="*" element={<Navigate to="/login" replace />} />
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