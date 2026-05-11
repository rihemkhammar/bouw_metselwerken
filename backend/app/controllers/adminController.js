import {
  createChefService,
  getChefsService,
  getClientsService,
  getGuestsService,
  approveClientRequest,
  declineClientRequest,
  getClientRequests,
  markGuestRequestViewedService,
  markClientRequestViewedService,
  getProfile,
  updateProfile,
} from "../services/adminService.js";

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
    res.status(500).json({ error: err.message });
  }
};

export const fetchChefs = async (req, res) => {
  try {
    const chefs = await getChefsService();
    res.status(200).json(chefs.length ? chefs : { message: "No Chefs yet" });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch chefs" });
  }
};

export const fetchClients = async (req, res) => {
  try {
    const clients = await getClientsService();
    res
      .status(200)
      .json(clients.length ? clients : { message: "No Clients yet" });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch clients" });
  }
};

export const fetchGuests = async (req, res) => {
  try {
    const guests = await getGuestsService();
    res.status(200).json(guests.length ? guests : { message: "No guests yet" });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch guests" });
  }
};

export const fetchClientRequestsController = async (req, res) => {
  try {
    const requests = await getClientRequests();
    res.json(requests);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const approveRequestController = async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const result = await approveClientRequest(req.params.id, req.user.id);
    return res.json({ success: true, request: result });
  } catch (err) {
    if (err.message === "Request not found") {
      return res.status(404).json({ error: err.message });
    }
    if (err.message === "Request already processed") {
      return res.status(409).json({ error: err.message }); // Conflict
    }
    return res.status(400).json({ error: err.message });
  }
};

export const declineRequestController = async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    const result = await declineClientRequest(req.params.id, req.user.id);
    res.json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const markGuestRequestViewedController = async (req, res) => {
  try {
    const updated = await markGuestRequestViewedService(req.params.id);
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const markClientRequestViewedController = async (req, res) => {
  try {
    const updated = await markClientRequestViewedService(req.params.id);
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const getProfileSettings = async (req, res) => {
  try {
    const admin = await getProfile();
    if (!admin) {
      console.error("No admin found in DB");
      return res.status(404).json({ error: "Admin not found" });
    }
    res.json(admin);
  } catch (error) {
    console.error("Error fetching admin profile:", error);
    res.status(500).json({ error: error.message });
  }
};



export const updateProfileSettings = async (req, res) => {
  const { name, email, phone, address } = req.body;

  try {
    await updateProfile({ name, email, phone, address });
    res.json({ message: "Profile updated successfully" });
  } catch (error) {
    console.error("Error updating admin profile:", error);
    res.status(500).json({ error: "Failed to update admin profile" });
  }
};