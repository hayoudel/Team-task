export interface TaskResponsable {
  nom: string;
  prenom: string;
  email: string;
  numero_telephone: string;
}

export interface Task {
  id: number;
  nom: string;
  description: string;
  statut: string; // libre côté back : "A faire" par défaut, pas d'enum strict
  date_debut: string;
  date_fin: string;
  project_id: number;
  created_by: number;
  responsable_id: number;
  responsable?: TaskResponsable; // présent seulement via getTasksByProject
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