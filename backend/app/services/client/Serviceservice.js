// services/serviceService.js
import prisma from "../../configs/prisma.js";


export const serviceService = {
  async getAllServices() {
   
    const projects = await prisma.project.findMany({
      select: {
        services: true,
        chef: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    const serviceMap = {};
    for (const project of projects) {
      const svc = project.services;
      if (!serviceMap[svc]) {
        serviceMap[svc] = {
          service: svc,
          projectCount: 0,
          chefs: [],
        };
      }
      serviceMap[svc].projectCount += 1;
      const alreadyAdded = serviceMap[svc].chefs.some(
        (c) => c.id === project.chef.id
      );
      if (!alreadyAdded) {
        serviceMap[svc].chefs.push(project.chef);
      }
    }
    return Object.values(serviceMap);
  },
};