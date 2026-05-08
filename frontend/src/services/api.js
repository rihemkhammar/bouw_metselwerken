const API_URL = "http://localhost:5000";

const handleResponse = async (res) => {
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || "Request failed");
  }
  return data;
};

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
    body: JSON.stringify(chefData),
  });
  return handleResponse(res);
};

// Get all chefs
export const getChefs = async () => {
  const token = localStorage.getItem("token");
  const res = await fetch(`${API_URL}/admin/chefs`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  return handleResponse(res);
};

// Get all clients
export const getClients = async () => {
  const token = localStorage.getItem("token");
  const res = await fetch(`${API_URL}/admin/clients`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  return handleResponse(res);
};

// Send contact request
export const sendContactRequest = async (formData) => {
  const res = await fetch(`${API_URL}/contact`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(formData),
  });
  return handleResponse(res);
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