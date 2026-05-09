<<<<<<< HEAD
import prisma from "../../../prisma/client.js";
import bcrypt from "bcryptjs";

export const signupService = {
  /**
   * Crée un User CLIENT + une Request, tous deux en PENDING
   * Champs admin (address, matricule) restent null
   */
  async createPendingClient(signupData) {
    const { name, email, password, phone, companyName, description } = signupData;

    // Vérifier email unique
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      throw new Error("Email already registered");
    }

    // Hasher mot de passe
    const hashedPassword = await bcrypt.hash(password, 10);

    // Transaction atomique User + Request
    return await prisma.$transaction(async (tx) => {
      const newUser = await tx.user.create({
  data: {
    name,
    email,
    password: hashedPassword,
    role: "CLIENT",
    status: "PENDING",
    phone: phone || null,
    companyName: companyName || null,
    requests: {
      create: {
        status: "PENDING",
        description: description || null,
      },
    },
  },
  include: {
    requests: true,
  },
});

      return {
        id: newUser.id,
        email: newUser.email,
        status: newUser.status,
        request: newUser.requests[0],
      };
    });
  },
};
=======
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
>>>>>>> origin/GuestPage_Rihem
