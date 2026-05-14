import prisma from "../../configs/prisma.js";

export const clientProjectDetailService = {
  async getProjectDetail(projectId, clientId) {
    const project = await prisma.project.findFirst({
      where: {
        id: projectId,
        clientId,
      },
      include: {
        // Détails du chef de projet
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
        // Détails du client
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
        // Mises à jour avec tous les détails
        updates: {
          orderBy: {
            timestamp: "desc",
          },
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
};