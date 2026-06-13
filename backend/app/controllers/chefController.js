import { chefProfileController } from "./chef/chefProfileController.js";
import { chefProjectController } from "./chef/chefProjectController.js";
import { chefProjectDetailController } from "./chef/chefProjectDetailController.js";
import { serviceController } from "./chef/Servicecontroller.js";
import {chefProfileUpdateController } from "./chef/Chefprofileupdatecontroller.js";

export const chefController = {
  // ========== PROFIL ==========
  getProfile: chefProfileController.getProfile,
     updateProfile:   chefProfileUpdateController.updateProfile,
  updatePassword:  chefProfileUpdateController.updatePassword,


  // ========== PROJETS ==========
  // Récupère tous les projets
  getChefProjects: chefProjectController.handleGetChefProjects,

  // Récupère un projet avec résumé
  getChefProjectById: chefProjectController.handleGetChefProjectById,

  // Ajoute une mise à jour de progression
  addProjectUpdate: chefProjectController.handleAddProjectUpdate,

  // Met à jour le statut du projet
  updateProjectStatus: chefProjectController.handleUpdateProjectStatus,
handleUpdateProjectProgress: chefProjectController.handleUpdateProjectProgress,
// Récupère l'historique des mises à jour
  getProjectUpdatesHistory: chefProjectController.handleGetProjectUpdatesHistory,

  // Récupère les statistiques de progression
  getProjectProgressStats: chefProjectController.handleGetProjectProgressStats,

  // Supprime une mise à jour
  deleteProjectUpdate: chefProjectController.handleDeleteProjectUpdate,

  // ========== DÉTAIL PROJET ==========
  // Récupère les détails complets du projet
  getProjectDetail: chefProjectDetailController.handleGetProjectDetail,

  // Récupère les détails avec statistiques
  getProjectDetailWithStats:
    chefProjectDetailController.handleGetProjectDetailWithStats,

  // Récupère tous les détails du projet
  getProjectDetailFull: chefProjectDetailController.handleGetProjectDetailFull,

 getChefServices: serviceController.getChefServices,
   


};