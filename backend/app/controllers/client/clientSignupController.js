import { clientService } from "../../services/clientService.js";

export const clientSignupController = {
  /**
   * POST /api/clients/signup
   * Body: { name, email, password, phone?, companyName?, description? }
   */
  handleSignup: async (req, res) => {
    try {
      const { name, email, password, phone, companyName, description } = req.body;

      // Validation minimale requise
      if (!name?.trim() || !email?.trim() || !password) {
        return res.status(400).json({
          success: false,
          message: "Required fields: name, email, password",
        });
      }

      if (password.length < 6) {
        return res.status(400).json({
          success: false,
          message: "Password must be at least 6 characters",
        });
      }

      // Appel au service
      const result = await clientService.registerClient({
        name: name.trim(),
        email: email.trim().toLowerCase(),
        password,
        phone: phone?.trim() || null,
        companyName: companyName?.trim() || null,
        description: description?.trim() || null,
      });

      return res.status(201).json({
  success: true,
  message: "Registration pending admin approval",
  data: {
    user: {
      id: result.id,
      email: result.email,
      status: result.status,
    },
    request: {
      id: result.request.id,
      status: result.request.status,
    },
  },
});
    } catch (error) {
      console.error("Signup error:", error);

      // Gestion des erreurs connues
      if (error.message === "Email already registered") {
        return res.status(409).json({
          success: false,
          message: "Email already registered",
        });
      }

      return res.status(400).json({
        success: false,
        message: error.message || "Registration failed",
      });
    }
  },
};