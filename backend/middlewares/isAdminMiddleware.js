export const isAdmin = (req, res, next) => {

  if (req.user.role !== "admin") {
    return res.status(403).json({
      message: "Accès interdit : vous devez être administrateur"
    });
  }

  next();
};

