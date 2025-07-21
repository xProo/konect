// Classe de base pour tous les composants
export class Component {
  constructor(props = {}) {
    this.props = props;
    this.oldProps = {};
    this.element = null;
    this.children = [];
    this.parent = null;
  }

  // Méthode principale pour afficher/mettre à jour le composant
  display(newProps = {}) {
    // Mettre à jour les props
    this.oldProps = { ...this.props };
    this.props = { ...this.props, ...newProps };

    // Vérifier si une mise à jour est nécessaire
    if (this.shouldUpdate()) {
      // Appeler render pour obtenir la nouvelle structure
      const structure = this.render();
      
      // Si c'est un composant fonction, l'exécuter
      if (typeof structure.tag === "function") {
        const ComponentClass = structure.tag;
        const childComponent = new ComponentClass(Object.fromEntries(structure.attributes ?? []));
        childComponent.parent = this;
        this.children.push(childComponent);
        return childComponent.display();
      }

      // Créer l'élément DOM
      const newElement = this.createElement(structure);
      
      // Remplacer l'ancien élément s'il existe
      if (this.element && this.element.parentNode) {
        this.element.parentNode.replaceChild(newElement, this.element);
      }
      
      this.element = newElement;
    }

    return this.element;
  }

  // Méthode pour comparer les props et déterminer si une mise à jour est nécessaire
  shouldUpdate() {
    // Comparaison simple des props - si c'est le premier rendu, toujours mettre à jour
    if (!this.element) return true;
    
    try {
      return JSON.stringify(this.oldProps) !== JSON.stringify(this.props);
    } catch (error) {
      // Si JSON.stringify échoue, faire une comparaison par clé
      const oldKeys = Object.keys(this.oldProps);
      const newKeys = Object.keys(this.props);
      
      if (oldKeys.length !== newKeys.length) return true;
      
      for (let key of newKeys) {
        if (this.oldProps[key] !== this.props[key]) return true;
      }
      
      return false;
    }
  }

  // Méthode à surcharger par les composants enfants
  render() {
    return {
      tag: "div",
      children: ["Composant de base"]
    };
  }

  // Méthode pour créer un élément DOM à partir d'une structure
  createElement(structure) {
    const elem = document.createElement(structure.tag);
    
    // Gérer les attributs
    if (structure.attributes) {
      for (let attribute of structure.attributes) {
        const attrName = attribute[0];
        const attrValue = attribute[1];
        if (attrName === "style") {
          Object.assign(elem.style, attrValue);
        } else if (attrName === "class") {
          elem.className = attrValue;
        } else {
          elem.setAttribute(attrName, attrValue);
        }
      }
    }

    // Gérer les événements
    if (structure.events) {
      for (let eventName in structure.events) {
        for (let listener of structure.events[eventName]) {
          elem.addEventListener(eventName, listener);
        }
      }
    }

    // Gérer les enfants
    if (structure.children) {
      for (let child of structure.children) {
        let childElem;
        
        if (typeof child === "string") {
          childElem = document.createTextNode(child);
        } else if (child.tag && typeof child.tag === "function") {
          // Si c'est un composant, l'instancier et l'afficher
          const ComponentClass = child.tag;
          const childComponent = new ComponentClass(Object.fromEntries(child.attributes ?? []));
          childComponent.parent = this;
          this.children.push(childComponent);
          childElem = childComponent.display();
        } else {
          // Élément DOM standard
          childElem = this.createElement(child);
        }
        
        if (childElem) {
          elem.appendChild(childElem);
        }
      }
    }

    return elem;
  }

  // Méthode pour mettre à jour un composant enfant
  updateChild(index, newProps) {
    if (this.children[index]) {
      this.children[index].display(newProps);
    }
  }

  // Méthode pour supprimer le composant du DOM
  destroy() {
    if (this.element && this.element.parentNode) {
      this.element.parentNode.removeChild(this.element);
    }
    this.children.forEach(child => child.destroy());
    this.children = [];
  }
}

// Fonction utilitaire pour créer des composants fonctionnels
export function createComponent(renderFunction) {
  return class extends Component {
    render() {
      return renderFunction(this.props);
    }
  };
}

// Export par défaut de la classe Component
export default Component; 