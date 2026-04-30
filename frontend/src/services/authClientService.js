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