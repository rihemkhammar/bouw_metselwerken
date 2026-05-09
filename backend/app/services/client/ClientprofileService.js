import prisma from "../../configs/prisma.js";

export const clientProfileService = {
  getProfileById: async (userId) => {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        status: true,
        phone: true,
        companyName: true,
        address: true,
        matricule: true,
        projects: {
          select: {
            id: true,
            status: true,
            services: true,
          },
        },
        requests: {
          select: {
            id: true,
            status: true,
          },
        },
      },
    });

    if (!user) {
      throw new Error("User not found");
    }

    // Aggregate project stats
    const projectStats = {
      total: user.projects.length,
      planned: user.projects.filter((p) => p.status === "PLANNED").length,
      inProgress: user.projects.filter((p) => p.status === "IN_PROGRESS").length,
      completed: user.projects.filter((p) => p.status === "COMPLETED").length,
    };

    // Collect unique services across all projects
    const allServices = user.projects.flatMap((p) =>
      Array.isArray(p.services) ? p.services : p.services ? [p.services] : []
    );
    const uniqueServices = [...new Set(allServices)];

    // Aggregate request stats
    const requestStats = {
      total: user.requests.length,
      pending: user.requests.filter((r) => r.status === "PENDING").length,
      approved: user.requests.filter((r) => r.status === "APPROVED").length,
      declined: user.requests.filter((r) => r.status === "DECLINED").length,
      blocked: user.requests.filter((r) => r.status === "BLOCKED").length,
    };

    // Return clean profile without raw arrays
    const { projects, requests, ...profile } = user;

    return {
      ...profile,
      stats: {
        projects: projectStats,
        services: {
          total: uniqueServices.length,
          list: uniqueServices,
        },
        requests: requestStats,
      },
    };
  },
};