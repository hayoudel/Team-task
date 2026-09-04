import express from 'express';
import http from "http";
import userRoutes from './routes/userRoutes.js';
import projectRoutes from './routes/projectRoutes.js'
import roleRoutes from './routes/roleRoutes.js';
import projectUserRoutes from "./routes/projectUserRoutes.js";
import taskRoutes from "./routes/taskRoutes.js";
import messageRoutes from "./routes/messageRoutes.js"
import "./models/relationModels.js";
import cookieParser from "cookie-parser";
import cors from "cors"

import { connectionDb, sequelize } from './config/db.js';
import { initChatSocket } from "./socket/chatSocket.js";

const app = express();
app.use(cors({ 
  origin: ['http://localhost:5173', 'http://localhost:43000'], 
  credentials: true 
}));

app.use(express.json());
app.use(cookieParser());

app.use("/api/users", userRoutes);
app.use("/api/projects",projectRoutes);
app.use("/api/roles",roleRoutes);
app.use("/api/projectUser",projectUserRoutes);
app.use("/api/task",taskRoutes)
app.use("/api/message",messageRoutes)

// On crée un serveur HTTP explicite pour pouvoir y greffer socket.io
const httpServer = http.createServer(app);
const io = initChatSocket(httpServer);
app.set("io", io); // pour pouvoir émettre depuis les controllers REST

const PORT = process.env.PORT || 5000;

const connecte = async () => {
    try {

        await connectionDb();
        await sequelize.sync({alter:true});

        httpServer.listen(PORT, () => {
            console.log(`Serveur connecté sur le port: ${PORT}`);
        });

    } catch (error) {

        console.log("Erreur de démarrage :", error.message);

    }
};

connecte();