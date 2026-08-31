import type { Task, TaskStatus, ProjectStatus, UserRole } from "../types";

export const TODAY = new Date("2026-08-31");

export function formatDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString("fr-FR", { day: "2-digit", month: "short", year: "numeric" });
}

export function initials(firstName: string, lastName: string): string {
  return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
}

const AVATAR_COLORS = [
  "bg-orange-500",
  "bg-blue-500",
  "bg-emerald-500",
  "bg-purple-500",
  "bg-amber-500",
  "bg-pink-500",
  "bg-cyan-500",
  "bg-indigo-500",
];

export function avatarColor(id: string): string {
  let hash = 0;
  for (let i = 0; i < id.length; i++) hash = id.charCodeAt(i) + ((hash << 5) - hash);
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
}

export function isOverdue(task: Task): boolean {
  if (task.status === "done") return false;
  return new Date(task.dueDate) < TODAY;
}

export function taskStatusLabel(status: TaskStatus): string {
  return { todo: "À faire", in_progress: "En cours", done: "Terminée" }[status];
}

export function projectStatusLabel(status: ProjectStatus): string {
  return { active: "Actif", on_hold: "En pause", completed: "Terminé", cancelled: "Annulé" }[status];
}

export function roleLabel(role: UserRole): string {
  return { admin: "Administrateur", chef_projet: "Chef de projet", user: "Utilisateur" }[role];
}

export function projectProgress(tasks: Task[], projectId: string): number {
  const projectTasks = tasks.filter((t) => t.projectId === projectId);
  if (projectTasks.length === 0) return 0;
  const done = projectTasks.filter((t) => t.status === "done").length;
  return Math.round((done / projectTasks.length) * 100);
}

export function uid(prefix: string): string {
  return `${prefix}_${Math.random().toString(36).slice(2, 10)}`;
}
