import { Server } from "socket.io";
import jwt from "jsonwebtoken";
import { parse as parseCookie } from "cookie";

import { createMessage } from "../services/messageServices.js";
import { checkProjectAccess } from "../middlewares/chatMiddleware.js";

export function initChatSocket(httpServer) {
  const io = new Server(httpServer, {
    cors: {
      origin: [
        "http://localhost:5173",
        "http://localhost:43000",
      ],
      credentials: true,
    },
  });


  io.use((socket, next) => {
    try {
      const rawCookies = socket.handshake.headers.cookie;

      if (!rawCookies) {
        return next(
          new Error("Vous devez être connecté")
        );
      }

      const cookies = parseCookie(rawCookies);

      const token = cookies.token;

      if (!token) {
        return next(
          new Error("Vous devez être connecté")
        );
      }

      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET
      );

      socket.user = decoded;

      next();

    } catch (error) {
      console.error(
        "Erreur authentification Socket.IO :",
        error
      );

      next(
        new Error("Token invalide ou expiré")
      );
    }
  });
  io.on("connection", (socket) => {

 

    socket.on("joinProject", async (projectId) => {
      try {

        const allowed = await checkProjectAccess(
          projectId,
          socket.user.userId,
          socket.user.role
        );

        if (!allowed) {
          return socket.emit("errorMessage", {
            message: "Vous n'êtes pas membre de ce projet",
          });
        }

        socket.join(`project_${projectId}`);

      } catch (error) {

        console.error(
          "Erreur joinProject :",
          error
        );

        socket.emit("errorMessage", {
          message: "Impossible de rejoindre le projet",
        });
      }
    });



    socket.on("leaveProject", (projectId) => {

      socket.leave(`project_${projectId}`);

     
    });

   

    socket.on(
      "sendMessage",
      async ({ projectId, contenu, replyToId }) => {

        try {

          if (!contenu || !contenu.trim()) {
            return;
          }

          // Vérifier que l'utilisateur appartient au projet
          const allowed = await checkProjectAccess(
            projectId,
            socket.user.userId,
            socket.user.role
          );

          if (!allowed) {
            return socket.emit("errorMessage", {
              message: "Vous n'êtes pas membre de ce projet",
            });
          }

          const message = await createMessage(
            projectId,
            socket.user.userId,
            contenu,
            replyToId ?? null
          );

          io
            .to(`project_${projectId}`)
            .emit("newMessage", message);

        } catch (error) {

          console.error(
            "Erreur sendMessage :",
            error
          );

          socket.emit("errorMessage", {
            message: error.message,
          });
        }
      }
    );

  

    socket.on("disconnect", () => {

    

    });

  });

  return io;
}