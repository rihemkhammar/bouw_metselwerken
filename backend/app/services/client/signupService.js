import prisma from "../../configs/prisma.js";
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