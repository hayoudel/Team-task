import { createContext, useContext, useState, useCallback, ReactNode } from "react";
import { apiFetch, ApiError } from "../api/clients";
import { Project, GetAllProjectsResponse, GetOneProjectResponse } from "../types/project";
import { User, LoginPayload, RegisterPayload, LoginResponse, RegisterResponse } from "../types/user";
import {
  Task,
  CreateTaskPayload,
  UpdateTaskPayload,
  GetTasksByProjectResponse,
  CreateTaskResponse,
  UpdateTaskResponse,
} from "../types/task";
import { ProjectMember, GetProjectMembersResponse } from "../types/projectMember";
import { ChatMessage } from "../types/message";
import { useEffect } from "react";

interface AppContextValue {
  // Auth
  user: User | null;
  authLoading: boolean;
  authChecked: boolean;
  authError: string | null;
  login: (payload: LoginPayload) => Promise<boolean>;
  register: (payload: RegisterPayload) => Promise<boolean>;
  logout: () => Promise<void>;

  // Projects (liste)
  projects: Project[];
  projectsLoading: boolean;
  projectsError: string | null;
  fetchProjects: (userId:string| number) => Promise<void>;

  // Projet courant (détail)
  currentProject: Project | null;
  projectLoading: boolean;
  projectError: string | null;
  fetchProject: (id: string | number) => Promise<void>;

  // Membres du projet courant
  projectMembers: ProjectMember[];
  membersLoading: boolean;
  membersError: string | null;
  fetchProjectMembers: (projectId: string | number) => Promise<void>;

  // Tâches du projet courant
  projectTasks: Task[];
  tasksLoading: boolean;
  tasksError: string | null;
  fetchProjectTasks: (projectId: string | number) => Promise<void>;
  createTask: (payload: CreateTaskPayload) => Promise<boolean>;
  updateTask: (id: number, payload: UpdateTaskPayload) => Promise<boolean>;
  updateTaskStatus: (id: number, statut: string) => Promise<boolean>;
  deleteTask: (id: number) => Promise<boolean>;
  taskActionError: string | null;

  messages: ChatMessage[];
messagesLoading: boolean;
messagesError: string | null;
fetchMessages: (projectId: string | number) => Promise<void>;
addLocalMessage: (message: ChatMessage) => void; // pour insérer un message reçu par socket
}

const AppContext = createContext<AppContextValue | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(false);
  const [authChecked, setAuthChecked] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  const [projects, setProjects] = useState<Project[]>([]);
  const [projectsLoading, setProjectsLoading] = useState(false);
  const [projectsError, setProjectsError] = useState<string | null>(null);

  const [currentProject, setCurrentProject] = useState<Project | null>(null);
  const [projectLoading, setProjectLoading] = useState(false);
  const [projectError, setProjectError] = useState<string | null>(null);

  const [projectMembers, setProjectMembers] = useState<ProjectMember[]>([]);
  const [membersLoading, setMembersLoading] = useState(false);
  const [membersError, setMembersError] = useState<string | null>(null);

  const [projectTasks, setProjectTasks] = useState<Task[]>([]);
  const [tasksLoading, setTasksLoading] = useState(false);
  const [tasksError, setTasksError] = useState<string | null>(null);
  const [taskActionError, setTaskActionError] = useState<string | null>(null);

  const [messages, setMessages] = useState<ChatMessage[]>([]);
