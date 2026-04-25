import maconnerie from '../../../../assets/maconnerie.jpeg';
import  restauration  from '../../../../assets/renovation.jpg';
import renovation from '../../../../assets/restauration.jpeg';
import travaux from '../../../../assets/Travaux.jpg';
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
    title: "Patrimoine Renaissance",
    description: "Remise en état de bâtiments anciens ou historiques en respectant leur authenticité, tout en renforçant leur structure et leur valeur architecturale.",
    image: restauration
  },
  {
    id: 4,
    title: "Pierre & Joint Authentique",
    description: "Réfection des joints de maçonnerie avec une finition rustique, pour préserver le charme traditionnel des murs en pierre tout en assurant leur solidité.",
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