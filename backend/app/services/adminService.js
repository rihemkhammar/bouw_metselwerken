import prisma from "../configs/prisma.js";

import bcrypt from "bcryptjs";
import { sendClientCredentials } from "./email.service.js";
 


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
      status: "ACTIVE",
    },
  });

  return newChef;
};
export const getChefsService = async () => {
  return prisma.user.findMany({
    where: { role: "CHEF" },
    select: {
      id: true,
      name: true,
      email: true,
      services: true,
      phone: true,
    },
  });
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
          viewed: true,
        },
      },
    },
  });
};

export const approveClientRequest = async (requestId, adminId) => {
  const request = await prisma.request.findUnique({
    where: { id: requestId },
    include: { user: true },
  });

  if (!request) {
    throw new Error("Request not found");
  }
  if (request.status !== "PENDING") {
    throw new Error("Request already processed");
  }

  console.log("ENV CHECK:", {
    host: process.env.EMAIL_HOST,
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS ? "✅ défini" : "❌ undefined",
  });

    const plainPassword =
    Math.random().toString(36).slice(-4).toUpperCase() +
    Math.random().toString(36).slice(-4) +
    "!";
 
  const hashedPassword = await bcrypt.hash(plainPassword, 10);


   await prisma.user.update({
    where: { id: request.userId },
    data: {
      status: "ACTIVE",
      password: hashedPassword,
      role: "CLIENT",           
    },
  });


  await prisma.request.update({
    where: { id: requestId },
    data: {
      status: "APPROVED",
      approvedBy: adminId,
      viewed: true,
    },
  });
   await sendClientCredentials({
    name: request.user.name,
    email: request.user.email,
    password: plainPassword,      // mot de passe EN CLAIR (avant hash) pour l'email
  });


  return { success: true, request };

  
};

export const getClientRequests = async () => {
  return prisma.request.findMany({
    where: {
      status: "PENDING",
      user: { role: "CLIENT" }, // only client demandes
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
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });
};
export const declineClientRequest = async (requestId, adminId) => {
  const request = await prisma.request.findUnique({
    where: { id: requestId },
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
      viewed: true,
    },
  });

  return { success: true };
};
export const markGuestRequestViewedService = async (id) => {
  return prisma.request.update({
    where: { id },
    data: { viewed: true },
  });
};

export const markClientRequestViewedService = async (id) => {
  return prisma.request.update({
    where: { id },
    data: { viewed: true },
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
    }),
  );


  return result;
};


export const getAdminDashboardService = async () => {
  // KPI
  const totalClients = await prisma.user.count({ where: { role: "CLIENT" } });
  const totalChefs = await prisma.user.count({ where: { role: "CHEF" } });
  const totalProjects = await prisma.project.count();

  const guestPending = await prisma.request.count({
    where: { status: "PENDING", viewed: false, user: { role: "GUEST" } },
  });

  const clientPending = await prisma.request.count({
    where: { status: "PENDING", viewed: false, user: { role: "CLIENT" } },
  });

  // Clients récents
  const recentClients = await prisma.user.findMany({
    where: { role: "CLIENT" },
    orderBy: { createdAt: "desc" },
    take: 5,
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      status: true,
      createdAt: true,
    },
  });

  // Projets récents (sans updates)
  const recentProjects = await prisma.project.findMany({
    orderBy: { id: "desc" },
    take: 5,
    select: {
      id: true,
      title: true,
      budget: true,
      status: true,
      client: { select: { name: true } },
      chef: { select: { name: true } },
    },
  });

  // Récupérer la dernière update pour CHAQUE projet
  const projectsWithLastUpdate = await Promise.all(
    recentProjects.map(async (project) => {
      const lastUpdate = await prisma.projectUpdate.findFirst({
        where: { projectId: project.id },
        orderBy: { timestamp: "desc" },
        select: { timestamp: true, updateType: true },
      });

      return {
        ...project,
        lastUpdate: lastUpdate || null,
      };
    })
  );

  return {
    totalClients,
    totalChefs,
    totalProjects,
    guestPending,
    clientPending,
    recentClients,
    recentProjects: projectsWithLastUpdate,
  };
};

export const getProjectByIdService = async (id) => {
  return prisma.project.findUnique({
    where: { id },
    select: {
      id: true,
      title: true,
      status: true,
     progress: true,   
      client: {
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
          companyName: true,
        },
      },
      chef: {
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
        },
      },
      updates: {
        orderBy: { timestamp: "desc" },
        select: {
          id: true,
          updateType: true,
          details: true,
          progress: true,
          timestamp: true,
          
        },
      },
    },
  });
};


