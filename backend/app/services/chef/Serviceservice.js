import prisma from "../../configs/prisma.js";

export const serviceService = {
  // Pour le chef : ses propres services avec ses projets et clients
  async getChefServices(chefId) {
    const projects = await prisma.project.findMany({
      where: { chefId },
      select: {
        id: true,
        title: true,
        services: true,   // enum Service (valeur unique)
        status: true,
        client: {
          select: { id: true, name: true, companyName: true }
        },
      },
    });

    const serviceMap = {};
    for (const project of projects) {
      const svc = project.services; // c'est un enum, une seule valeur
      if (!serviceMap[svc]) {
        serviceMap[svc] = {
          service: svc,
          projectCount: 0,
          clientCount: 0,
          clients: [],
          projects: [],
        };
      }
      serviceMap[svc].projectCount += 1;
      serviceMap[svc].projects.push({
        id: project.id,
        title: project.title,
        status: project.status,
      });
      const alreadyAdded = serviceMap[svc].clients.some(
        (c) => c.id === project.client.id
      );
      if (!alreadyAdded) {
        serviceMap[svc].clients.push(project.client);
        serviceMap[svc].clientCount += 1;
      }
    }
    return Object.values(serviceMap);
  },

  // Pour la page publique : tous les services avec chefs
  async getAllServices() {
    const projects = await prisma.project.findMany({
      select: {
        services: true,
        chef: { select: { id: true, name: true, email: true } },
      },
    });

    const serviceMap = {};
    for (const project of projects) {
      const svc = project.services;
      if (!serviceMap[svc]) {
        serviceMap[svc] = { service: svc, projectCount: 0, chefs: [] };
      }
      serviceMap[svc].projectCount += 1;
      if (!serviceMap[svc].chefs.some((c) => c.id === project.chef.id)) {
        serviceMap[svc].chefs.push(project.chef);
      }
    }
    return Object.values(serviceMap);
  },
};