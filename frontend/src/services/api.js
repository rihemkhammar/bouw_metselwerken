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



