import express from 'express';

import { connectionDb } from './config/db.js';

const app = express();

app.use(express.json());
const PORT = process.env.PORT || 5000;

const connecte = async () => {
    try {

        await connectionDb();
        await sequelize.sync();

        app.listen(PORT, () => {
            console.log(`Serveur connecté sur le port: ${PORT}`);
        });

    } catch (error) {

        console.log("Erreur de démarrage :", error.message);

    }
};

connecte();