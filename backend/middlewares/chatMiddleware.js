import ProjectUser from "../models/projectUserModels.js";


export async function checkProjectAccess(projectId, userId, role) {
  // L'administrateur peut accéder à tous les projets
  if (role === "admin") {
    return true;
  }

  const member = await ProjectUser.findOne({
    where: {
      project_id: projectId,
      users_id: userId,
    },
  });

  return !!member;
}


export async function canAccessProjectChat(req, res, next) {
  try {
    const projectId = req.params.projectId;

    const allowed = await checkProjectAccess(
      projectId,
      req.user.userId,
      req.user.role
    );

    if (!allowed) {
      return res.status(403).json({
        message: "Vous n'êtes pas membre de ce projet",
      });
    }

    next();
  } catch (error) {
    console.error("Erreur accès projet :", error);

    return res.status(500).json({
      message: "Erreur lors de la vérification de l'accès au projet",
    });
  }
}