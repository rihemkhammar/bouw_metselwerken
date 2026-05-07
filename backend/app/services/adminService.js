import prisma from "../configs/prisma.js";
import bcrypt from "bcryptjs";

export const createChefService = async ({ name, email, password }) => {

  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) {
    throw new Error("Cet email est déjà utilisé");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  // Create new chef user
  const newChef = await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
      role: "CHEF",
      status: "PENDING", 
    },
  });

  return newChef;
};
export const getChefsService = async()=>{
   return prisma.user.findMany({
   where: { role : "CHEF"} , 
   select: {
    id : true,
    name: true ,
    email:true , 
    services:true , 
    phone : true ,
   }
   })
   
};

export const getClientsService = async () => {
  return prisma.user.findMany({
    where: { role: "CLIENT" },
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      companyName: true,
      address: true,
      status: true,
      projects: {
        select: {
          id: true,
          title: true,
          status: true,
        },
      },
    },
  });
};
