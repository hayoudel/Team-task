import { createProject, getAllProject, getProjectById,updateProject,deleteProject } from "../services/projectServices.js";

export const createProjectController = async (req, res) => {
  try {
    const project = await createProject(req.body);

    res.status(201).json({
      message: "Projet créé avec succès",
      project,
    });

  } catch (error) {
    res.status(500).json({
     message: error.message,
    });
  }
};

export const getAllProjectController = async (req, res) => {
  try {
    const project = await getAllProject();

    res.status(200).json({
      message: "Projects récupérés avec succès",
      project,
    });

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};


export const getProjectByIdController = async (req, res) => {
    try {
        const project = await getProjectById(req.params.id);
        
        if (!project) {
      return res.status(404).json({
        message: "Projects non trouvé"
      });
    }
        res.status(200).json ({
            message: "Project récupéré avec succès",
            project,

        });

    }catch (error) {
        res.status (500).json({
            messsage: error.message,
        });

    }
};
export const updateProjectController = async (req,res) => {
    try{

    if ("id" in req.body) {

      return res.status(403).json({
        message: "L'id ne peut pas être modifié"
      });
    }
      const projectUpdate = await updateProject(
        req.params.id,
        req.body
      );

        if (!projectUpdate) {
      return res.status(404).json({
        message: "Project non trouvé"
      });
    }


      res.status(200).json({
        message: "project modifié",
        project: projectUpdate,

      })
    }catch (error) {
        res.status (500).json({
            messsage: error.message,
        });

    }
};
export const deleteProjectController = async (req,res) => {
    try{
        const projectDelete = await deleteProject(req.params.id);

         if (!projectDelete) {
      return res.status(404).json({
        message: "Project non trouvé"
      });
    }

      res.status(200).json({
        message: "Project supprimer",
      })

    }catch (error) {
        res.status (500).json({
            messsage: error.message,
        });

    }
};