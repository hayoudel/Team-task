import { createContext, useContext, useMemo, useState, type ReactNode } from "react";
import type { Project, ProjectMember, RoleDef, Task, User } from "../types";
import { mockProjects, mockRoles, mockTasks, mockUsers } from "../data/mockData";
import { uid } from "../utils/helpers";

interface AppContextValue {
  currentUser: User | null;
  login: (email: string) => boolean;
  logout: () => void;

  users: User[];
  addUser: (u: Omit<User, "id" | "createdAt">) => void;
  updateUser: (id: string, u: Partial<User>) => void;
  deleteUser: (id: string) => void;

  projects: Project[];
  addProject: (p: Omit<Project, "id" | "createdAt" | "createdBy" | "members">) => string;
  updateProject: (id: string, p: Partial<Project>) => void;
  deleteProject: (id: string) => void;
  addMember: (projectId: string, member: ProjectMember) => void;
  updateMemberRole: (projectId: string, userId: string, projectRole: string) => void;
  removeMember: (projectId: string, userId: string) => void;

  tasks: Task[];
  addTask: (t: Omit<Task, "id" | "createdAt" | "creatorId">) => void;
  updateTask: (id: string, t: Partial<Task>) => void;
  deleteTask: (id: string) => void;

  roles: RoleDef[];
  addRole: (name: string) => void;
  updateRole: (id: string, name: string) => void;
  deleteRole: (id: string) => void;
}

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [projects, setProjects] = useState<Project[]>(mockProjects);
  const [tasks, setTasks] = useState<Task[]>(mockTasks);
  const [roles, setRoles] = useState<RoleDef[]>(mockRoles);

  const login = (email: string) => {
    const found = users.find((u) => u.email.toLowerCase() === email.toLowerCase());
    if (found) {
      setCurrentUser(found);
      return true;
    }
    return false;
  };
  const logout = () => setCurrentUser(null);

  const addUser: AppContextValue["addUser"] = (u) => {
    setUsers((prev) => [...prev, { ...u, id: uid("u"), createdAt: new Date().toISOString().slice(0, 10) }]);
  };
  const updateUser: AppContextValue["updateUser"] = (id, u) => {
    setUsers((prev) => prev.map((x) => (x.id === id ? { ...x, ...u } : x)));
  };
  const deleteUser: AppContextValue["deleteUser"] = (id) => {
    setUsers((prev) => prev.filter((x) => x.id !== id));
    setProjects((prev) => prev.map((p) => ({ ...p, members: p.members.filter((m) => m.userId !== id) })));
  };

  const addProject: AppContextValue["addProject"] = (p) => {
    const id = uid("p");
    setProjects((prev) => [
      ...prev,
      { ...p, id, members: [], createdAt: new Date().toISOString().slice(0, 10), createdBy: currentUser?.id ?? "u1" },
    ]);
    return id;
  };
  const updateProject: AppContextValue["updateProject"] = (id, p) => {
    setProjects((prev) => prev.map((x) => (x.id === id ? { ...x, ...p } : x)));
  };
  const deleteProject: AppContextValue["deleteProject"] = (id) => {
    setProjects((prev) => prev.filter((x) => x.id !== id));
    setTasks((prev) => prev.filter((t) => t.projectId !== id));
  };
  const addMember: AppContextValue["addMember"] = (projectId, member) => {
    setProjects((prev) => prev.map((p) => (p.id === projectId ? { ...p, members: [...p.members, member] } : p)));
  };
  const updateMemberRole: AppContextValue["updateMemberRole"] = (projectId, userId, projectRole) => {
    setProjects((prev) =>
      prev.map((p) =>
        p.id === projectId
          ? { ...p, members: p.members.map((m) => (m.userId === userId ? { ...m, projectRole } : m)) }
          : p
      )
    );
  };
  const removeMember: AppContextValue["removeMember"] = (projectId, userId) => {
    setProjects((prev) =>
      prev.map((p) => (p.id === projectId ? { ...p, members: p.members.filter((m) => m.userId !== userId) } : p))
    );
  };

  const addTask: AppContextValue["addTask"] = (t) => {
    setTasks((prev) => [
      ...prev,
      { ...t, id: uid("t"), creatorId: currentUser?.id ?? "u1", createdAt: new Date().toISOString().slice(0, 10) },
    ]);
  };
  const updateTask: AppContextValue["updateTask"] = (id, t) => {
    setTasks((prev) => prev.map((x) => (x.id === id ? { ...x, ...t } : x)));
  };
  const deleteTask: AppContextValue["deleteTask"] = (id) => {
    setTasks((prev) => prev.filter((x) => x.id !== id));
  };

  const addRole: AppContextValue["addRole"] = (name) => {
    setRoles((prev) => [...prev, { id: uid("r"), name }]);
  };
  const updateRole: AppContextValue["updateRole"] = (id, name) => {
    setRoles((prev) => prev.map((r) => (r.id === id ? { ...r, name } : r)));
  };
  const deleteRole: AppContextValue["deleteRole"] = (id) => {
    setRoles((prev) => prev.filter((r) => r.id !== id));
  };

  const value = useMemo(
    () => ({
      currentUser,
      login,
      logout,
      users,
      addUser,
      updateUser,
      deleteUser,
      projects,
      addProject,
      updateProject,
      deleteProject,
      addMember,
      updateMemberRole,
      removeMember,
      tasks,
      addTask,
      updateTask,
      deleteTask,
      roles,
      addRole,
      updateRole,
      deleteRole,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [currentUser, users, projects, tasks, roles]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}
