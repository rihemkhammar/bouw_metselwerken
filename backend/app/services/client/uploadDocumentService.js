import prisma from "../../configs/prisma.js";

export const uploadDocumentService = {
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
};