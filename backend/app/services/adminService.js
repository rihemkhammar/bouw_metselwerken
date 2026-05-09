import prisma from "../configs/prisma.js";
import bcrypt from "bcryptjs";

export const createChefService = async ({ name, email, password }) => {

  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) {
    throw new Error("Cet email est déjà utilisé");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

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

export const getGuestsService = async () => {
  return prisma.user.findMany({
    where: { role: "GUEST" },
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      services: true,
      requests: {
        select: {
          id: true,        
          createdAt: true,
          status: true,
          description: true,
          viewed: true       
        },
      },
    },
  });
};

export const approveClientRequest = async (requestId, adminId) => {
  const request = await prisma.request.findUnique({
    where: { id: requestId },
    include: { user: true }
  });

  if (!request) {
    throw new Error("Request not found");
  }
  if (request.status !== "PENDING") {
    throw new Error("Request already processed");
  }

  const plainPassword = Math.random().toString(36).slice(-8);
  const hashedPassword = await bcrypt.hash(plainPassword, 10);

  await prisma.user.update({
    where: { id: request.userId },
    data: { status: "ACTIVE", password: hashedPassword }
  });

  await prisma.request.update({
    where: { id: requestId },
    data: {
      status: "APPROVED",
      approvedBy: adminId,
      viewed: true  
    }
  });

  
  return { success: true, request };
};


export const getClientRequests = async () => {
  return prisma.request.findMany({
    where: {
      status: "PENDING",
      user: { role: "CLIENT" } // only client demandes
    },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          status: true,
          phone: true,
          companyName: true,
        }
      }
    },
    orderBy: { createdAt: "desc" }
  });
};
export const declineClientRequest = async (requestId, adminId) => {
  const request = await prisma.request.findUnique({
    where: { id: requestId }
  });

  if (!request) {
    throw new Error("Request not found");
  }
  if (request.status !== "PENDING") {
    throw new Error("Request already processed");
  }

  await prisma.request.update({
    where: { id: requestId },
    data: {
      status: "DECLINED",
      approvedBy: adminId,
      viewed: true   
    }
  });

  return { success: true };
};
export const markGuestRequestViewedService = async (id) => {
  return prisma.request.update({
    where: { id },
    data: { viewed: true }
  });
};

export const markClientRequestViewedService = async (id) => {
  return prisma.request.update({
    where: { id },
    data: { viewed: true }
  });
};