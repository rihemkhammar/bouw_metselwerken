import { createGuestRequest } from "../services/guestService.js";

export const submitGuestRequest = async (req, res) => {
  try {
    const { name, email, phone, services, message, companyName, address } = req.body;

    if (!name || !email || !phone || !services?.length || !message) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const result = await createGuestRequest({
      name,
      email,
      phone,
      services,
      message,
      companyName,
      address,
    });

    res.status(201).json({
      message: "Request submitted successfully",
      data: result,
    });
  } catch (err) {
    console.error("Error submitting guest request:", err);
    res.status(500).json({ error: "Failed to submit request" });
  }
};
