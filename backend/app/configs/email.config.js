import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config(); // ← Ajouter cette ligne

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: parseInt(process.env.EMAIL_PORT),
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Log pour vérifier
console.log("EMAIL_HOST:", process.env.EMAIL_HOST);
console.log("EMAIL_USER:", process.env.EMAIL_USER);

export default transporter;