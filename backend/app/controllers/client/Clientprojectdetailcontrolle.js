// controllers/clientProjectDetailController.js
import { clientService } from "../../services/clientService.js";


export const clientProjectDetailController = {
  // GET /client/:userId/projects/:projectId 
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

      return res.status(200).json(project);
    } catch (err) {
      console.error("[getProjectDetail]", err.message);
      return res.status(500).json({ error: err.message });
    }
  },

  // ─── POST /client/:userId/projects/:projectId/documents 
  async uploadDocument(req, res) {
    try {
      const { userId, projectId } = req.params;
      const file = req.file;

      if (!file) {
        return res.status(400).json({ error: "Aucun fichier fourni." });
      }

      const document = await clientService.uploadDocument(
        projectId,
        userId,
        file
      );

      return res.status(201).json(document);
    } catch (err) {
      console.error("[uploadDocument]", err.message);
      return res.status(500).json({ error: err.message });
    }
  },

  //  GET /client/:userId/projects/:projectId/updates 
  async getProjectUpdates(req, res) {
    try {
      const { userId, projectId } = req.params;

      const updates = await clientService.getProjectUpdates(
        projectId,
        userId
      );

      return res.status(200).json(updates);
    } catch (err) {
      console.error("[getProjectUpdates]", err.message);
      return res.status(500).json({ error: err.message });
    }
  },
};
