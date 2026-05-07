import {
  createChefService,
  getChefsService,
  getClientsService
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
    if (chefs.length === 0) {
      return res.status(200).json({ message: "No Chefs yet" });
    }
  res.status(200).json(chefs);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch chefs" });
  }
};
export const fetchClients= async(req, res)=>{
  try{
   const clients = await getClientsService();
   if (clients.length ===0){
    return res.status(200).json({ message: "No Clients yet" });
   }
    res.status(200).json(clients);

  }catch(err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch clients" });
  }
}
