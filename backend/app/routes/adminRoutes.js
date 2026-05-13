import express from "express";
import { getAdminDashboard,getProjectsByServiceController, createChef, fetchChefs , fetchClients , fetchGuests , approveRequestController , fetchClientRequestsController , markClientRequestViewedController ,markGuestRequestViewedController , getProfileSettings , updateProfileSettings ,getAllProjectsController, getProjectByIdController, getServicesWithChefsController } from "../controllers/adminController.js";
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



// Projets admin
router.get("/projects", authenticate, authorizeRoles("ADMIN"), getAllProjectsController);
router.get("/projects/services", authenticate, authorizeRoles("ADMIN"), getServicesWithChefsController);
router.get("/projects/:id", authenticate, authorizeRoles("ADMIN"), getProjectByIdController);
router.get("/dashboard", authenticate, authorizeRoles("ADMIN"), getAdminDashboard);

router.get(
  "/admin/projects/by-service",
  authenticate,
  authorizeRoles("ADMIN"),
  getProjectsByServiceController
);

export default router;