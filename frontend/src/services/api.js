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
  localStorage.setItem("token" , data.token); //to save the token to  the after routes .
  return data ; 
};

// create chef 
export const createChef = async (chefData) => {
  const res = await fetch(`${API_URL}/admin/chefs/create`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
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
