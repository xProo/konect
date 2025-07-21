import Component, { createComponent } from "../lib/Component.js";
import generateStructure from "../lib/generateStructure.js";

const routerOptions = {
  baseUrl: "",
  currentComponent: null,
  rootElement: null
};

// Initialiser les options globales immédiatement
routerOptions.baseUrl = "";

// Composant Router principal
export class Router extends Component {
  constructor(props) {
    super(props);
    this.routes = props.routes || {};
    this.rootElement = props.rootElement;
    this.baseUrl = props.baseUrl || "";
    
    // Configurer les options globales
    routerOptions.baseUrl = this.baseUrl;
    routerOptions.rootElement = this.rootElement;
    
    // Écouter les changements de navigation
    this.setupEventListeners();
  }

  setupEventListeners() {
    const handleNavigation = () => {
      this.navigate();
    };

    window.addEventListener("popstate", handleNavigation);
    window.addEventListener("pushstate", handleNavigation);
  }

  render() {
    return {
      tag: "div",
      attributes: [["id", "router-container"]],
      children: []
    };
  }

  navigate() {
    const path = window.location.pathname.slice(this.baseUrl.length);
    const RouteComponent = this.routes[path] || this.routes["*"];
    
    if (RouteComponent) {
      // Détruire l'ancien composant s'il existe
      if (routerOptions.currentComponent && routerOptions.currentComponent.destroy) {
        routerOptions.currentComponent.destroy();
      }
      
      let element;
      let component;
      
      if (typeof RouteComponent === "function") {
        // Tenter de créer une instance de la classe
        try {
          component = new RouteComponent();
          if (component.display && typeof component.display === "function") {
            // C'est une classe Component
            element = component.display();
          } else {
            // C'est probablement une fonction qui retourne une structure
            const structure = RouteComponent();
            element = this.createElementFromStructure(structure);
            component = null; // Pas de composant à garder en référence
          }
        } catch (error) {
          // Si l'instanciation échoue, c'est probablement une fonction
          const structure = RouteComponent();
          element = this.createElementFromStructure(structure);
          component = null;
        }
      } else if (RouteComponent && RouteComponent.display) {
        // C'est déjà une instance de Component
        component = RouteComponent;
        element = component.display();
      } else {
        // C'est une structure directe
        element = this.createElementFromStructure(RouteComponent);
        component = null;
      }
      
      // Remplacer le contenu du conteneur root
      if (this.rootElement.childNodes.length === 0) {
        this.rootElement.appendChild(element);
      } else {
        this.rootElement.replaceChild(element, this.rootElement.childNodes[0]);
      }
      
      routerOptions.currentComponent = component;
    }
  }

  // Méthode pour créer un élément DOM à partir d'une structure (ancienne méthode)
  createElementFromStructure(structure) {
    // Utiliser la fonction generateStructure existante
    return generateStructure(structure);
  }

  // Méthode pour démarrer le routeur
  start() {
    this.navigate();
  }
}

// Composant Link pour la navigation
export class Link extends Component {
  constructor(props) {
    super(props);
    this.link = props.link || "/";
    this.title = props.title || "Lien";
  }

  render() {
    const baseUrl = (window.routerConfig && window.routerConfig.baseUrl) || routerOptions.baseUrl || "";
    
    return {
      tag: "a",
      attributes: [
        ["href", baseUrl + this.link],
        ["style", this.props.style || {}]
      ],
      events: {
        click: [
          (event) => {
            event.preventDefault();
            window.history.pushState(
              {},
              undefined,
              event.currentTarget.getAttribute("href")
            );
            window.dispatchEvent(new Event("pushstate"));
          }
        ]
      },
      children: [this.title]
    };
  }
}

// Fonction utilitaire pour créer un lien (compatible avec l'ancien système)
export function BrowserLink(props) {
  const baseUrl = (window.routerConfig && window.routerConfig.baseUrl) || routerOptions.baseUrl || "";
  
  return {
    tag: "a",
    attributes: [
      ["href", baseUrl + props.link],
      ["style", props.style || {}]
    ],
    events: {
      click: [
        (event) => {
          event.preventDefault();
          window.history.pushState(
            {},
            undefined,
            event.currentTarget.getAttribute("href")
          );
          window.dispatchEvent(new Event("pushstate"));
        }
      ]
    },
    children: [props.title]
  };
}

// Fonction utilitaire pour naviguer programmatiquement
export function navigate(path) {
  const baseUrl = (window.routerConfig && window.routerConfig.baseUrl) || routerOptions.baseUrl || "";
  window.history.pushState({}, undefined, baseUrl + path);
  window.dispatchEvent(new Event("pushstate"));
}

// Export par défaut
export default Router; 