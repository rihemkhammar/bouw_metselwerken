import prisma from "../../configs/prisma.js";

export const clientProfileService = {
  getProfileById: async (userId) => {
    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
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
      },
    });

    if (!user) {
      throw new Error("User not found");
    }

  
    return user;
  },
};