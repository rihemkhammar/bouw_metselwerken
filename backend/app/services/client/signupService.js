import prisma from "../../configs/prisma.js";


export const signupService = {
  registerClient: async ({ name, email, phone, companyName, description }) => {
    // Vérifier email existant
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) throw new Error("Email already registered");

    // Créer user sans mot de passe (password = null)
    const user = await prisma.user.create({
      data: {
        name,
        email,
        //password: null,
        role: "CLIENT",
        status: "PENDING",
        phone,
        companyName,
        // other optional fields if needed
      },
    });

    // Créer la Request associée
    const request = await prisma.request.create({
      data: {
        userId: user.id,
        status: "PENDING",
        description: description || null,
      },
    });

    // Retourner un objet utile au controller
    return {
      id: user.id,
      email: user.email,
      status: user.status,
      request: {
        id: request.id,
        status: request.status,
      },
    };
  },
};