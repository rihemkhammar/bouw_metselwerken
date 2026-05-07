import prisma from "../configs/prisma.js";



export const createGuestRequest = async (data) => {
 
  let guestUser = await prisma.user.findUnique({ where: { email: data.email } });

  if (!guestUser) {
    guestUser = await prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        phone: data.phone,
        role: "GUEST",
        status: "PENDING",
        services: data.services, 
        companyName: data.companyName || null,
        address: data.address || null,
      },
    });
  }

  const request = await prisma.request.create({
    data: {
      userId: guestUser.id,
      description: data.message,
      status: "PENDING",
    },
  });

  return { guestUser, request };
};