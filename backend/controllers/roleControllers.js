import {createRole,getAllRole,getRoleById,updateRole,deleteRole} from "../services/roleServices.js"

export const createRoleController = async (req,res) => {
    try{
        const role = await createRole(req.body);
        res.status(201).json({
            message: "role crée",
            role
        });
    }catch(error){
        res.status(500).json({
            message: message.error,
        })
    }

};

export const getAllRolesController = async (req, res) => {
  try {
    const role = await getAllRole();

    res.status(200).json({
      message: "role récupérés avec succès",
      role,
    });

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};


export const getRoleByIdController = async (req, res) => {
    try {
        const role = await getRoleById(req.params.id);

        if (!role) {
      return res.status(404).json({
        message: "Role non trouvé"
      });
    }
        res.status(200).json ({
            message: "Role récupéré avec succès",
            role,

        });

    }catch (error) {
        res.status (500).json({
            messsage: error.message,
        });

    }
};

export const updateRoleController = async (req,res) => {
    try{

    if ("id" in req.body) {

      return res.status(403).json({
        message: "L'id ne peut pas être modifié"
      });
    }
      const roleUpdate = await updateRole(
        req.params.id,
        req.body
      );

        if (!roleUpdate) {
      return res.status(404).json({
        message: "Role non trouvé"
      });
    }


      res.status(200).json({
        message: "Role modifié",
        user: roleUpdate,

      })
    }catch (error) {
        res.status (500).json({
            messsage: error.message,
        });

    }
};

export const deleteRoleController = async (req,res) => {
    try{
        const roleDelete = await deleteRole(req.params.id);

         if (!roleDelete) {
      return res.status(404).json({
        message: "Role non trouvé"
      });
    }

      res.status(200).json({
        message: "Role supprimer",
      })

    }catch (error) {
        res.status (500).json({
            messsage: error.message,
        });

    }
};
