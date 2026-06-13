//frontend calls -> backend 
const API_URL = "http://localhost:5000";  //only locally 
// Helper to handle responses
const handleResponse = async (res) => {
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || "Request failed");
  }
  return data;
};

// Login request
export const login = async (email, password) => {
  const res = await fetch(`${API_URL}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  const data = await handleResponse(res);
  localStorage.setItem("token", data.token);
  localStorage.setItem("userId", data.user.id); 
  return data;
};


// create chef 
export const createChef = async (chefData) => {
  const token = localStorage.getItem("token"); 
  const res = await fetch(`${API_URL}/admin/chefs/create`, {
    method: "POST",
    headers: { 
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`, 
    },
    body: JSON.stringify(chefData),
  });
  return handleResponse(res);
};

// get all chefs
export const getChefs = async () => {
  const token = localStorage.getItem("token");
  const res = await fetch(`${API_URL}/admin/chefs`, {
    method: "GET",
    headers: { "Content-Type": "application/json" ,
    Authorization: `Bearer ${token}`,
    },
  });
  return handleResponse(res);
};
// get all clients
export const getClients = async () => {
  const token = localStorage.getItem("token");
  const res = await fetch(`${API_URL}/admin/clients`, {
    method: "GET",
    headers: { "Content-Type": "application/json" ,
    Authorization: `Bearer ${token}`,
    },
  });
  return handleResponse(res);
};

export const sendContactRequest = async (formData) => {
  const res = await fetch(`${API_URL}/contact`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(formData),
  });
  return handleResponse(res);
};

// get list guests requests 
export const getGuests = async () => {
  const token = localStorage.getItem("token");
  const res = await fetch(`${API_URL}/admin/guests/demandes` , {
        method: "GET",
    headers: { "Content-Type": "application/json" ,
    Authorization: `Bearer ${token}`,
    },
  });
  if (!res.ok) throw new Error("Failed to fetch guests");
  return res.json();
};

export const getClientRequests = async () => {
  const token = localStorage.getItem("token");
  const res = await fetch(`${API_URL}/admin/clients/demandes`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  if (!res.ok) throw new Error("Failed to fetch client requests");
  return res.json();
};

export const approveClientRequest = async (id) => {
  const token = localStorage.getItem("token");
  const res = await fetch(`${API_URL}/admin/clients/demandes/${id}/approve`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` }
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || "Failed to approve request");
  }
  return data; 
};


export const declineClientRequest = async (id) => {
  const token = localStorage.getItem("token");
  const res = await fetch(`${API_URL}/admin/clients/demandes/${id}/decline`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` }
  });
  if (!res.ok) throw new Error("Failed to decline request");
  return res.json();
};
export const markGuestRequestViewed = async (id) => {
  const token = localStorage.getItem("token");
  const res = await fetch(`${API_URL}/admin/guests/demandes/${id}/view`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` }
  });
  if (!res.ok) throw new Error("Failed to mark as viewed");
  return res.json();
};
export const markClientRequestViewed = async (id) => {
  const token = localStorage.getItem("token");
  const res = await fetch(`${API_URL}/admin/clients/demandes/${id}/view`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` }
  });
  if (!res.ok) throw new Error("Failed to mark client request as viewed");
  return res.json();
};


// GET user profile
export const fetchClientProfile = async (userId, token) => {
  const res = await fetch(
    `${API_URL}/client/${userId}/profile`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return handleResponse(res);
};
export const fetchChefProfile = async (userId, token) => {
  const res = await fetch(
    `${API_URL}/chef/${userId}/profile`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return handleResponse(res);
};
// Creation request Account 

export const requestAccountCreation = async ({ 
  name, 
  email, 
  phone, 
  companyName, 
  description 
}) => {
  const res = await fetch(`${API_URL}/client/signup`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      name: name?.trim(),
      email: email?.trim().toLowerCase(),
      phone: phone?.trim() || null,
      companyName: companyName?.trim() || null,
      description: description?.trim() || null,
    }),
  });
  return handleResponse(res);
};

