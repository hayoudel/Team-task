import  Sequelize  from "sequelize";
import dotenv from "dotenv";


dotenv.config();

export const sequelize = new Sequelize(
    process.env.DB_NAME ,
    process.env.DB_USER ,
    process.env.DB_PASSWORD ,
    {
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        dialect: 'postgres',
        logging: false,
});


export const  connectionDb  = async () => {
    try {
  await sequelize.authenticate();
  console.log('Connection avec la base de données établie avec succès.');
} catch (error) {
  console.error('Erreur lors de la connexion à la base de données:', error);
}
}

