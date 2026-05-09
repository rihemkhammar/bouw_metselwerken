import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import adminRoutes from "./app/routes/adminRoutes.js";
import clientRoutes from "./app/routes/clientRoutes.js";
//import chefRoutes from "./app/routes/chefRoutes.js";
import loginRoutes from "./app/routes/login.js";
import guestRoutes from "./app/routes/guestRoutes.js";

//const express = require("express");
//const cors = require("cors");
dotenv.config();

const app = express();


app.use(express.json());

app.use("/admin", adminRoutes);
app.use(guestRoutes);

app.use("/client", clientRoutes);
//app.use("/chef", chefRoutes);
app.use(cors({ origin: "http://localhost:5173" }));
app.use("/login" , loginRoutes)

app.listen(5000, () => console.log("Server running"))