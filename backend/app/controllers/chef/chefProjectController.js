import { chefService } from "../../services/chefService.js";

// GET /chef/:userId/projects
const handleGetChefProjects = async (req, res) => {
  try {
    const { userId } = req.params;
    if (req.user.id !== userId) {
      return res.status(403).json({ message: "Accès refusé" });
    }
    const projects = await chefService.getChefProjects(userId);
    return res.status(200).json({
      success: true,
      count: projects.length,
      projects,
    });
  } catch (error) {
    console.error("handleGetChefProjects error:", error);
    return res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
};

// GET /chef/:userId/projects/:projectId
const handleGetChefProjectById = async (req, res) => {
  try {
    const { userId, projectId } = req.params;
    if (req.user.id !== userId) {
      return res.status(403).json({ message: "Accès refusé" });
    }
    const project = await chefService.getChefProjectById(userId, projectId);
    if (!project) {
      return res.status(404).json({ message: "Projet introuvable ou accès refusé." });
    }
    return res.status(200).json({ success: true, project });
  } catch (error) {
    console.error("handleGetChefProjectById error:", error);
    return res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
};

// POST /chef/:userId/projects/:projectId/updates
const handleAddProjectUpdate = async (req, res) => {
  try {
    const { userId, projectId } = req.params;
    if (req.user.id !== userId) {
      return res.status(403).json({ message: "Accès refusé" });
    }
    const { updateType, details, progress, services } = req.body;
    if (!updateType || !details) {
      return res.status(400).json({ message: "updateType et details sont requis." });
    }
    const update = await chefService.addProjectUpdate(userId, projectId, {
      updateType,
      details,
      progress,
      services,
    });
    return res.status(201).json({ success: true, update });
  } catch (error) {
    console.error("handleAddProjectUpdate error:", error);
    const isAccessError = error.message.includes("accès refusé");
    return res.status(isAccessError ? 403 : 500).json({
      message: error.message || "Erreur serveur",
    });
  }
};

// PATCH /chef/:userId/projects/:projectId/status
const handleUpdateProjectStatus = async (req, res) => {
  try {
    const { userId, projectId } = req.params;
    if (req.user.id !== userId) {
      return res.status(403).json({ message: "Accès refusé" });
    }
    const { status } = req.body;
    const validStatuses = ["PLANNED", "IN_PROGRESS", "COMPLETED"];
    if (!status || !validStatuses.includes(status)) {
      return res.status(400).json({
        message: `Statut invalide. Valeurs acceptées : ${validStatuses.join(", ")}`,
      });
    }
    const updated = await chefService.updateProjectStatus(userId, projectId, status);
    return res.status(200).json({ success: true, project: updated });
  } catch (error) {
    console.error("handleUpdateProjectStatus error:", error);
    const isAccessError = error.message.includes("accès refusé");
    return res.status(isAccessError ? 403 : 500).json({
      message: error.message || "Erreur serveur",
    });
  }
};

// GET /chef/:userId/projects/:projectId/updates
const handleGetProjectUpdatesHistory = async (req, res) => {
  try {
    const { userId, projectId } = req.params;
    if (req.user.id !== userId) {
      return res.status(403).json({ message: "Accès refusé" });
    }
    const updates = await chefService.getProjectUpdatesHistory(userId, projectId);
    return res.status(200).json({
      success: true,
      count: updates.length,
      updates,
    });
  } catch (error) {
    console.error("handleGetProjectUpdatesHistory error:", error);
    const isAccessError = error.message.includes("accès refusé");
    return res.status(isAccessError ? 403 : 500).json({
      message: error.message || "Erreur serveur",
    });
  }
};

// GET /chef/:userId/projects/:projectId/progress-stats
const handleGetProjectProgressStats = async (req, res) => {
  try {
    const { userId, projectId } = req.params;
    if (req.user.id !== userId) {
      return res.status(403).json({ message: "Accès refusé" });
    }
    const stats = await chefService.getProjectProgressStats(userId, projectId);
    return res.status(200).json({
      success: true,
      stats,
    });
  } catch (error) {
    console.error("handleGetProjectProgressStats error:", error);
    const isAccessError = error.message.includes("accès refusé");
    return res.status(isAccessError ? 403 : 500).json({
      message: error.message || "Erreur serveur",
    });
  }
};

// DELETE /chef/:userId/projects/:projectId/updates/:updateId
const handleDeleteProjectUpdate = async (req, res) => {
  try {
    const { userId, projectId, updateId } = req.params;
    if (req.user.id !== userId) {
      return res.status(403).json({ message: "Accès refusé" });
    }
    const deleted = await chefService.deleteProjectUpdate(userId, projectId, updateId);
    return res.status(200).json({
      success: true,
      message: "Mise à jour supprimée avec succès",
      deleted,
    });
  } catch (error) {
    console.error("handleDeleteProjectUpdate error:", error);
    const isAccessError = error.message.includes("accès refusé");
    return res.status(isAccessError ? 403 : 500).json({
      message: error.message || "Erreur serveur",
    });
  }
};

export const chefProjectController = {
  handleGetChefProjects,
  handleGetChefProjectById,
  handleAddProjectUpdate,
  handleUpdateProjectStatus,
  handleGetProjectUpdatesHistory,
  handleGetProjectProgressStats,
  handleDeleteProjectUpdate,
};