import { clientService  } from "../../services/clientService.js";

export const clientProjectDetailController = {
  async getProjectDetail(req, res) {
    try {
      const { userId, projectId } = req.params;

      const project = await clientService.getProjectDetail(
        projectId,
        userId
      );

      if (!project) {
        return res.status(404).json({ error: "Projet introuvable" });
      }

      res.json(project);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },
};