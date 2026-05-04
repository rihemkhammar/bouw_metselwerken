import prisma from "../configs/prisma.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";



export const loginService = async (email, password) => {
   const user = await prisma.user.findUnique({ where: { email } });
  if (!user) throw { status: 401, message: "Invalid credentials" };

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) throw { status: 401, message: "Invalid credentials" };

  if (user.status !== "ACTIVE") {
    throw { status: 403, message: "Account not active" };
  }
  // add token + role 
  const token = jwt.sign(
    { id: user.id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "1h" }
  );

  return {
    token,
    user: {
      id: user.id,
      email: user.email,
      role: user.role,
      name: user.name,
    },
  };
};