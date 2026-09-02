export type Role = "chef" | "user";

export interface Project {
  id: number;
  userId:string;
  nom: string;
  description: string;
  statut: string; 
  date_debut: string; 
  date_fin: string;
  createdAt?: string;
  updatedAt?: string;
}
export interface GetAllProjectsResponse {
  message: string;
  project: Project[];
}

export interface GetOneProjectResponse {
  message: string;
  project: Project;
}

export interface ApiErrorResponse {
  message: string;
}