import express from 'express';
import userRoutes from './routes/userRoutes.js';
import projectRoutes from './routes/projectRoutes.js'
import roleRoutes from './routes/roleRoutes.js';
import projectUserRoutes from "./routes/projectUserRoutes.js";
import "./models/relationModels.js";

import { connectionDb,sequelize } from './config/db.js';

const app = express();

app.use(express.json());

app.use("/api/users", userRoutes);
app.use("/api/projects",projectRoutes);
app.use("/api/roles",roleRoutes);
app.use("/api/projectUser",projectUserRoutes);


const PORT = process.env.PORT || 5000;

const connecte = async () => {
    try {

        await connectionDb();
        await sequelize.sync({alter:true});

        app.listen(PORT, () => {
            console.log(`Serveur connecté sur le port: ${PORT}`);
        });

    } catch (error) {

        console.log("Erreur de démarrage :", error.message);

    }
};

connecte();