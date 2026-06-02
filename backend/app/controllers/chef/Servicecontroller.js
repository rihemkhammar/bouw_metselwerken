import { chefService } from "../../services/chefService.js";

export const serviceController = {
  async getChefServices(req, res) {
    try {
      const { userId } = req.params;
      const services = await  chefService.getChefServices(userId);
      res.status(200).json(services);
    } catch (error) {
      res.status(500).json({ message: "Erreur serveur", error: error.message });
    }
  },
};