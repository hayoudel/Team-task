import { createContext, useContext, useMemo, useState, useEffect, type ReactNode } from "react";

import type { Project, ProjectMember, RoleDef, Task, User,CreateUserData,CreateProjectData } from "../types";



interface AppContextValue {
  currentUser: User | null;
  isLoadingAuth: boolean;
login: (email: string, password: string) => Promise<boolean>;
logout: () => void;

  users: User[];
addUser: (u: CreateUserData) => Promise<void>;
 updateUser: (id: string, u: Partial<User>) => Promise<void>;
deleteUser: (id: string) => Promise<void>;

  projects: Project[];
 addProject: (project: CreateProjectData) => Promise<string>;
  updateProject: (id: string, p: Partial<Project>) => Promise<void>;
  deleteProject: (id: string) => void;
  addMember: (projectId: string, member: ProjectMember) => Promise<void>;
  updateMemberRole: (projectId: string, userId: string, projectRole: string) => void;
  removeMember: (projectId: string, userId: string) => void;

  tasks: Task[];
  addTask: (t: Omit<Task, "id" | "createdAt" | "creatorId">) => void;
  getTasksByProject: (projectId: string) => Promise<Task[]>;
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
  const [users, setUsers] = useState<User[]>([]);
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);
const [projects, setProjects] = useState<Project[]>([]);
 const [tasks, setTasks] = useState<Task[]>([]);
  const [roles, setRoles] = useState<RoleDef[]>([]);

  const fetchUsers = async () => {
  try {
    const response = await fetch("http://localhost:3000/api/users", {
      credentials: "include",
    });

    const data = await response.json();

    if (!response.ok) {
      console.error(data.message);
      return;
    }

    const formattedUsers: User[] = data.user.map((user: any) => ({
      id: String(user.id),
      firstName: user.prenom,
      lastName: user.nom,
      email: user.email,
      phone: user.numero_telephone || "",
      role: user.role,
      createdAt: user.createdAt,
    }));

    setUsers(formattedUsers);

  } catch (error) {
    console.error("Erreur récupération utilisateurs :", error);
  }
};
useEffect(() => {
  if (!currentUser) return;
  fetchUsers();
}, [currentUser]);

const fetchRoles = async () => {
  try {
    const response = await fetch("http://localhost:3000/api/roles", {
      method: "GET",
      credentials: "include",
    });

    const data = await response.json();

    console.log("ROLES API :", data);

    if (!response.ok) {
      console.error("Erreur récupération rôles :", data.message);
      return;
    }

    const formattedRoles: RoleDef[] = data.role.map((role: any) => ({
      id: String(role.id),
      name: role.nom,
    }));

    console.log("ROLES FORMATTÉS :", formattedRoles);

    setRoles(formattedRoles);

  } catch (error) {
    console.error("Erreur récupération rôles :", error);
  }
};

useEffect(() => {
   if (!currentUser) return;
  fetchRoles();
}, [currentUser]);


const login = async (email: string, password: string) => {
  try {
    const response = await fetch("http://localhost:3000/api/users/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({
        email: email,
        motDePasse: password,
      }),
    });

    const data = await response.json();


    if (!response.ok) {
      return false;
    }

    const user: User = {
      id: String(data.user.id),
      firstName: data.user.prenom,
      lastName: data.user.nom,
      email: data.user.email,
      role: data.user.role,
    };

    setCurrentUser(user);

    return true;

  } catch (error) {
    console.error("Erreur :", error);
    return false;
  }
};

useEffect(() => {
  const checkAuth = async () => {
    try {
      const response = await fetch(
        "http://localhost:3000/api/users/me",
        {
          credentials: "include",
        }
      );

      if (!response.ok) {
        setCurrentUser(null);
        return;
      }

      const data = await response.json();

      const user: User = {
        id: String(data.user.id),
        firstName: data.user.prenom,
        lastName: data.user.nom,
        email: data.user.email,
        role: data.user.role,
      };

      setCurrentUser(user);

    } catch (error) {
      console.error("Erreur vérification session :", error);
      setCurrentUser(null);

    } finally {
      setIsLoadingAuth(false);
    }
  };

  checkAuth();
}, []);


 const logout = async () => {
  try {
    await fetch("http://localhost:3000/api/users/logout", {
      method: "POST",
      credentials: "include",
    });

    setCurrentUser(null);

  } catch (error) {
    console.error("Erreur déconnexion :", error);
  }
};

