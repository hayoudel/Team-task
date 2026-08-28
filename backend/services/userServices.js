import User from "../models/userModels.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken"


export const createUser = async (userData) => {
  const { nom, prenom, email, motDePasse,numero_telephone} = userData;

  const motDePasseHash = await bcrypt.hash(motDePasse, 10);

  const user = await User.create({
    nom,
    prenom,
    email,
    numero_telephone,
    motDePasse: motDePasseHash,
  });

  return user;
};

export const getAllUsers = async () => {
  const users = await User.findAll();
  return users;
};

export const getUserById = async (id) => {
  const user = await User.findByPk(id);

  if (!user) {
    return null;
  }
  return user;
};


export const updateUser = async (id,userData) => {
    const user = await User.findByPk(id);

    if (!user) {
    return null;
  }
const { nom, prenom, email, numero_telephone } = userData;

  await user.update({
    nom,
    prenom,
    email,
    numero_telephone
  });
  return user;
};

export const deleteUser = async (id) => {
    const user = await User.findByPk(id);
    
    if (!user) {
    return null;
  }
  await user.destroy();
  return user;
};

export const loginUser = async (email,motDePasse) => {
    const user = await User.findOne({
        where: {
            email: email
        }
    });
    if (!user) {
    return null;
  }

  const passwordCorrect = await bcrypt.compare(motDePasse, user.motDePasse);
  if (!passwordCorrect) {
    return null;
  }
  const payload = { userId: user.id, role: user.role };
const secretKey = process.env.JWT_SECRET;
const token = jwt.sign(payload, secretKey, { expiresIn: '2h' });

  return {
    user,
    token
  };
   
};

