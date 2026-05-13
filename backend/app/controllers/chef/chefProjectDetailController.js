import { chefService } from "../../services/chefService.js";

// GET /chef/:userId/projects/:projectId/detail
// Récupère les détails complets du projet
const handleGetProjectDetail = async (req, res) => {
  try {
    const { userId, projectId } = req.params;

    // Vérifier que l'utilisateur accède à son propre profil
    if (req.user.id !== userId) {
      return res.status(403).json({ message: "Accès refusé" });
    }

    const project = await chefService.getProjectDetail(
      projectId,
      userId
    );

    if (!project) {
      return res.status(404).json({
        message: "Projet introuvable ou accès refusé.",
      });
    }

    return res.status(200).json({
      success: true,
      project,
    });
  } catch (error) {
    console.error("handleGetProjectDetail error:", error);
    return res.status(500).json({
      message: "Erreur serveur",
      error: error.message,
    });
  }
};

// GET /chef/:userId/projects/:projectId/detail/stats
// Récupère les détails avec les statistiques
const handleGetProjectDetailWithStats = async (req, res) => {
  try {
    const { userId, projectId } = req.params;

    if (req.user.id !== userId) {
      return res.status(403).json({ message: "Accès refusé" });
    }

    const project = await chefService.getProjectDetailWithStats(
      projectId,
      userId
    );

    if (!project) {
      return res.status(404).json({
        message: "Projet introuvable ou accès refusé.",
      });
    }

    return res.status(200).json({
      success: true,
      project,
    });
  } catch (error) {
    console.error("handleGetProjectDetailWithStats error:", error);
    return res.status(500).json({
      message: "Erreur serveur",
      error: error.message,
    });
  }
};

// GET /chef/:userId/projects/:projectId/detail/full
// Récupère les détails complets du projet avec toutes les relations
const handleGetProjectDetailFull = async (req, res) => {
  try {
    const { userId, projectId } = req.params;

    if (req.user.id !== userId) {
      return res.status(403).json({ message: "Accès refusé" });
    }

    const project = await chefService.getProjectDetailFull(
      projectId,
      userId
    );

    if (!project) {
      return res.status(404).json({
        message: "Projet introuvable ou accès refusé.",
      });
    }

    return res.status(200).json({
      success: true,
      project,
    });
  } catch (error) {
    console.error("handleGetProjectDetailFull error:", error);
    return res.status(500).json({
      message: "Erreur serveur",
      error: error.message,
    });
  }
};

export const chefProjectDetailController = {
  handleGetProjectDetail,
  handleGetProjectDetailWithStats,
  handleGetProjectDetailFull,
};