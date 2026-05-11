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
export const getServices = async () => {
  const token = localStorage.getItem("token");
  const res = await fetch(`${API_URL}/client/services`,
   { 
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    }, });
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