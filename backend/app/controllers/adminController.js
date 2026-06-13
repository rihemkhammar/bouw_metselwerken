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
  getAllProjectsService,
  getServicesWithChefsService,
  getAdminDashboardService,
  getProjectByIdService,
  getProjectsByServiceService,
  createProjectService,
  deleteProjectService,
  deleteClientService,
  updateClientService,
  deleteChefService,
  updateChefService ,
  updateProjectService,
  getServicesListService,
  assignChefToServiceService,
  removeChefFromServiceService,
  resetClientPasswordService,
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

export const getAllProjectsController = async (req, res) => {
  try {
    const projects = await getAllProjectsService();
    res.json(projects);
  } catch (err) {
    console.error("Erreur getAllProjects:", err);
    res.status(500).json({ error: "Impossible de charger les projets" });
  }
};



export const getProjectByIdController = async (req, res) => {
  const { id } = req.params;
  try {
    const project = await getProjectByIdService(id);
    if (!project) return res.status(404).json({ error: "Projet introuvable" });
    res.json(project);
  } catch (err) {
    console.error("Erreur getProjectById:", err);
    res.status(500).json({ error: "Impossible de charger le projet" });
  }
};

export const getServicesWithChefsController = async (req, res) => {
  try {
    const data = await getServicesWithChefsService();
    res.json(data);
  } catch (err) {
    console.error("Erreur getServicesWithChefs:", err);
    res.status(500).json({ error: "Impossible de charger les services avec chefs" });
  }
};

export const getAdminDashboard = async (req, res) => {
  try {
    const data = await getAdminDashboardService();
    res.json(data);
  } catch (error) {
  console.error("Dashboard error:", error);
  res.status(500).json({ error: error.message });
};

}


export const getProjectsByServiceController = async (req, res) => {
  try {
    const { service } = req.query;

    if (!service) {
      return res.status(400).json({ error: "Service manquant" });
    }

    const projects = await getProjectsByServiceService(service);

    return res.json(projects);
  } catch (err) {
    console.error("Erreur getProjectsByService:", err);
    return res.status(500).json({ error: "Erreur serveur" });
  }
};

// Ajouter ce controller
export const createProjectController = async (req, res) => {
  const { title, description, budget, services, clientId, chefId } = req.body;
  if (!title || !services || !clientId || !chefId) {
    return res.status(400).json({ error: "Champs obligatoires manquants (title, services, clientId, chefId)" });
  }
  try {
    const project = await createProjectService({ title, description, budget, services, clientId, chefId });
    res.status(201).json(project);
  } catch (err) {
    console.error("Erreur createProject:", err);
    res.status(500).json({ error: "Impossible de créer le projet" });
  }
};


export const deleteProjectController = async (req, res) => {
  const { id } = req.params;
  try {
    await deleteProjectService(id);
    res.json({ message: "Projet supprimé avec succès" });
  } catch (err) {
    console.error("Erreur deleteProject:", err);
    res.status(500).json({ error: "Impossible de supprimer le projet" });
  }
};
export const deleteClientController = async (req, res) => {
  const { id } = req.params;
  try {
    await deleteClientService(id);
    res.json({ message: "Client supprimé avec succès" });
  } catch (err) {
    console.error("Erreur deleteClient:", err);
    res.status(500).json({ error: "Impossible de supprimer le client" });
  }
};
export const updateClientController = async (req, res) => {
  const { id } = req.params;
  const { name, email, phone, companyName, address } = req.body;
  try {
    const updated = await updateClientService(id, { name, email, phone, companyName, address });
    res.json(updated);
  } catch (err) {
    console.error("Erreur updateClient:", err);
    res.status(500).json({ error: "Impossible de modifier le client" });
  }
};
export const deleteChefController = async (req, res) => {
  const { id } = req.params;
  try {
    await deleteChefService(id);
    res.json({ message: "Chef supprimé avec succès" });
  } catch (err) {
    console.error("Erreur deleteChef:", err);
    res.status(500).json({ error: "Impossible de supprimer le chef" });
  }
};

export const updateChefController = async (req, res) => {
  const { id } = req.params;
  const { name, email, phone } = req.body;
  try {
    const updated = await updateChefService(id, { name, email, phone });
    res.json(updated);
  } catch (err) {
    console.error("Erreur updateChef:", err);
    res.status(500).json({ error: "Impossible de modifier le chef" });
  }
};
export const updateProjectController = async (req, res) => {
  const { id } = req.params;
  const { title, description, budget, services, clientId, chefId, status } = req.body;
  try {
    const updated = await updateProjectService(id, { title, description, budget, services, clientId, chefId, status });
    res.json(updated);
  } catch (err) {
    console.error("Erreur updateProject:", err);
    res.status(500).json({ error: "Impossible de modifier le projet" });
  }
};



export const getServicesListController = async (req, res) => {
  try {
    const data = await getServicesListService();
    res.json(data);
  } catch (err) {
    console.error("Erreur getServicesList:", err);
    res.status(500).json({ error: "Impossible de charger les services" });
  }
};

export const assignChefToServiceController = async (req, res) => {
  const { service } = req.params;
  const { chefId } = req.body;
  if (!chefId) return res.status(400).json({ error: "chefId requis" });
  try {
    await assignChefToServiceService(chefId, service);
    res.json({ success: true });
  } catch (err) {
    console.error("Erreur assignChefToService:", err);
    res.status(500).json({ error: err.message });
  }
};

export const removeChefFromServiceController = async (req, res) => {
  const { service, chefId } = req.params;
  try {
    await removeChefFromServiceService(chefId, service);
    res.json({ success: true });
  } catch (err) {
    console.error("Erreur removeChefFromService:", err);
    res.status(500).json({ error: err.message });
  }
};
export const resetClientPasswordController = async (req, res) => {
  const { id } = req.params;
  const { newPassword } = req.body;

  if (!newPassword) {
    return res.status(400).json({ error: "Le nouveau mot de passe est requis" });
  }

  try {
    const result = await resetClientPasswordService(id, newPassword);
    res.json(result);
  } catch (err) {
    console.error("Erreur resetClientPassword:", err);
    res.status(400).json({ error: err.message || "Impossible de modifier le mot de passe" });
  }
};