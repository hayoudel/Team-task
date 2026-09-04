export interface MessageSender {
  id: number;
  nom: string;
  prenom: string;
}

export interface RepliedMessage {
  id: number;
  contenu: string;
  sender_id: number;
  sender: MessageSender;
}

export interface ChatMessage {
  id: number;
  contenu: string;
  project_id: number;
  sender_id: number;
  reply_to_id: number | null;
  createdAt: string;

  sender: MessageSender;

  messageRepondu?: RepliedMessage | null;
}