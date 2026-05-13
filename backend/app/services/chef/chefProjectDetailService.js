import prisma from "../../configs/prisma.js";

export const chefProjectDetailService = {
  // Récupère les détails complets d'un projet
  async getProjectDetail(projectId, chefId) {
    try {
      const project = await prisma.project.findFirst({
        where: {
          id: projectId,
          chefId: chefId, // Vérifier que le chef accède à son projet
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
          // Services du projet
          services: {
            select: {
              id: true,
              name: true,
              description: true,
              // Ajouter d'autres champs selon votre modèle
            },
          },
        },
      });

      if (!project) {
        return null;
      }

      return project;
    } catch (error) {
      console.error("Erreur lors de la récupération du détail du projet:", error);
      throw error;
    }
  },

  // Récupère les détails complets avec statistiques
  async getProjectDetailWithStats(projectId, chefId) {
    try {
      const project = await this.getProjectDetail(projectId, chefId);

      if (!project) {
        return null;
      }

      // Calculer les statistiques
      const progressUpdates = project.updates.filter(
        (u) => u.updateType === "progress update"
      );
      
      const stats = {
        totalUpdates: project.updates.length,
        progressUpdates: progressUpdates.length,
        budgetUpdates: project.updates.filter(
          (u) => u.updateType === "budget update"
        ).length,
        infoUpdates: project.updates.filter(
          (u) => u.updateType === "info added"
        ).length,
        stateChanges: project.updates.filter(
          (u) => u.updateType === "state change"
        ).length,
        lastUpdateDate: project.updates[0]?.timestamp || null,
        progressHistory: progressUpdates.map((u) => ({
          progress: u.progress,
          timestamp: u.timestamp,
        })),
      };

      return {
        ...project,
        stats,
      };
    } catch (error) {
      console.error(
        "Erreur lors de la récupération du détail avec stats du projet:",
        error
      );
      throw error;
    }
  },

  // Récupère les détails avec les services et informations détaillées
  async getProjectDetailFull(projectId, chefId) {
    try {
      const project = await prisma.project.findFirst({
        where: {
          id: projectId,
          chefId: chefId,
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
              role: true,
              createdAt: true,
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
              createdAt: true,
            },
          },
          updates: {
            orderBy: {
              timestamp: "desc",
            },
            include: {
              // Si vous avez une relation avec un utilisateur pour updatedBy
              // updatedByUser: {
              //   select: {
              //     id: true,
              //     name: true,
              //     email: true,
              //   },
              // },
            },
          },
          services: {
            include: {
              // Ajouter les relations des services si nécessaire
            },
          },
        },
      });

      if (!project) {
        return null;
      }

      return project;
    } catch (error) {
      console.error(
        "Erreur lors de la récupération complète du projet:",
        error
      );
      throw error;
    }
  },
};