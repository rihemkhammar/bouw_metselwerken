import { clientService } from "../../services/clientService.js";

export const clientProfileController = {
  // ─── GET profile ─────────────────────────────────────────────────────────────
  getProfile: async (req, res) => {
    try {
      const { userId } = req.params;
      if (String(req.user.id) !== String(userId))
        return res.status(403).json({ error: "Access denied" });

      const profile = await clientService.getProfileById(userId);
      return res.status(200).json(profile);
    } catch (err) {
      if (err.message === "User not found")
        return res.status(404).json({ error: err.message });
      return res.status(500).json({ error: "Internal server error" });
    }
  },

  // ─── PUT profile info ─────────────────────────────────────────────────────────
  updateProfile: async (req, res) => {
    try {
      const { userId } = req.params;
      if (String(req.user.id) !== String(userId))
        return res.status(403).json({ error: "Access denied" });

      const { name, phone, address, companyName } = req.body;
      const updated = await clientService.updateProfileById(userId, { name, phone, address, companyName });
      return res.status(200).json(updated);
    } catch (err) {
      if (err.message === "User not found")
        return res.status(404).json({ error: err.message });
      return res.status(400).json({ error: err.message });
    }
  },

  // ─── PUT password ─────────────────────────────────────────────────────────────
  updatePassword: async (req, res) => {
    try {
      const { userId } = req.params;
      if (String(req.user.id) !== String(userId))
        return res.status(403).json({ error: "Access denied" });

      const { currentPassword, newPassword } = req.body;
      const result = await clientService.updatePassword(userId, { currentPassword, newPassword });
      return res.status(200).json(result);
    } catch (err) {
      if (err.message === "User not found")
        return res.status(404).json({ error: err.message });
      if (err.message === "Mot de passe actuel incorrect")
        return res.status(401).json({ error: err.message });
      return res.status(400).json({ error: err.message });
    }
  },
};