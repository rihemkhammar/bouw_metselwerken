import { clientService } from "../../services/clientService.js";

export const clientSignupController = {
  /**
   * POST /api/clients/signup
   * Body: { name, email, phone?, companyName?, description? }
   */
  handleSignup: async (req, res) => {
    try {
      const { name, email, phone, companyName, description } = req.body;

      // Validation minimale
      if (!name?.trim() || !email?.trim()) {
        return res.status(400).json({
          success: false,
          message: "Required fields: name, email",
        });
      }

      // Appel au service (sans password)
      const result = await clientService.registerClient({
        name: name.trim(),
        email: email.trim().toLowerCase(),
        phone: phone?.trim() || null,
        companyName: companyName?.trim() || null,
        description: description?.trim() || null,
      });

      return res.status(201).json({
        success: true,
        message: "Registration request created, pending admin approval",
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
      if (error.message === "Email already registered") {
        return res.status(409).json({ success: false, message: "Email already registered" });
      }
      return res.status(400).json({ success: false, message: error.message || "Registration failed" });
    }
  },
};
