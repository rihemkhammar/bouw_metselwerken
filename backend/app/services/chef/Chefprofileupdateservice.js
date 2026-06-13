import prisma from "../../configs/prisma.js";
import bcrypt from "bcryptjs";

export const chefProfileUpdateService = {
  /**
   * Met à jour le profil du chef (nom, email, téléphone…)
   * NOTE: "specialty" n'existe pas dans le schéma User, donc on l'ignore ici.
   */
  updateProfile: async (userId, data) => {
    const { name, email, phone } = data; // specialty retiré

    const chef = await prisma.user.findUnique({ where: { id: userId } });
    if (!chef || chef.role !== "CHEF") {
      throw new Error("Chef introuvable");
    }

    if (email && email !== chef.email) {
      const existing = await prisma.user.findUnique({ where: { email } });
      if (existing) throw new Error("Cet email est déjà utilisé");
    }

    const updated = await prisma.user.update({
      where: { id: userId },
      data: {
        ...(name  && { name }),
        ...(email && { email }),
        ...(phone !== undefined && { phone }),
      },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        role: true,
        createdAt: true,
      },
    });

    return updated;
  },

  /**
   * Change le mot de passe du chef
   */
  updatePassword: async (userId, { currentPassword, newPassword }) => {
    const chef = await prisma.user.findUnique({ where: { id: userId } });
    if (!chef || chef.role !== "CHEF") {
      throw new Error("Chef introuvable");
    }

    const isMatch = await bcrypt.compare(currentPassword, chef.password);
    if (!isMatch) throw new Error("Mot de passe actuel incorrect");

    const hashed = await bcrypt.hash(newPassword, 10);
    await prisma.user.update({
      where: { id: userId },
      data: { password: hashed },
    });

    return { message: "Mot de passe mis à jour avec succès" };
  },
};