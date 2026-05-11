import { loginService} from "../services/loginService.js"

/*const loginController = async(req ,res)=>{
    const {email , password} = req.body;
    if (!email|| !password){}
    try {
        const result = await loginService(email , password);
        res.json(result);
    }
    catch(err){
        res.status(err.status || 500).json({ error : err.message })
    }
};*/
const loginController = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required" });
  }

  try {
    const result = await loginService(email, password);
    res.json(result);
  } catch (err) {
    res.status(err.status || 500).json({ error: err.message });
  }
};
export default loginController;