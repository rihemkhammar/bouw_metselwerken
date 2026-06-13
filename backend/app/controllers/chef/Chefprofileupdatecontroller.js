import { chefService } from "../../services/chefService.js";

export const chefProfileUpdateController = {
  /**
   * PUT /chef/:userId/profile
   */
  updateProfile: async (req, res) => {
    try {
      const { userId } = req.params;

      // S'assurer que le chef ne modifie que son propre profil
      if (req.user.id !== userId) {
        return res.status(403).json({ error: "Accès refusé" });
      }

      const updated = await chefService.updateProfile(userId, req.body);
      return res.status(200).json({ message: "Profil mis à jour", user: updated });
    } catch (err) {
      return res.status(400).json({ error: err.message });
    }
  },

  /**
   * PATCH /chef/:userId/profile/password
   */
  updatePassword: async (req, res) => {
    try {
      const { userId } = req.params;

      if (req.user.id !== userId) {
        return res.status(403).json({ error: "Accès refusé" });
      }

      const result = await chefService .updatePassword(userId, req.body);
      return res.status(200).json(result);
    } catch (err) {
      return res.status(400).json({ error: err.message });
    }
  },
};