export const getProjectsByServiceService = async (service) => {
  return prisma.project.findMany({
    where: { services: service },
    include: {
      client: true,
      chef: true,
    },
    orderBy: { createdAt: "desc" }
  });
};
export const createProjectService = async ({ title, description, budget, services, clientId, chefId }) => {
  return prisma.project.create({
    data: {
      title,
      description,
      budget: budget ? parseFloat(budget) : null,
      services,
      clientId,
      chefId,
      status: "PLANNED",
    },
    include: {
      client: { select: { id: true, name: true, email: true } },
      chef: { select: { id: true, name: true, email: true } },
    },
  });
};
export const deleteProjectService = async (id) => {
  return prisma.project.delete({
    where: { id },
  });
};
export const deleteClientService = async (id) => {
  // 1. Récupérer les IDs des projets du client
  const projects = await prisma.project.findMany({
    where: { clientId: id },
    select: { id: true },
  });
  const projectIds = projects.map((p) => p.id);

  // 2. Supprimer les sous-relations 
  await prisma.projectDocument.deleteMany({ where: { projectId: { in: projectIds } } });
  await prisma.projectUpdate.deleteMany({ where: { projectId: { in: projectIds } } });

  // 3. Supprimer les projets
  await prisma.project.deleteMany({ where: { clientId: id } });

  // 4. Supprimer les requests
  await prisma.request.deleteMany({ where: { userId: id } });

  // 5. Supprimer le client
  return prisma.user.delete({ where: { id } });
};
export const updateClientService = async (id, data) => {
  return prisma.user.update({
    where: { id },
    data: {
      name: data.name,
      email: data.email,
      phone: data.phone,
      companyName: data.companyName,
      address: data.address,
    },
  });
};
export const deleteChefService = async (id) => {
  const projects = await prisma.project.findMany({
    where: { chefId: id },
    select: { id: true },
  });
  const projectIds = projects.map((p) => p.id);

  await prisma.projectDocument.deleteMany({ where: { projectId: { in: projectIds } } });
  await prisma.projectUpdate.deleteMany({ where: { projectId: { in: projectIds } } });
  await prisma.project.deleteMany({ where: { chefId: id } });

  return prisma.user.delete({ where: { id } });
};

export const updateChefService = async (id, data) => {
  return prisma.user.update({
    where: { id },
    data: {
      name: data.name,
      email: data.email,
      phone: data.phone,
    },
  });
};
export const updateProjectService = async (id, data) => {
  return prisma.project.update({
    where: { id },
    data: {
      title: data.title,
      description: data.description,
      budget: data.budget ? parseFloat(data.budget) : null,
      services: data.services,
      clientId: data.clientId,
      chefId: data.chefId,
      status: data.status,
    },
    include: {
      client: { select: { id: true, name: true, email: true } },
      chef: { select: { id: true, name: true, email: true } },
    },
  });
};



export const getServicesListService = async () => {
  const services = [
    "MACONNERIE", "RENOVATION", "RESTAURATION",
    "CONSTRUCTION_GENERALE", "REJOINTOIEMENT_RUSTIQUE",
    "TRAITEMENT_HYDROFUGE", "DEMOUSSAGE",
  ];

  return Promise.all(
    services.map(async (service) => {
      const projectsCount = await prisma.project.count({
        where: { services: service },
      });

      const chefs = await prisma.user.findMany({
        where: { role: "CHEF", services: { has: service } },
        select: { id: true, name: true, email: true, phone: true },
      });

      return { service, projectsCount, chefs };
    })
  );
};

export const assignChefToServiceService = async (chefId, service) => {
  return prisma.user.update({
    where: { id: chefId },
    data: { services: { push: service } },
  });
};

export const removeChefFromServiceService = async (chefId, service) => {
  const chef = await prisma.user.findUnique({ where: { id: chefId } });
  if (!chef) throw new Error("Chef introuvable");

  return prisma.user.update({
    where: { id: chefId },
    data: { services: chef.services.filter((s) => s !== service) },
  });
};
export const resetClientPasswordService = async (id, newPassword) => {
  if (!newPassword || newPassword.length < 8) {
    throw new Error("Le mot de passe doit contenir au moins 8 caractères");
  }

  const user = await prisma.user.findUnique({ where: { id } });
  if (!user) throw new Error("Client introuvable");

  const hashedPassword = await bcrypt.hash(newPassword, 10);

  await prisma.user.update({
    where: { id },
    data: { password: hashedPassword },
  });

  return { success: true, message: "Mot de passe mis à jour avec succès" };
};