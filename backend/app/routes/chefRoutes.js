import { Router } from "express";
import { chefController } from "../controllers/chefController.js";
import { authenticate } from "../middleware/auth.js";
import { authorizeRoles } from "../middleware/role.js";

const router = Router();




router.get(
  "/:userId/profile",
  authenticate,
  authorizeRoles("CHEF"),
  chefController.getProfile
);
//project
router.get(
  "/:userId/projects",
  authenticate,
  authorizeRoles("CHEF"),
  chefController.getChefProjects
);
router.get(
  "/:userId/projects/:projectId",
  authenticate,
  authorizeRoles("CHEF"),
  chefController.getChefProjectById
);
// POST /chef/:userId/projects/:projectId/updates
router.post(
  "/:userId/projects/:projectId/updates",
  authenticate,
  authorizeRoles("CHEF"),
  chefController.addProjectUpdate
);

// PATCH /chef/:userId/projects/:projectId/status
router.patch(
  "/:userId/projects/:projectId/status",
  authenticate,
  authorizeRoles("CHEF"),
  chefController.updateProjectStatus
);
router.get(
  "/:userId/projects/:projectId/updates",
  authenticate,
  authorizeRoles("CHEF"),
  chefController.getProjectUpdatesHistory
);

router.get(
  "/:userId/projects/:projectId/progress-stats",
  authenticate,
  authorizeRoles("CHEF"),
  chefController.getProjectProgressStats
);
 

router.delete(
  "/:userId/projects/:projectId/updates/:updateId",
  authenticate,
  authorizeRoles("CHEF"),
  chefController.deleteProjectUpdate
);
 

router.patch(
  "/:userId/projects/:projectId/status",
  authenticate,
  authorizeRoles("CHEF"),
  chefController.updateProjectStatus
);
router.get(
  "/:userId/projects/:projectId/detail",
  authenticate,
  authorizeRoles("CHEF"),
  chefController.getProjectDetail
);
 

router.get(
  "/:userId/projects/:projectId/detail/stats",
  authenticate,
  authorizeRoles("CHEF"),
  chefController.getProjectDetailWithStats
);
 

router.get(
  "/:userId/projects/:projectId/detail/full",
  authenticate,
  authorizeRoles("CHEF"),
  chefController.getProjectDetailFull
);



export default router;