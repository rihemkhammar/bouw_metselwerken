import { chefService } from "../../services/chefService.js";

export const chefProfileController = {
  getProfile: async (req, res) => {
    try {
      const { userId } = req.params;

      if (String(req.user.id) !== String(userId)) {
        return res.status(403).json({
          error: "Access denied",
        });
      }

      const profile = await chefService.getProfileById(userId);

      return res.status(200).json(profile);
    } catch (err) {
      if (err.message === "User not found") {
        return res.status(404).json({
          error: err.message,
        });
      }

      return res.status(500).json({
        error: "Internal server error",
      });
    }
  },
};