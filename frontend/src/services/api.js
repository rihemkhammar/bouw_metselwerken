<<<<<<< HEAD
//frontend calls -> backend 
const API_URL = "http://localhost:5000";  //only locally 
// Helper to handle responses
=======
const API_URL = "http://localhost:5000";

>>>>>>> origin/GuestPage_Rihem
const handleResponse = async (res) => {
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || "Request failed");
  }
  return data;
};

<<<<<<< HEAD
// Login request
export const login = async (email, password) => {
  const res = await fetch(`${API_URL}/login`, {
    method: "POST",
    headers: {
       "Content-Type": "application/json",
      },
    body: JSON.stringify({ email, password }),
  });
  const data = await handleResponse(res);
  localStorage.setItem("token" , data.token); 
  return data ; 
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
=======
// Login
{/*export const login = async (email, password) => {
  const res = await fetch(`${API_URL}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  const data = await handleResponse(res);
  localStorage.setItem("token", data.token);
  return data;
};*/}
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

// Create chef
export const createChef = async (chefData) => {
  const res = await fetch(`${API_URL}/admin/chefs/create`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
>>>>>>> origin/GuestPage_Rihem
    body: JSON.stringify(chefData),
  });
  return handleResponse(res);
};

<<<<<<< HEAD
// get all chefs
=======
// Get all chefs
>>>>>>> origin/GuestPage_Rihem
export const getChefs = async () => {
  const token = localStorage.getItem("token");
  const res = await fetch(`${API_URL}/admin/chefs`, {
    method: "GET",
<<<<<<< HEAD
    headers: { "Content-Type": "application/json" ,
    Authorization: `Bearer ${token}`,
=======
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
>>>>>>> origin/GuestPage_Rihem
    },
  });
  return handleResponse(res);
};
<<<<<<< HEAD
// get all clients
=======

// Get all clients
>>>>>>> origin/GuestPage_Rihem
export const getClients = async () => {
  const token = localStorage.getItem("token");
  const res = await fetch(`${API_URL}/admin/clients`, {
    method: "GET",
<<<<<<< HEAD
    headers: { "Content-Type": "application/json" ,
    Authorization: `Bearer ${token}`,
=======
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
>>>>>>> origin/GuestPage_Rihem
    },
  });
  return handleResponse(res);
};

<<<<<<< HEAD
export const sendContactRequest = async (formData) => {
  const res = await fetch(`${API_URL}/contact`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
=======
// Send contact request
export const sendContactRequest = async (formData) => {
  const res = await fetch(`${API_URL}/contact`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
>>>>>>> origin/GuestPage_Rihem
    body: JSON.stringify(formData),
  });
  return handleResponse(res);
};
<<<<<<< HEAD
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



=======

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

/*export const fetchUserProfile = async (userId, token) => {
  const headers = { "Content-Type": "application/json" };
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }
  const res = await fetch(`${API_URL}/api/users/${userId}`, {
    method: "GET",
    headers,
  });
  return handleResponse(res);
};*/

// UPDATE user profile
/*export const updateUserProfile = async (userId, token, data) => {
  const headers = { "Content-Type": "application/json" };
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }
  const res = await fetch(`${API_URL}/api/users/${userId}`, {
    method: "PUT",
    headers,
    body: JSON.stringify({
      name: data.name?.trim(),
      phone: data.phone?.trim() || null,
      address: data.address?.trim() || null,
      companyName: data.companyName?.trim() || null,
    }),
  });
  return handleResponse(res);
};*/

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
>>>>>>> origin/GuestPage_Rihem