const [messagesLoading, setMessagesLoading] = useState(false);
const [messagesError, setMessagesError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const data = await apiFetch<{ message: string; user: User }>("/users/me");
        setUser(data.user);
      } catch {
        setUser(null);
      } finally {
        setAuthChecked(true);
      }
    })();
  }, []);

  const login = useCallback(async (payload: LoginPayload) => {
    setAuthLoading(true);
    setAuthError(null);
    try {
      const data = await apiFetch<LoginResponse>("/users/login", {
        method: "POST",
        body: JSON.stringify(payload),
      });
      setUser(data.user);
      return true;
    } catch (err) {
      setAuthError(err instanceof ApiError ? err.message : "Échec de la connexion.");
      return false;
    } finally {
      setAuthLoading(false);
    }
  }, []);

  const register = useCallback(async (payload: RegisterPayload) => {
    setAuthLoading(true);
    setAuthError(null);
    try {
      await apiFetch<RegisterResponse>("/users", {
        method: "POST",
        body: JSON.stringify(payload),
      });
      const loginData = await apiFetch<LoginResponse>("/users/login", {
        method: "POST",
        body: JSON.stringify({ email: payload.email, motDePasse: payload.motDePasse }),
      });
      setUser(loginData.user);
      return true;
    } catch (err) {
      setAuthError(err instanceof ApiError ? err.message : "Échec de l'inscription.");
      return false;
    } finally {
      setAuthLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await apiFetch("/users/logout", { method: "POST" });
    } finally {
      setUser(null);
      setProjects([]);
      setCurrentProject(null);
      setProjectMembers([]);
      setProjectTasks([]);
    }
  }, []);

  const fetchProjects = useCallback(async (userId: string |  number) => {
    if (!userId) return;
    setProjectsLoading(true);
    setProjectsError(null);
    try {
      const data = await apiFetch<GetAllProjectsResponse>(`/projectUser/user/${userId}`);
      setProjects(data.project);
    } catch (err) {
      setProjectsError(err instanceof ApiError ? err.message : "Impossible de charger les projets.");
    } finally {
      setProjectsLoading(false);
    }
  }, []);

 useEffect(() => {
  if (user) {
    fetchProjects(String(user.id));
  }
}, [user, fetchProjects]);

  const fetchProject = useCallback(async (id: string | number) => {
    setProjectLoading(true);
    setProjectError(null);
    try {
      const data = await apiFetch<GetOneProjectResponse>(`/projects/${id}`);
      setCurrentProject(data.project);
    } catch (err) {
      setProjectError(err instanceof ApiError ? err.message : "Impossible de charger le projet.");
    } finally {
      setProjectLoading(false);
    }
  }, []);

  const fetchProjectMembers = useCallback(async (projectId: string | number) => {
    setMembersLoading(true);
    setMembersError(null);
    try {
      const data = await apiFetch<GetProjectMembersResponse>(`/projectUser/project/${projectId}`);
      setProjectMembers(data.members);
    } catch (err) {
      setMembersError(err instanceof ApiError ? err.message : "Impossible de charger les membres.");
    } finally {
      setMembersLoading(false);
    }
  }, []);

  const fetchProjectTasks = useCallback(async (projectId: string | number) => {
    setTasksLoading(true);
    setTasksError(null);
    try {
      const data = await apiFetch<GetTasksByProjectResponse>(`/task/project/${projectId}`);
      setProjectTasks(data.tasks);
    } catch (err) {
      setTasksError(err instanceof ApiError ? err.message : "Impossible de charger les tâches.");
    } finally {
      setTasksLoading(false);
    }
  }, []);

  const createTask = useCallback(async (payload: CreateTaskPayload) => {
    setTaskActionError(null);
    try {
      const data = await apiFetch<CreateTaskResponse>("/task", {
        method: "POST",
        body: JSON.stringify(payload),
      });
      setProjectTasks((prev) => [...prev, data.task]);
      return true;
    } catch (err) {
      setTaskActionError(err instanceof ApiError ? err.message : "Impossible de créer la tâche.");
      return false;
    }
  }, []);

  const updateTask = useCallback(async (id: number, payload: UpdateTaskPayload) => {
    setTaskActionError(null);
    try {
      const data = await apiFetch<UpdateTaskResponse>(`/task/${id}`, {
        method: "PUT",
        body: JSON.stringify(payload),
      });
      setProjectTasks((prev) => prev.map((t) => (t.id === id ? { ...t, ...data.task } : t)));
      return true;
    } catch (err) {
      setTaskActionError(err instanceof ApiError ? err.message : "Impossible de modifier la tâche.");
      return false;
    }
  }, []);
  const updateTaskStatus = useCallback(
  async (id: number, statut: string) => {
    setTaskActionError(null);

    try {
      const data = await apiFetch<UpdateTaskResponse>(
        `/task/${id}/status`,
        {
          method: "PATCH",
          body: JSON.stringify({ statut }),
        }
      );

      setProjectTasks((prev) =>
        prev.map((task) =>
          task.id === id
            ? { ...task, ...data.task }
            : task
        )
      );

      return true;
    } catch (err) {
      setTaskActionError(
        err instanceof ApiError
          ? err.message
          : "Impossible de modifier le statut de la tâche."
      );

      return false;
    }
  },
  []
);

  const deleteTask = useCallback(async (id: number) => {
    setTaskActionError(null);
    try {
      await apiFetch(`/task/${id}`, { method: "DELETE" });
      setProjectTasks((prev) => prev.filter((t) => t.id !== id));
      return true;
    } catch (err) {
      setTaskActionError(err instanceof ApiError ? err.message : "Impossible de supprimer la tâche.");
      return false;
    }
  }, []);
const fetchMessages = useCallback(async (projectId: string | number) => {
  setMessagesLoading(true);
  setMessagesError(null);

  try {
    const data = await apiFetch<ChatMessage[]>(
      `/message/project/${projectId}`
    );

    setMessages(data);
  } catch (err) {
    setMessagesError(
      err instanceof ApiError
        ? err.message
        : "Impossible de charger les messages."
    );
  } finally {
    setMessagesLoading(false);
  }
}, []);

const addLocalMessage = useCallback((message: ChatMessage) => {
  setMessages((prev) => [...prev, message]);
}, []);

  const value: AppContextValue = {
    user,
    authLoading,
    authChecked,
    authError,
    login,
    register,
    logout,
    projects,
    projectsLoading,
    projectsError,
    fetchProjects,
    currentProject,
    projectLoading,
    projectError,
    fetchProject,
    projectMembers,
    membersLoading,
    membersError,
    fetchProjectMembers,
    projectTasks,
    tasksLoading,
    tasksError,
    fetchProjectTasks,
    createTask,
    updateTask,
    updateTaskStatus,
    deleteTask,
    taskActionError,
    messages,
messagesLoading,
messagesError,
fetchMessages,
addLocalMessage,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useAppContext() {
  const ctx = useContext(AppContext);
  if (!ctx) {
    throw new Error("useAppContext doit être utilisé à l'intérieur d'un <AppProvider>.");
  }
  return ctx;
}