export interface User {
  id: number;
  nom: string;
  prenom: string;
  email: string;
  numero_telephone: string;
  role: "admin" | "user";
}

export interface LoginPayload {
  email: string;
  motDePasse: string;
}

export interface RegisterPayload {
  nom: string;
  prenom: string;
  email: string;
  motDePasse: string;
  numero_telephone: string;
}

export interface LoginResponse {
  message: string;
  user: User & { token: string };
}

export interface RegisterResponse {
  message: string;
  user: User;
}

export interface GetMeResponse {
  message: string;
  user: User;
}