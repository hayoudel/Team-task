export type UserRole = "admin" | "chef_projet" | "user";
export type TaskStatus = "todo" | "in_progress" | "done";
export type ProjectStatus = "active" | "on_hold" | "completed" | "cancelled";

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role: UserRole;
  createdAt: string;
}

export interface ProjectMember {
  userId: string;
  projectRole: string;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  status: ProjectStatus;
  startDate: string;
  endDate: string;
  members: ProjectMember[];
  createdAt: string;
  createdBy: string;
}

export interface Task {
  id: string;
  name: string;
  description: string;
  projectId: string;
  status: TaskStatus;
  startDate: string;
  dueDate: string;
  assigneeId: string;
  creatorId: string;
  createdAt: string;
}

export interface RoleDef {
  id: string;
  name: string;
}
