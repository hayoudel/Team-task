import { createUser,getAllUsers,getUserById,updateUser,deleteUser,loginUser,changePassword } from "../services/userServices.js";
import  User from "../models/userModels.js";

export const createUserController = async (req, res) => {
  try {
    const user = await createUser(req.body);

    res.status(201).json({
      message: "Utilisateur créé avec succès",
      user: {
        id: user.id,
        nom: user.nom,
        prenom: user.prenom,
        email: user.email,
        numero_telephone:user.numero_telephone,
        role: user.role
      }
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
    
    res.cookie("token", token, { 
      httpOnly: true,
      secure: false, 
      sameSite: "lax", 
      maxAge: 2 * 60 * 60 * 1000 
    });

    res.status(200).json({
      message: "Connexion réussie",
      user: {
        token,
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

export const getMeController = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.userId);

    if (!user) {
      return res.status(404).json({
        message: "Utilisateur introuvable"
      });
    }

    res.status(200).json({
      user: {
        id: user.id,
        nom: user.nom,
        prenom: user.prenom,
        email: user.email,
        numero_telephone: user.numero_telephone,
        role: user.role
      }
    });

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};
export const logoutController = (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: false,
    sameSite: "lax",
     path: "/",
  });

  res.status(200).json({
    message: "Déconnexion réussie"
  });
};
export const changePasswordController = async (req, res) => {
  try {
    const { ancienMotDePasse, nouveauMotDePasse } = req.body;

    if (!ancienMotDePasse || !nouveauMotDePasse) {
      return res.status(400).json({
        message: "L'ancien et le nouveau mot de passe sont obligatoires",
      });
    }

    if (nouveauMotDePasse.length < 6) {
      return res.status(400).json({
        message: "Le nouveau mot de passe doit contenir au moins 6 caractères",
      });
    }

    const result = await changePassword(
      req.user.userId,
      ancienMotDePasse,
      nouveauMotDePasse
    );

    if (!result.success) {
      return res.status(400).json({
        message: result.message,
      });
    }

    return res.status(200).json({
      message: result.message,
    });

  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};