import express from "express";
<<<<<<< HEAD
import dotenv from "dotenv";
import loginRoutes from "./app/routes/login.js";
import cors from "cors";
import adminRoutes from "./app/routes/adminRoutes.js";
import guestRoutes from "./app/routes/guestRoutes.js";


=======
import cors from "cors";
import dotenv from "dotenv";
//import adminRoutes from "./app/routes/adminRoutes.js";
import clientRoutes from "./app/routes/clientRoutes.js";
//import chefRoutes from "./app/routes/chefRoutes.js";
import loginRoutes from "./app/routes/login.js";

//const express = require("express");
//const cors = require("cors");
>>>>>>> origin/GuestPage_Rihem
dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

<<<<<<< HEAD
app.use("/admin", adminRoutes);
app.use(guestRoutes);
/*
app.use("/client", clientRoutes);
app.use("/chef", chefRoutes);*/
=======
//app.use("/admin", adminRoutes);
app.use("/client", clientRoutes);
//app.use("/chef", chefRoutes);
>>>>>>> origin/GuestPage_Rihem
app.use(cors({ origin: "http://localhost:5173" }));
app.use("/login" , loginRoutes)

app.listen(5000, () => console.log("Server running"))