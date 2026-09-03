export interface TaskResponsable {
  id: number;
  nom: string;
  prenom: string;
  email: string;
  numero_telephone: string;
}
export interface TaskCreated{
  id: number;
  nom: string;
  prenom: string;
  email: string;
  numero_telephone: string;
}

export interface Task {
  id: number;
  nom: string;
  description: string;
  statut: string; 
  date_debut: string;
  date_fin: string;
  project_id: number;
  created_by: number;
  creator?: TaskCreated;
  responsable_id: number;
  responsable?: TaskResponsable; 
}

export interface CreateTaskPayload {
  nom: string;
  description: string;
  statut?: string;
  date_debut: string;
  date_fin: string;
  project_id: number;
  responsable_id: number;
}

export interface UpdateTaskPayload {
  nom?: string;
  description?: string;
  statut?: string;
  date_debut?: string;
  date_fin?: string;
  responsable_id?: number;
}

export interface GetTasksByProjectResponse {
  message: string;
  tasks: Task[];
}

export interface CreateTaskResponse {
  message: string;
  task: Task;
}

export interface UpdateTaskResponse {
  message: string;
  task: Task;
}