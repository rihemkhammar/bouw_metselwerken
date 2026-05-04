import { loginService} from "../services/loginService.js"

const loginController = async(req ,res)=>{
    const {email , password} = req.body;
    if (!email|| !password){}
    try {
        const result = await loginService(email , password);
        res.json(result);
    }
    catch(err){
        res.status(err.status || 500).json({ error : err.message })
    }
};
export default loginController;