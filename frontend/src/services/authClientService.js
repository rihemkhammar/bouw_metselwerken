export const login = (login, matricule, password) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      
      if (
        login === "admin" &&
        matricule === "123456789012" &&
        password === "admin123"
      ) {
        resolve({
          success: true,
          user: {
            login,
            role: "admin"
          }
        });
      } else {
        reject({
          success: false,
          message: "Identifiants incorrects"
        });
      }

    }, 1000); 
  });
};
export const requestAccountCreation = async ({ 
  name, 
  email, 
  phone, 
  companyName, 
  description 
}) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (!name || !email) {
        reject({ error: "Name and email are required" });
      } else {
        resolve({
          message: "Account request sent successfully (static)",
          data: {
            name,
            email,
            phone,
            companyName,
            description,
            status: "PENDING"
          }
        });
      }
    }, 1000); // simulate delay
  });
};