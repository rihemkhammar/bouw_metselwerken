// controllers/client/uploadDocumentController.js
import { clientService } from "../../services/clientService.js";

export const uploadDocumentController = {
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
};