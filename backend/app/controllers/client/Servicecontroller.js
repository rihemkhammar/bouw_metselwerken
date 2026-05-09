import { clientService } from "../../services/clientService.js";

export const serviceController = {
  async getAllServices(req, res) {
    try {
      const services = await clientService.getAllServices();
      res.status(200).json(services);
    } catch (error) {
      res.status(500).json({ message: "Erreur serveur", error: error.message });
    }
  },
};