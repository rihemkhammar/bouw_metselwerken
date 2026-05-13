import prisma from "../../configs/prisma.js";

// Récupérer tous les projets gérés par le chef
const getChefProjects = async (chefId) => {
  const projects = await prisma.project.findMany({
    where: { chefId },
    include: {
      client: {
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
          companyName: true,
          address: true,
          role: true,
        },
      },
      updates: {
        orderBy: { timestamp: "desc" },
      },
    },
  });

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
        })
      );
      return { ...project, updates };
    })
  );

  return enriched;
};

// Récupérer un seul projet
const getChefProjectById = async (chefId, projectId) => {
  const project = await prisma.project.findFirst({
    where: { id: projectId, chefId },
    include: {
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
      },
    },
  });

  if (!project) return null;

  const updates = await Promise.all(
    project.updates.map(async (update) => {
      const updater = await prisma.user.findUnique({
        where: { id: update.updatedBy },
        select: { id: true, name: true, email: true, role: true },
      });
      return { ...update, updatedByUser: updater };
    })
  );

  return { ...project, updates };
};

// Ajouter update
const addProjectUpdate = async (chefId, projectId, { updateType, details, progress, services }) => {
  const project = await prisma.project.findFirst({
    where: { id: projectId, chefId },
  });

  if (!project) throw new Error("Projet introuvable ou accès refusé.");

  return await prisma.projectUpdate.create({
    data: {
      projectId,
      updateType,
      details,
      progress: progress ?? 0,
      services,
      updatedBy: chefId,
    },
  });
};

// Update status
const updateProjectStatus = async (chefId, projectId, status) => {
  const project = await prisma.project.findFirst({
    where: { id: projectId, chefId },
  });

  if (!project) throw new Error("Projet introuvable ou accès refusé.");

  return await prisma.project.update({
    where: { id: projectId },
    data: { status },
  });
};



// ==============================
// AJOUT 1 : HISTORIQUE UPDATES
// ==============================
const getProjectUpdatesHistory = async (chefId, projectId) => {
  const project = await prisma.project.findFirst({
    where: { id: projectId, chefId },
  });

  if (!project) throw new Error("Projet introuvable ou accès refusé.");

  return await prisma.projectUpdate.findMany({
    where: { projectId },
    orderBy: { timestamp: "desc" },
  });
};


// ==============================
// AJOUT 2 : PROGRESS STATS
// ==============================
const getProjectProgressStats = async (chefId, projectId) => {
  const project = await prisma.project.findFirst({
    where: { id: projectId, chefId },
    include: {
      updates: {
        orderBy: { timestamp: "asc" },
      },
    },
  });

  if (!project) throw new Error("Projet introuvable ou accès refusé.");

  const updates = project.updates;

  const progressUpdates = updates.filter(
    (u) => u.progress !== null && u.progress !== undefined
  );

  const currentProgress =
    progressUpdates.length > 0
      ? progressUpdates[progressUpdates.length - 1].progress
      : 0;

  const averageProgress =
    progressUpdates.length > 0
      ? progressUpdates.reduce((sum, u) => sum + u.progress, 0) /
        progressUpdates.length
      : 0;

  return {
    projectId,
    projectTitle: project.title,
    projectStatus: project.status,
    totalUpdates: updates.length,
    progressUpdatesCount: progressUpdates.length,
    currentProgress,
    averageProgress: Number(averageProgress.toFixed(2)),
  };
};

export const chefProjectService = {
  getChefProjects,
  getChefProjectById,
  addProjectUpdate,
  updateProjectStatus,

 
  getProjectUpdatesHistory,
  getProjectProgressStats,
};