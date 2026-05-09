import "dotenv/config";
import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations"
<<<<<<< HEAD
=======
  },
  datasource: {
    url: process.env["DATABASE_URL"] ?? "",
>>>>>>> origin/GuestPage_Rihem
  },
  datasource: {
    url: process.env["DATABASE_URL"] ?? "",
  },
});
