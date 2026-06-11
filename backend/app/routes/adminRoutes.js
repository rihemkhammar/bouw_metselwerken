import express from "express";
import {  getServicesListController,
  assignChefToServiceController,
  removeChefFromServiceController, updateProjectController, updateChefController, deleteChefController,updateClientController , getAdminDashboard,getProjectsByServiceController,deleteProjectController, createProjectController, createChef, fetchChefs , fetchClients , fetchGuests , approveRequestController , deleteClientController, fetchClientRequestsController , markClientRequestViewedController ,markGuestRequestViewedController , getProfileSettings , updateProfileSettings ,getAllProjectsController, getProjectByIdController, getServicesWithChefsController } from "../controllers/adminController.js";
import { authenticate } from "../middleware/auth.js";
import { authorizeRoles } from "../middleware/role.js";


const router = express.Router();

router.post(
  "/chefs/create",
  authenticate,
  authorizeRoles("ADMIN"),
  createChef
);
router.get(
  "/chefs",
  authenticate,
  authorizeRoles("ADMIN"),
  fetchChefs
);
router.get(
"/clients",
  authenticate,
  authorizeRoles("ADMIN"),
  fetchClients
);
router.get(
"/guests/demandes",
  authenticate,
  authorizeRoles("ADMIN"),
  fetchGuests
);
router.get(
  "/clients/demandes",
  authenticate,
  authorizeRoles("ADMIN"),
  fetchClientRequestsController 
);

router.post(
  "/clients/demandes/:id/approve",
  authenticate,
  authorizeRoles("ADMIN"),
  approveRequestController 
);
router.put("/clients/:id", authenticate, authorizeRoles("ADMIN"), updateClientController);

router.post(
  "/clients/demandes/:id/view",
  authenticate,
  authorizeRoles("ADMIN"),
  markClientRequestViewedController
);
router.post(
  "/guests/demandes/:id/view",
  authenticate,
  authorizeRoles("ADMIN"),
  markGuestRequestViewedController
);

router.get(
  "/profile",
  authenticate,
  authorizeRoles("ADMIN"),
  getProfileSettings
);

router.put(
  "/profile",
  authenticate,
  authorizeRoles("ADMIN"),
  updateProfileSettings
);

router.put("/chefs/:id", authenticate, authorizeRoles("ADMIN"), updateChefController);
router.delete("/chefs/:id", authenticate, authorizeRoles("ADMIN"), deleteChefController);
router.put("/projects/:id", authenticate, authorizeRoles("ADMIN"), updateProjectController);

// Projets admin
router.get("/projects", authenticate, authorizeRoles("ADMIN"), getAllProjectsController);
router.get("/projects/services", authenticate, authorizeRoles("ADMIN"), getServicesWithChefsController);
router.get("/projects/:id", authenticate, authorizeRoles("ADMIN"), getProjectByIdController);
router.get("/dashboard", authenticate, authorizeRoles("ADMIN"), getAdminDashboard);



router.post("/projects", authenticate, authorizeRoles("ADMIN"), createProjectController);
router.get(
  "/admin/projects/by-service",
  authenticate,
  authorizeRoles("ADMIN"),
  getProjectsByServiceController
);
router.delete("/clients/:id", authenticate, authorizeRoles("ADMIN"), deleteClientController);
router.get("/services", authenticate, authorizeRoles("ADMIN"), getServicesListController);
router.post("/services/:service/chefs", authenticate, authorizeRoles("ADMIN"), assignChefToServiceController);
router.delete("/services/:service/chefs/:chefId", authenticate, authorizeRoles("ADMIN"), removeChefFromServiceController);

// Ajouter dans la section projets :
router.delete("/projects/:id", authenticate, authorizeRoles("ADMIN"), deleteProjectController);

export default router;