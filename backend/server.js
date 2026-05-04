import express from "express";
import adminRoutes from "./app/routes/adminRoutes.js";
import clientRoutes from "./app/routes/clientRoutes.js";
import chefRoutes from "./app/routes/chefRoutes.js";

//const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/admin", adminRoutes);
app.use("/client", clientRoutes);
app.use("/chef", chefRoutes);

app.listen(5000, () => console.log("Server running"))