export const getProjects = async (userId) => {
  const token = localStorage.getItem("token");
  const res = await fetch(`${API_URL}/client/${userId}/projects`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  return handleResponse(res);
};
//////////////////


export const getProjectsChef = async (userId) => {
  const token = localStorage.getItem("token");
  const res = await fetch(`${API_URL}/chef/${userId}/projects`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  return handleResponse(res);
};
// GET project detail (client)
export const getProjectDetail = async (projectId, userId) => {
  const token = localStorage.getItem("token");
  const res = await fetch(`${API_URL}/client/${userId}/projects/${projectId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  return handleResponse(res);

};

// GET project detail (admin)
export const getProjectById = async (projectId) => {
  const token = localStorage.getItem("token");
  const res = await fetch(`${API_URL}/admin/projects/${projectId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  return handleResponse(res);
};

export const getProjectDetailChef = async (projectId, userId) => {
  const token = localStorage.getItem("token");

  console.log("[API] getProjectDetailChef REQUEST:", { projectId, userId });

  const res = await fetch(`${API_URL}/chef/${userId}/projects/${projectId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  console.log("[API] getProjectDetailChef STATUS:", res.status);

  return handleResponse(res);
};

export const getServices = async () => {
  const token = localStorage.getItem("token");

  console.log("[API] getServices REQUEST");

  const res = await fetch(`${API_URL}/client/services`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  console.log("[API] getServices STATUS:", res.status);

  return handleResponse(res);
};
// POST - Ajouter une mise à jour de projet (chef)
export const addProjectUpdate = async (userId, projectId, updateData) => {
  const token = localStorage.getItem("token");

  console.log("[API] addProjectUpdate REQUEST:", {
    userId,
    projectId,
    updateData,
  });

  const res = await fetch(
    `${API_URL}/chef/${userId}/projects/${projectId}/updates`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        updateType: updateData.updateType,
        details: updateData.details,
        progress: updateData.progress ?? null,
        
      }),
    }
  );

  console.log("[API] addProjectUpdate STATUS:", res.status);

  return handleResponse(res);
};

// PATCH - Changer le statut d'un projet (chef)
export const updateProjectStatus = async (userId, projectId, status) => {
  const token = localStorage.getItem("token");

  console.log("[API] updateProjectStatus REQUEST:", {
    userId,
    projectId,
    status,
  });

  const res = await fetch(
    `${API_URL}/chef/${userId}/projects/${projectId}/status`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ status }),
    }
  );

  console.log("[API] updateProjectStatus STATUS:", res.status);

  return handleResponse(res);
};
export const updateProjectProgress = async (userId, projectId, progress) => {
  const token = localStorage.getItem("token");
  const res = await fetch(
    `${API_URL}/chef/${userId}/projects/${projectId}/progress`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ progress }),
    }
  );
  return handleResponse(res);
};
////////////////
// GET - Historique des updates d'un projet (chef)
export const getProjectUpdatesHistory = async (userId, projectId) => {
  const token = localStorage.getItem("token");

  console.log("[API] getProjectUpdatesHistory REQUEST:", {
    userId,
    projectId,
  });

  const res = await fetch(
    `${API_URL}/chef/${userId}/projects/${projectId}/updates`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );

  console.log("[API] getProjectUpdatesHistory STATUS:", res.status);

  return handleResponse(res);
};

// GET - Statistiques de progression d'un projet (chef)
export const getProjectProgressStats = async (userId, projectId) => {
  const token = localStorage.getItem("token");

  console.log("[API] getProjectProgressStats REQUEST:", {
    userId,
    projectId,
  });

  const res = await fetch(
    `${API_URL}/chef/${userId}/projects/${projectId}/progress-stats`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );

  console.log("[API] getProjectProgressStats STATUS:", res.status);

  return handleResponse(res);
};

export const deleteProject = async (projectId) => {
  const token = localStorage.getItem("token");
  const res = await fetch(`${API_URL}/admin/projects/${projectId}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  return handleResponse(res);
};

// GET admin profile
export const getAdminProfile = async () => {
  const token = localStorage.getItem("token");
  const res = await fetch(`${API_URL}/admin/profile`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  return handleResponse(res);
};

// UPDATE admin profile
export const updateAdminProfile = async (adminData) => {
  const token = localStorage.getItem("token");
  const res = await fetch(`${API_URL}/admin/profile`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(adminData),
  });
  return handleResponse(res);
};

// GET all projects (admin)
export const getAllProjects = async () => {
  const token = localStorage.getItem("token");
  const res = await fetch(`${API_URL}/admin/projects`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  return handleResponse(res);
};



// GET services avec chefs et projets
export const getServicesWithChefs = async () => {
  const token = localStorage.getItem("token");
  const res = await fetch(`${API_URL}/admin/projects/services`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`, 
    },
  });
  return handleResponse(res);
};

export const getAdminDashboard = async () => {
  const token = localStorage.getItem("token");
  const res = await fetch(`${API_URL}/admin/dashboard`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  if (!res.ok) throw new Error("Failed to load dashboard");
  return res.json();
};

export const getChefServices = async (userId) => {
  const token = localStorage.getItem("token");
  const res = await fetch(`${API_URL}/chef/${userId}/services`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  return handleResponse(res);
};

export const createProject = async (projectData) => {
  const token = localStorage.getItem("token");
  const res = await fetch(`${API_URL}/admin/projects`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    body: JSON.stringify(projectData),
  });
  return handleResponse(res);
};

export const deleteClient = async (clientId) => {
  const token = localStorage.getItem("token");
  const res = await fetch(`${API_URL}/admin/clients/${clientId}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  return handleResponse(res);
};
export const updateClient = async (clientId, clientData) => {
  const token = localStorage.getItem("token");
  const res = await fetch(`${API_URL}/admin/clients/${clientId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(clientData),
  });
  return handleResponse(res);
};
export const deleteChef = async (chefId) => {
  const token = localStorage.getItem("token");
  const res = await fetch(`${API_URL}/admin/chefs/${chefId}`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
  });
  return handleResponse(res);
};

export const updateChef = async (chefId, chefData) => {
  const token = localStorage.getItem("token");
  const res = await fetch(`${API_URL}/admin/chefs/${chefId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    body: JSON.stringify(chefData),
  });
  return handleResponse(res);
};
export const updateProject = async (projectId, projectData) => {
  const token = localStorage.getItem("token");
  const res = await fetch(`${API_URL}/admin/projects/${projectId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    body: JSON.stringify(projectData),
  });
  return handleResponse(res);
};
export const getServicesList = async () => {
  const token = localStorage.getItem("token");
  const res = await fetch(`${API_URL}/admin/services`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return handleResponse(res);
};

export const assignChefToService = async (service, chefId) => {
  const token = localStorage.getItem("token");
  const res = await fetch(`${API_URL}/admin/services/${service}/chefs`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ chefId }),
  });
  return handleResponse(res);
};

export const removeChefFromService = async (service, chefId) => {
  const token = localStorage.getItem("token");
  const res = await fetch(`${API_URL}/admin/services/${service}/chefs/${chefId}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
  return handleResponse(res);
};

// ─── GET updates du projet (côté client) 

export const getClientProjectUpdates = async (userId, projectId) => {  const token = localStorage.getItem("token");  const res = await fetch(    `${API_URL}/client/${userId}/projects/${projectId}/updates`,    {      method: "GET",      headers: {        "Content-Type": "application/json",        Authorization: `Bearer ${token}`,      },    }  );  return handleResponse(res);};

// ─── POST upload document (client)

export const uploadProjectDocument = async (userId, projectId, file) => {  const token = localStorage.getItem("token");  const formData = new FormData();  formData.append("file", file);
  const res = await fetch(    `${API_URL}/client/${userId}/projects/${projectId}/documents`,    {      method: "POST",      headers: {   Authorization: `Bearer ${token}`,      },      body: formData,    }  );  return handleResponse(res);};

  // À ajouter dans ton fichier api.js existant

/**
 * PUT /chef/:userId/profile
 * Modifie les infos du profil chef (nom, email, téléphone, spécialité)
 */
export const updateChefProfile = async (userId, profileData) => {
  const token = localStorage.getItem("token");
  const res = await fetch(`${API_URL}/chef/${userId}/profile`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(profileData),
  });
  return handleResponse(res);
};

/**
 * PATCH /chef/:userId/profile/password
 * Change le mot de passe du chef
 */
export const updateChefPassword = async (userId, { currentPassword, newPassword }) => {
  const token = localStorage.getItem("token");
  const res = await fetch(`${API_URL}/chef/${userId}/profile/password`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ currentPassword, newPassword }),
  });
  return handleResponse(res);
};


export const updateClientProfile = async (userId, token, data) => {
  const res = await fetch(`${API_URL}/client/${userId}/profile`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
  return handleResponse(res);
};

export const updateClientPassword = async (userId, token, data) => {
  const res = await fetch(`${API_URL}/client/${userId}/password`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
  return handleResponse(res);
};
export const resetClientPassword = async (clientId, newPassword) => {
  const token = localStorage.getItem("token");
  const res = await fetch(`${API_URL}/admin/clients/${clientId}/password`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ newPassword }),
  });
  return handleResponse(res);
};