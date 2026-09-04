import { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Send } from "lucide-react";
import { io, Socket } from "socket.io-client";
import { useAppContext } from "../context/AppContext";
import { ChatMessage } from "../types/message";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";
const SOCKET_URL = API_URL.replace("/api", "");

export default function ProjectMessages() {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();
  const { user, messages, messagesLoading, messagesError, fetchMessages, addLocalMessage } = useAppContext();

  const [replyingTo, setReplyingTo] = useState<ChatMessage | null>(null);
  const [input, setInput] = useState("");
  const [connected, setConnected] = useState(false);
  const [socketError, setSocketError] = useState<string | null>(null);

  const socketRef = useRef<Socket | null>(null);
  const bottomRef = useRef<HTMLDivElement | null>(null);

  // Historique via le contexte
  useEffect(() => {
    if (!projectId) return;
    fetchMessages(projectId);
  }, [projectId, fetchMessages]);

  // Connexion socket, propre à cette page
  useEffect(() => {
    if (!projectId) return;

    const socket = io(SOCKET_URL, { withCredentials: true });
    socketRef.current = socket;

    socket.on("connect", () => {
      setConnected(true);
      socket.emit("joinProject", projectId);
    });

    socket.on("disconnect", () => setConnected(false));

    socket.on("newMessage", (msg: ChatMessage) => {
      if (String(msg.project_id) === String(projectId)) {
        addLocalMessage(msg);
      }
    });

    socket.on("errorMessage", (payload: { message: string }) => {
      setSocketError(payload.message);
    });

    socket.on("connect_error", () => {
      setSocketError("Connexion au chat impossible");
    });

    return () => {
      socket.emit("leaveProject", projectId);
      socket.disconnect();
      socketRef.current = null;
    };
  }, [projectId, addLocalMessage]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  function handleSend() {
    const content = input.trim();
    if (!content || !socketRef.current || !projectId) return;

    socketRef.current.emit("sendMessage", {
      projectId,
      contenu: content,
      replyToId: replyingTo?.id ?? null,
    });

    setInput("");
    setReplyingTo(null);
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSend();
    }
  }

  const error = messagesError || socketError;

  return (
    <div className="flex flex-col h-[calc(100vh-2rem)]">
      <div className="flex items-center gap-3 mb-4">
        <button onClick={() => navigate(-1)} className="text-slate-400 hover:text-slate-600">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-lg font-bold text-slate-900">Messages du projet</h1>
          <p className="text-xs text-slate-400">{connected ? "Connecté" : "Connexion..."}</p>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-100 text-red-600 rounded-xl px-4 py-2 text-sm mb-3">{error}</div>
      )}

      <div className="flex-1 overflow-y-auto bg-slate-50 rounded-2xl p-4 space-y-3">
        {messagesLoading && <p className="text-sm text-slate-400">Chargement des messages...</p>}

        {!messagesLoading && messages.length === 0 && (
          <p className="text-sm text-slate-400 text-center mt-10">
            Aucun message pour l'instant. Lancez la discussion !
          </p>
        )}

        <div className="flex flex-col gap-3">
          {messages.map((message) => {
            const isMine = message.sender_id === user?.id;

            return (
              <div key={message.id} className={`flex ${isMine ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[70%] rounded-2xl px-4 py-2 ${
                    isMine ? "bg-orange-400 text-white rounded-br-none" : "bg-gray-200 text-gray-900 rounded-bl-none"
                  }`}
                >
                  {!isMine && (
                    <p className="text-xs font-semibold mb-1">
                      {message.sender.prenom} {message.sender.nom}
                    </p>
                  )}

                  {message.messageRepondu && (
                    <div className="mb-2 rounded-lg bg-white/10 border-l-4 border-white/50 px-3 py-2">
                      <p className="text-xs font-semibold">
                        {message.messageRepondu.sender.prenom} {message.messageRepondu.sender.nom}
                      </p>
                      <p className="text-xs truncate">{message.messageRepondu.contenu}</p>
                    </div>
                  )}

                  <p>{message.contenu}</p>

                  <div className="flex items-center justify-between gap-3">
                    <button
                      onClick={() => setReplyingTo(message)}
                      className={`text-xs mt-2 ${
                        isMine ? "text-white/80 hover:text-white" : "text-slate-500 hover:text-slate-700"
                      }`}
                    >
                      ↩ Répondre
                    </button>
                    <p className={`text-[10px] mt-1 ${isMine ? "text-white/70" : "text-gray-500"}`}>
                      {new Date(message.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        <div ref={bottomRef} />
      </div>

      <div className="mt-4">
        {replyingTo && (
          <div className="flex items-center justify-between bg-slate-100 border-l-4 border-orange-400 rounded-lg px-3 py-2 mb-2">
            <div className="min-w-0">
              <p className="text-xs font-semibold text-orange-500">
                Répondre à {replyingTo.sender.prenom} {replyingTo.sender.nom}
              </p>
              <p className="text-sm text-slate-600 truncate">{replyingTo.contenu}</p>
            </div>
            <button onClick={() => setReplyingTo(null)} className="text-slate-400 hover:text-slate-600 ml-3">
              ✕
            </button>
          </div>
        )}

        <div className="flex items-center gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Écrire un message..."
            className="flex-1 rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
          />
          <button
            onClick={handleSend}
            disabled={!input.trim()}
            className="bg-orange-500 hover:bg-orange-600 disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-xl px-4 py-2.5"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}