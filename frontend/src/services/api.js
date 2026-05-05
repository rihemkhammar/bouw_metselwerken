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
  return handleResponse(res);
};

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