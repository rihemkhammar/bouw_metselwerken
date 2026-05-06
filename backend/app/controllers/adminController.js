import { createChefService } from "../services/adminService.js";
export const createChef = async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ error: "Tous les champs sont requis" });
  }

  try {
    const chef = await createChefService({ name, email, password });
    res.status(201).json({
      message: "Chef créé avec succès",
      chef: {
        id: chef.id,
        name: chef.name,
        email: chef.email,
        role: chef.role,
        status: chef.status,
      },
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};