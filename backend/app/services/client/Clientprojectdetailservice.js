// services/clientProjectDetailService.js
import prisma from "../../configs/prisma.js";

export const clientProjectDetailService = {
  //Détail complet du projet
  async getProjectDetail(projectId, clientId) {
    if (!projectId || !clientId) {
      throw new Error("projectId et clientId sont requis.");
    }

    const project = await prisma.project.findFirst({
      where: {
        id: projectId,
        clientId,
      },
      include: {
        chef: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            matricule: true,
            companyName: true,
            address: true,
          },
        },
        client: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            companyName: true,
            address: true,
          },
        },
        updates: {
          orderBy: { timestamp: "desc" },
          select: {
            id: true,
            updateType: true,
            details: true,
            updatedBy: true,
            services: true,
            progress: true,
            timestamp: true,
          },
        },
        documents: {
          orderBy: { timestamp: "desc" },
          select: {
            id: true,
            fileName: true,
            fileType: true,
            fileUrl: true,
            timestamp: true,
          },
        },
      },
    });

    if (!project) return null;
    return project;
  },

  //  Upload document
  async uploadDocument(projectId, clientId, file) {
    if (!projectId || !clientId || !file) {
      throw new Error("Paramètres manquants pour l'upload.");
    }

    // Vérifier que le projet appartient bien au client
    const project = await prisma.project.findFirst({
      where: { id: projectId, clientId },
    });

    if (!project) {
      throw new Error("Projet introuvable ou accès refusé.");
    }

   const document = await prisma.projectDocument.create({
  data: {
    projectId,
    fileName: file.originalname,
    fileType: file.mimetype,
    fileUrl: `/uploads/${file.filename}`,
  },
});

    return document;
  },

  // Liste des updates du projet (lecture seule pour le client) 
  async getProjectUpdates(projectId, clientId) {
    if (!projectId || !clientId) {
      throw new Error("projectId et clientId sont requis.");
    }

    // Vérifier l'appartenance avant d'exposer les updates
    const project = await prisma.project.findFirst({
      where: { id: projectId, clientId },
      select: { id: true },
    });

    if (!project) {
      throw new Error("Projet introuvable ou accès refusé.");
    }

    const updates = await prisma.projectUpdate.findMany({
      where: { projectId },
      orderBy: { timestamp: "desc" },
      select: {
        id: true,
        updateType: true,
        details: true,
        updatedBy: true,
        services: true,
        progress: true,
        timestamp: true,
      },
    });

    return updates;
  },
};
