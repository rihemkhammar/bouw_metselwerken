import prisma from "../../configs/prisma.js";

const getClientProjects = async (userId) => {
  const projects = await prisma.project.findMany({
    where: { clientId: userId },
    include: {
      chef: {
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
          role: true,
        },
      },
      updates: {
        orderBy: { timestamp: "desc" },
      }

    },
  });

  // Enrichir chaque update avec les infos du user qui a mis à jour
  const enriched = await Promise.all(
    projects.map(async (project) => {
      const updates = await Promise.all(
        project.updates.map(async (update) => {
          const updater = await prisma.user.findUnique({
            where: { id: update.updatedBy },
            select: {
              id: true,
              name: true,
              email: true,
              role: true,
            },
          });
          return { ...update, updatedByUser: updater };
        }),
      );
      return { ...project, updates };
    }),
  );

  return enriched;
};

export const clientProjectService = {
  getClientProjects,
};