const addUser: AppContextValue["addUser"] = async (u) => {
  try {
    const response = await fetch("http://localhost:3000/api/users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({
        nom: u.lastName,
        prenom: u.firstName,
        email: u.email,
        motDePasse:u.password,
        numero_telephone: u.phone,
        role: u.role,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("Erreur création utilisateur :", data.message);
      return;
    }

    const newUser: User = {
      id: String(data.user.id),
      firstName: data.user.prenom,
      lastName: data.user.nom,
      email: data.user.email,
      phone: data.user.numero_telephone || "",
      role: data.user.role,
    };

    setUsers((prev) => [...prev, newUser]);

  } catch (error) {
    console.error("Erreur création utilisateur :", error);
  }
};
const updateUser: AppContextValue["updateUser"] = async (id, u) => {
  try {
    const response = await fetch(`http://localhost:3000/api/users/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        nom: u.lastName,
        prenom: u.firstName,
        email: u.email,
        numero_telephone: u.phone,
      }),
    });

   

    if (!response.ok) {
      return;
    }

    setUsers((prev) =>
      prev.map((user) =>
        user.id === id
          ? {
              ...user,
              firstName: u.firstName ?? user.firstName,
              lastName: u.lastName ?? user.lastName,
              email: u.email ?? user.email,
              phone: u.phone ?? user.phone,
            }
          : user
      )
    );

  } catch (error) {
    console.error("Erreur :", error);
  }
};
const deleteUser: AppContextValue["deleteUser"] = async (id) => {
  try {
    const response = await fetch(`http://localhost:3000/api/users/${id}`, {
      method: "DELETE",
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("Erreur suppression :", data);
      return;
    }



    // Supprimer du frontend après confirmation du backend
    setUsers((prev) => prev.filter((user) => user.id !== id));

    // Retirer également l'utilisateur des projets
    setProjects((prev) =>
      prev.map((project) => ({
        ...project,
        members: project.members.filter(
          (member) => member.userId !== id
        ),
      }))
    );

  } catch (error) {
    console.error("Erreur :", error);
  }
};
useEffect(() => {
    if (!currentUser) return;
  const loadProjects = async () => {
    try {
      const response = await fetch(
        "http://localhost:3000/api/projects",
        {
          method: "GET",
          credentials: "include",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        console.error("Erreur récupération projets :", data);
        return;
      }

      const projectsFromApi: Project[] = await Promise.all(
        data.project.map(async (project: any) => {

          let members = [];

          try {
            const membersResponse = await fetch(
              `http://localhost:3000/api/projectUser/project/${project.id}`,
              {
                method: "GET",
                credentials: "include",
              }
            );

            const membersData = await membersResponse.json();

      members = membersData.members.map((member: any) => ({
  id: String(member.id),
  userId: String(member.userId),
  roleId: String(member.roleId),
  projectRole: member.role,
}));

          } catch (error) {
            console.error(
              `Erreur récupération membres du projet ${project.id} :`,
              error
            );
          }

          return {
            id: String(project.id),
            name: project.nom,
            description: project.description,
            status: project.statut,
            startDate: project.date_debut,
            endDate: project.date_fin,
            members,
            createdAt: project.createdAt,
            createdBy: "",
          };
        })
      );

      console.log("PROJETS AVEC MEMBRES :", projectsFromApi);

      setProjects(projectsFromApi);

    } catch (error) {
      console.error("Erreur récupération projets :", error);
    }
  };

  loadProjects();
}, [currentUser]);

const addProject: AppContextValue["addProject"] = async (p) => {
  try {
    const response = await fetch("http://localhost:3000/api/projects", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({
        nom: p.name,
        description: p.description,
        statut: p.status,
        date_debut: p.startDate,
        date_fin: p.endDate,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("Erreur création project :", data.message);
      throw new Error(data.message || "Erreur lors de la création du projet");
    }

    const newProject: Project = {
      id: String(data.project.id),
      name: data.project.nom,
      description: data.project.description,
      status: data.project.statut,
      startDate: data.project.date_debut,
      endDate: data.project.date_fin,
      members: [],
      createdAt: data.project.createdAt,
      createdBy: "",
    };

    setProjects((prev) => [...prev, newProject]);

    return newProject.id;
  } catch (error) {
    console.error("Erreur création du project :", error);
    throw error;
  }
};

 const updateProject: AppContextValue["updateProject"] = async (id, p) => {
  try {
    const response = await fetch(
      `http://localhost:3000/api/projects/${id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          nom: p.name,
          description: p.description,
          statut: p.status,
          date_debut: p.startDate,
          date_fin: p.endDate,
        }),
      }
    );

    const data = await response.json();

    console.log("PROJET MODIFIÉ :", data);

    if (!response.ok) {
      throw new Error(data.message || "Erreur modification projet");
    }

    const project = data.project;

    const projectUpdated: Project = {
      id: String(project.id),
      name: project.nom,
      description: project.description,
      status: project.statut,
      startDate: project.date_debut,
      endDate: project.date_fin,
      members: [],
      createdAt: project.createdAt,
      createdBy: "",
    };

    setProjects((prev) =>
      prev.map((p) =>
        p.id === String(id) ? projectUpdated : p
      )
    );

  } catch (error) {
    console.error("Erreur modification :", error);
    throw error;
  }
};
  const deleteProject: AppContextValue["deleteProject"] = async (id) => {
  try {
    const response = await fetch(
      `http://localhost:3000/api/projects/${id}`,
      {
        method: "DELETE",
        credentials: "include",
      }
    );

    const data = await response.json();

    console.log("PROJET SUPPRIMÉ :", data);

    if (!response.ok) {
      throw new Error(data.message || "Erreur suppression projet");
    }

    setProjects((prev) =>
      prev.filter((p) => p.id !== id)
    );

    setTasks((prev) =>
      prev.filter((task) => task.projectId !== id)
    );

  } catch (error) {
    console.error("Erreur suppression :", error);
    throw error;
  }
};
const addMember: AppContextValue["addMember"] = async (
  projectId,
  member
) => {
  try {

    const body = {
      project_id: Number(projectId),
      members: [
        {
          users_id: Number(member.userId),
          role_id: Number(member.roleId),
        },
      ],
    };
    const response = await fetch(
      "http://localhost:3000/api/projectUser",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(body),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data.message || "Erreur ajout membre"
      );
    }

    setProjects((prev) =>
      prev.map((p) =>
        p.id === String(projectId)
          ? {
              ...p,
              members: [...p.members, member],
            }
          : p
      )
    );

  } catch (error) {
    console.error(" Erreur ajout membre :", error);
    throw error;
  }
};
const updateMemberRole: AppContextValue["updateMemberRole"] = async (
  projectId,
  userId,
  projectRole
) => {
  try {

    const project = projects.find(
      (p) => p.id === String(projectId)
    );

    const member = project?.members.find(
      (m) => m.userId === String(userId)
    );
console.log("PROJECT :", project);
console.log("MEMBERS :", project?.members);
console.log("USER ID RECHERCHÉ :", userId);
console.log("MEMBER TROUVÉ :", member);
    if (!member?.id) {
      throw new Error("Association membre/projet introuvable");
    }

    const role = roles.find(
      (r) => r.name === projectRole
    );

    if (!role) {
      throw new Error("Rôle introuvable");
    }

    const response = await fetch(
      `http://localhost:3000/api/projectUser/${member.id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          role_id: Number(role.id),
        }),
      }
    );

    const data = await response.json();

    console.log("RÔLE MODIFIÉ :", data);

    if (!response.ok) {
      throw new Error(
        data.message || "Erreur modification rôle"
      );
    }

    setProjects((prev) =>
      prev.map((project) =>
        project.id === String(projectId)
          ? {
              ...project,
              members: project.members.map((member) =>
                member.userId === String(userId)
                  ? {
                      ...member,
                      roleId: String(role.id),
                      projectRole: role.name,
                    }
                  : member
              ),
            }
          : project
      )
    );

  } catch (error) {
    console.error("Erreur modification rôle :", error);
  }
};

const removeMember: AppContextValue["removeMember"] = async (
  projectId,
  userId
) => {
  try {
    const response = await fetch(
      `http://localhost:3000/api/projectUser/project/${projectId}/user/${userId}`,
      {
        method: "DELETE",
        credentials: "include",
      }
    );

    const data = await response.json();

    if (!response.ok) {
      console.error("Erreur suppression membre :", data.message);
      return;
    }

    console.log("MEMBRE RETIRÉ :", data);

    setProjects((prev) =>
      prev.map((p) =>
        p.id === projectId
          ? {
              ...p,
              members: p.members.filter(
                (member) => member.userId !== userId
              ),
            }
          : p
      )
    );

  } catch (error) {
    console.error("Erreur suppression membre :", error);
  }
};
useEffect(() => {
  if (!currentUser) return;

  const fetchTasks = async () => {
    try {
      const response = await fetch(
        "http://localhost:3000/api/task",
        {
          method: "GET",
          credentials: "include",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        console.error("Erreur récupération tâches :", data);
        return;
      }

      const formattedTasks: Task[] = data.tasks.map((task: any) => ({
        id: String(task.id),
        name: task.nom,
        description: task.description,
        projectId: String(task.project_id),
        status: task.statut,
        startDate: task.date_debut,
        dueDate: task.date_fin,
        assigneeId: String(task.responsable_id),
        creatorId: String(task.created_by),
        createdAt: task.createdAt,
      }));

      setTasks(formattedTasks);

    } catch (error) {
      console.error("Erreur récupération tâches :", error);
    }
  };

  fetchTasks();

}, [currentUser]);


const getTasksByProject: AppContextValue["getTasksByProject"] = async (
  projectId
) => {
  try {
    const response = await fetch(
      `http://localhost:3000/api/task/project/${projectId}`,
      {
        method: "GET",
        credentials: "include",
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data.message || "Erreur récupération des tâches du projet"
      );
    }

    const formattedTasks: Task[] = data.tasks.map((task: any) => ({
      id: String(task.id),
      name: task.nom,
      description: task.description,
      projectId: String(task.project_id),
      status: task.statut,
      startDate: task.date_debut,
      dueDate: task.date_fin,
      assigneeId: String(task.responsable_id),
      creatorId: String(task.created_by),
      createdAt: task.createdAt,
    }));

    return formattedTasks;

  } catch (error) {
    console.error(
      "Erreur récupération tâches du projet :",
      error
    );

    throw error;
  }
};

const addTask: AppContextValue["addTask"] = async (t) => {
  try {
    const response = await fetch(
      "http://localhost:3000/api/task",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          nom: t.name,
          description: t.description,
          statut: t.status,
          date_debut: t.startDate,
          date_fin: t.dueDate,
          project_id: Number(t.projectId),
          responsable_id: Number(t.assigneeId),
        }),
      }
    );

    const data = await response.json();

    console.log("TÂCHE CRÉÉE :", data);

    if (!response.ok) {
      throw new Error(
        data.message || "Erreur création tâche"
      );
    }

    const task = data.task;

    const newTask: Task = {
      id: String(task.id),
      name: task.nom,
      description: task.description,
      projectId: String(task.project_id),
      status: task.statut,
      startDate: task.date_debut,
      dueDate: task.date_fin,
      assigneeId: String(task.responsable_id),
      creatorId: String(task.created_by),
      createdAt: task.createdAt,
    };

    setTasks((prev) => [...prev, newTask]);

  } catch (error) {
    console.error("Erreur création tâche :", error);
    throw error;
  }
};

  const updateTask: AppContextValue["updateTask"] = async (id, t) => {
  try {
    const response = await fetch(
      `http://localhost:3000/api/task/${id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          nom: t.name,
          description: t.description,
          statut: t.status,
          date_debut: t.startDate,
          date_fin: t.dueDate,
          project_id: t.projectId
            ? Number(t.projectId)
            : undefined,
          responsable_id: t.assigneeId
            ? Number(t.assigneeId)
            : undefined,
        }),
      }
    );

    const data = await response.json();

    console.log("TÂCHE MODIFIÉE :", data);

    if (!response.ok) {
      throw new Error(
        data.message || "Erreur modification tâche"
      );
    }

    const task = data.task;

    const updatedTask: Task = {
      id: String(task.id),
      name: task.nom,
      description: task.description,
      projectId: String(task.project_id),
      status: task.statut,
      startDate: task.date_debut,
      dueDate: task.date_fin,
      assigneeId: String(task.responsable_id),
      creatorId: String(task.created_by),
      createdAt: task.createdAt,
    };

    setTasks((prev) =>
      prev.map((t) =>
        t.id === String(id)
          ? updatedTask
          : t
      )
    );

  } catch (error) {
    console.error("Erreur modification tâche :", error);
    throw error;
  }
};
 const deleteTask: AppContextValue["deleteTask"] = async (id) => {
  try {
    const response = await fetch(
      `http://localhost:3000/api/task/${id}`,
      {
        method: "DELETE",
        credentials: "include",
      }
    );

    const data = await response.json();

    console.log("TÂCHE SUPPRIMÉE :", data);

    if (!response.ok) {
      throw new Error(
        data.message || "Erreur suppression tâche"
      );
    }

    setTasks((prev) =>
      prev.filter((task) => task.id !== String(id))
    );

  } catch (error) {
    console.error("Erreur suppression tâche :", error);
    throw error;
  }
};

 const addRole: AppContextValue["addRole"] = async (name) => {
  try {
    const response = await fetch("http://localhost:3000/api/roles", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({
        nom: name,
      }),
    });

    const data = await response.json();


    if (!response.ok) {
      throw new Error(data.message || "Erreur création rôle");
    }

    const newRole: RoleDef = {
      id: String(data.role.id),
      name: data.role.nom,
    };

    setRoles((prev) => [...prev, newRole]);

  } catch (error) {
    console.error("Erreur création rôle :", error);
    throw error;
  }
};
 const updateRole: AppContextValue["updateRole"] = async (id, name) => {
  try {
    const response = await fetch(
      `http://localhost:3000/api/roles/${id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          nom: name,
        }),
      }
    );

    const data = await response.json();

    console.log("RÔLE MODIFIÉ :", data);

    if (!response.ok) {
      throw new Error(data.message || "Erreur modification rôle");
    }

    const updatedRole: RoleDef = {
      id: String(data.role.id),
      name: data.role.nom,
    };

    setRoles((prev) =>
      prev.map((role) =>
        role.id === String(id)
          ? updatedRole
          : role
      )
    );

  } catch (error) {
    console.error("Erreur modification rôle :", error);
    throw error;
  }
};
 const deleteRole: AppContextValue["deleteRole"] = async (id) => {
  try {
    const response = await fetch(
      `http://localhost:3000/api/roles/${id}`,
      {
        method: "DELETE",
        credentials: "include",
      }
    );

    const data = await response.json();

    console.log("RÔLE SUPPRIMÉ :", data);

    if (!response.ok) {
      throw new Error(data.message || "Erreur suppression rôle");
    }

    setRoles((prev) =>
      prev.filter((role) => role.id !== String(id))
    );

  } catch (error) {
    console.error("Erreur suppression rôle :", error);
    throw error;
  }
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
      getTasksByProject,
      updateTask,
      deleteTask,
      roles,
      addRole,
      updateRole,
      isLoadingAuth,
      deleteRole,
    }),
   
     [currentUser, isLoadingAuth, users, projects, tasks, roles]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}
