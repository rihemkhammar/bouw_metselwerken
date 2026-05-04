import maconnerie from '../../../../assets/maconnerie.jpeg';
import  renovation from '../../../../assets/renovation.jpg';
import  restauration   from '../../../../assets/images/projects/project2.jpeg';
import travaux from '../../../../assets/images/projects/project1.jpeg';
import demoussage from '../../../../assets/Démoussage.jpeg';

const projectsData = [
  {
    id: 1,
    title: "Construction Structure Horizon",
    description: "Réalisation de structures en béton et en brique, assurant solidité, stabilité et durabilité pour bâtiments résidentiels et professionnels.",
    image: maconnerie
  },
  {
    id: 2,
    title: "Rénovation Nouvelle Vie",
    description: "Transformation complète d’espaces anciens pour moderniser l’esthétique, améliorer le confort et optimiser la fonctionnalité des lieux.",
    image: renovation
  },
  {
    id: 3,
    title: "Rénovation complète d’une maison",
    description: "Renouvellement de l’espace intérieur avec nouveau sol, plafond moderne et éclairage intégré pour un style contemporain.",
    image: restauration
  },
  {
    id: 4,
    title: "Transformation d’un espace brut en douche moderne",
    description: "Réalisation d’une douche complète à partir d’une structure en briques, avec carrelage, banc intégré et installation sanitaire pour un espace compact et fonctionnel.",
    image: travaux
  },
  {
    id: 5,
    title: "Toiture Propre Éclat",
    description: "Nettoyage en profondeur des toitures et façades afin d’éliminer mousses, lichens et saletés, prolongeant la durée de vie des surfaces.",
    image: demoussage
  }
];

export default projectsData;