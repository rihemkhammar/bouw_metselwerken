import express from "express";
import dotenv from "dotenv";
import loginRoutes from "./app/routes/login.js";
import cors from "cors";
import adminRoutes from "./app/routes/adminRoutes.js"


dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/admin", adminRoutes);
/*
app.use("/client", clientRoutes);
app.use("/chef", chefRoutes);*/
app.use(cors({ origin: "http://localhost:5173" }));
app.use("/login" , loginRoutes)

app.listen(5000, () => console.log("Server running"))