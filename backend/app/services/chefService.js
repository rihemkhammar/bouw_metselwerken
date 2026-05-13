import { chefProfileService } from "./chef/ChefprofileService.js";
import { chefProjectService } from "./chef/clientProjectService.js"; 
import { chefProjectDetailService } from "./chef/chefProjectDetailService.js";
//import { chefProjectService } from "./chef/chefProjectService.js";
export const chefService = {
  // Profil
  getProfileById: chefProfileService.getProfileById,

  // Projets
  getChefProjects:     chefProjectService.getChefProjects,
  getChefProjectById:  chefProjectService.getChefProjectById,   
  addProjectUpdate:    chefProjectService.addProjectUpdate,      
  updateProjectStatus: chefProjectService.updateProjectStatus,   
  addProjectUpdate: chefProjectService.addProjectUpdate,
    getProjectDetail: chefProjectDetailService.getProjectDetail,
 
  // Récupère les détails avec statistiques
  getProjectDetailWithStats: chefProjectDetailService.getProjectDetailWithStats,
 
  // Récupère tous les détails du projet
  getProjectDetailFull: chefProjectDetailService.getProjectDetailFull,
  // Récupère l'historique des mises à jour
  getProjectUpdatesHistory: chefProjectService.getProjectUpdatesHistory,
 
  // Récupère les statistiques de progression
  getProjectProgressStats: chefProjectService.getProjectProgressStats,
 

};

  
  