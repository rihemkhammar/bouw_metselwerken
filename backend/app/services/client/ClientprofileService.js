import prisma from "../../configs/prisma.js";
import bcrypt from "bcryptjs";

export const clientProfileService = {
  // ─── Get profile ────────────────────────────────────────────────────────────
  getProfileById: async (userId) => {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id:          true,
        name:        true,
        email:       true,
        role:        true,
        status:      true,
        phone:       true,
        companyName: true,
        address:     true,
        matricule:   true,
        createdAt:   true,
        projects: {
          select: { id: true, status: true, services: true },
        },
        requests: {
          select: { id: true, status: true },
        },
      },
    });

    if (!user) throw new Error("User not found");

    const projectStats = {
      total:      user.projects.length,
      planned:    user.projects.filter((p) => p.status === "PLANNED").length,
      inProgress: user.projects.filter((p) => p.status === "IN_PROGRESS").length,
      completed:  user.projects.filter((p) => p.status === "COMPLETED").length,
    };

    const allServices = user.projects.flatMap((p) =>
      Array.isArray(p.services) ? p.services : p.services ? [p.services] : []
    );
    const uniqueServices = [...new Set(allServices)];

    const requestStats = {
      total:    user.requests.length,
      pending:  user.requests.filter((r) => r.status === "PENDING").length,
      approved: user.requests.filter((r) => r.status === "APPROVED").length,
      declined: user.requests.filter((r) => r.status === "DECLINED").length,
      blocked:  user.requests.filter((r) => r.status === "BLOCKED").length,
    };

    const { projects, requests, ...profile } = user;

    return {
      ...profile,
      stats: {
        projects: projectStats,
        services: { total: uniqueServices.length, list: uniqueServices },
        requests: requestStats,
      },
    };
  },

  // ─── Update profile info ─────────────────────────────────────────────────────
  updateProfileById: async (userId, data) => {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new Error("User not found");

    const allowedFields = ["name", "phone", "address", "companyName"];
    const updateData = {};

    for (const field of allowedFields) {
      if (data[field] !== undefined && data[field] !== null) {
        const val = typeof data[field] === "string" ? data[field].trim() : data[field];
        if (field === "name" && val === "") throw new Error("Le nom ne peut pas être vide");
        updateData[field] = val === "" ? null : val;
      }
    }

    if (Object.keys(updateData).length === 0)
      throw new Error("Aucune donnée à mettre à jour");

    const updated = await prisma.user.update({
      where: { id: userId },
      data:  updateData,
      select: {
        id: true, name: true, email: true, phone: true,
        address: true, companyName: true, matricule: true,
        role: true, status: true, createdAt: true,
      },
    });

    return updated;
  },

  // ─── Update password ─────────────────────────────────────────────────────────
  updatePassword: async (userId, { currentPassword, newPassword }) => {
    if (!currentPassword || !newPassword)
      throw new Error("Tous les champs sont requis");

    if (newPassword.length < 8)
      throw new Error("Le nouveau mot de passe doit contenir au moins 8 caractères");

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, password: true },
    });

    if (!user) throw new Error("User not found");

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) throw new Error("Mot de passe actuel incorrect");

    if (currentPassword === newPassword)
      throw new Error("Le nouveau mot de passe doit être différent de l'actuel");

    const hashed = await bcrypt.hash(newPassword, 12);

    await prisma.user.update({
      where: { id: userId },
      data:  { password: hashed },
    });

    return { message: "Mot de passe mis à jour avec succès" };
  },
};