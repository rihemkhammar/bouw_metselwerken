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

export const getProfile = async () => {
  const admin = await prisma.user.findFirst({ where: { role: "ADMIN" } });
  console.log("Admin fetched:", admin);
  return admin;
};


export const updateProfile = async (data) => {
  return await prisma.user.updateMany({
    where: { role: "ADMIN" },
    data,
  });
};


export const getAllProjectsService = async () => {
  return prisma.project.findMany({
    include: {
      client: { select: { id: true, name: true, email: true } },
      chef: { select: { id: true, name: true, email: true } },
    },
    orderBy: { title: "asc" },
  });
};

export const getServicesWithChefsService = async () => {
  // Define the enum values manually
  const services = [
    "MACONNERIE",
    "RENOVATION",
    "RESTAURATION",
    "CONSTRUCTION_GENERALE",
    "REJOINTOIEMENT_RUSTIQUE",
    "TRAITEMENT_HYDROFUGE",
    "DEMOUSSAGE",
  ];

  const result = await Promise.all(
    services.map(async (s) => {
      const projects = await prisma.project.findMany({
        where: { services: s }, 
        include: { chef: true },
      });

      const chef = projects.length > 0 ? projects[0].chef : null;

      return {
        service: s,
        chef,
        projectsCount: projects.length,
      };
    })
  );

  return result;
};





export const getProjectByIdService = async (id) => {
  return prisma.project.findUnique({
    where: { id },
    include: {
      client: true,
      chef: true,
      updates: true,
    },
  });
};