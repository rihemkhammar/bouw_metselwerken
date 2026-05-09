import { clientService } from "../../services/clientService.js";

const handleGetClientProjects = async (req, res) => {
  try {
    const { userId } = req.params;

    // Sécurité : un client ne peut voir que SES projets
    if (req.user.id !== userId) {
      return res.status(403).json({ message: "Accès refusé" });
    }

    const projects = await clientService.getClientProjects(userId);

    return res.status(200).json({
      success: true,
      count: projects.length,
      projects,
    });
  } catch (error) {
    console.error("handleGetClientProjects error:", error);
    return res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
};

export const clientProjectController = {
  handleGetClientProjects,
};