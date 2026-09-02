// Rôle "chef de projet" = role_id 1, en dur côté back (middleware canCreateTask).
export const CHEF_DE_PROJET_ROLE_ID = "1";

export interface ProjectMember {
  id: string;
  userId: string;
  roleId: string;
  nom: string;
  prenom: string;
  role: string; // nom du rôle, ex: "Chef de projet", "Développeur"
}

export interface GetProjectMembersResponse {
  message: string;
  project: { id: number; nom: string };
  members: ProjectMember[];
}