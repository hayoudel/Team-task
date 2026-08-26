import { and } from "sequelize";
import { createUser,getAllUsers,getUserById,updateUser,deleteUser,loginUser } from "../services/userServices.js";

export const createUserController = async (req, res) => {
  try {
    const user = await createUser(req.body);

    res.status(201).json({
      message: "Utilisateur créé avec succès",
      user,
    });

  } catch (error) {
    res.status(500).json({
     message: error.message,
    });
  }
};
export const getAllUsersController = async (req, res) => {
  try {
    const user = await getAllUsers();

    res.status(200).json({
      message: "Utilisateurs récupérés avec succès",
      user,
    });

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
export const getUserByIdController = async (req, res) => {
    try {
        const user = await getUserById(req.params.id);

        if (!user) {
      return res.status(404).json({
        message: "Utilisateur non trouvé"
      });
    }
        res.status(200).json ({
            message: "Utilisateur récupéré avec succès",
            user,

        });

    }catch (error) {
        res.status (500).json({
            messsage: error.message,
        });

    }
};

export const updateUserController = async (req,res) => {
    try{

    if ("role" in req.body || "motDePasse" in req.body || "id" in req.body) {

      return res.status(403).json({
        message: "Le rôle ou le mot de passe  ne peut pas être modifié"
      });
    }
      const userUpdate = await updateUser(
        req.params.id,
        req.body
      );

        if (!userUpdate) {
      return res.status(404).json({
        message: "Utilisateur non trouvé"
      });
    }


      res.status(200).json({
        message: "utilisateur modifié",
        user: userUpdate,

      })
    }catch (error) {
        res.status (500).json({
            messsage: error.message,
        });

    }
};

export const deleteUserController = async (req,res) => {
    try{
        const userDelete = await deleteUser(req.params.id);

         if (!userDelete) {
      return res.status(404).json({
        message: "Utilisateur non trouvé"
      });
    }

      res.status(200).json({
        message: "utilisateur suprimer",
      })

    }catch (error) {
        res.status (500).json({
            messsage: error.message,
        });

    }
};

 export const loginController = async (req,res) => {
    try {
        const {email, motDePasse} = req.body;
         const result = await loginUser(email, motDePasse);

    if (!result) {
      return res.status(401).json({
        message: "Email ou mot de passe incorrect"
      });
    }
    const { user, token } = result;

    res.status(200).json({
      message: "Connexion réussie",
      token,
      user: {
        id: user.id,
        nom: user.nom,
        prenom: user.prenom,
        email: user.email,
        role: user.role
      }
    });

    }catch (error) {
        res.status (500).json({
            messsage: error.message,
        });

    }
 };