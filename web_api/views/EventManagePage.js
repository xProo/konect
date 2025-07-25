import { auth, database, storage } from "../lib/supabase.js";
import { BrowserLink } from "../components/BrowserRouter.js";
import {
  createCommonNavbar,
  updateCommonUserDisplay,
} from "../components/CommonNavbar.js";

let pageState = {
  events: [],
  showCreateModal: false,
  showEditModal: false,
  editingEvent: null,
  loading: false,
  message: { text: "", type: "", visible: false },
};

// Fonction pour re-render la page
let rerenderPage;

export default function EventManagePage() {
  rerenderPage = () => {
    const container = document.querySelector("body > div");
    if (container) {
      const newStructure = createPageStructure();
      const newElement = createElement(newStructure);
      container.parentNode.replaceChild(newElement, container);
    }
  };

  // Initialiser la page après le rendu
  setTimeout(async () => {
    // S'assurer que l'authentification est initialisée
    try {
      await updateCommonUserDisplay();

      // Ensuite charger les événements de l'utilisateur
      await loadUserEvents();
    } catch (error) {
      console.error("Erreur lors de l'initialisation:", error);
    }

    // Écouter les changements d'authentification
    auth.onAuthStateChange(async (event, session) => {
      if (session) {
        await loadUserEvents();
      } else {
        window.history.pushState({}, "", "/connexion");
        const popStateEvent = new PopStateEvent("popstate", { state: {} });
        window.dispatchEvent(popStateEvent);
      }
      await updateCommonUserDisplay();
    });
  }, 100);

  return createPageStructure();
}

// Fonction utilitaire pour créer un élément DOM
function createElement(structure) {
  if (typeof structure === "string") {
    return document.createTextNode(structure);
  }

  const element = document.createElement(structure.tag);

  if (structure.attributes) {
    structure.attributes.forEach(([key, value]) => {
      if (key === "class") {
        element.className = value;
      } else if (key === "style") {
        Object.assign(element.style, value);
      } else {
        element.setAttribute(key, value);
      }
    });
  }

  if (structure.events) {
    Object.entries(structure.events).forEach(([eventName, handlers]) => {
      handlers.forEach((handler) => {
        element.addEventListener(eventName, handler);
      });
    });
  }

  if (structure.children) {
    structure.children.forEach((child) => {
      element.appendChild(createElement(child));
    });
  }

  return element;
}

function createPageStructure() {
  return {
    tag: "div",
    attributes: [
      ["class", "min-h-screen bg-gradient-to-br from-slate-50 to-blue-50"],
    ],
    children: [
      createCommonNavbar(),
      createHeroSection(),
      createEventsSection(),
      pageState.showCreateModal ? createCreateEventModal() : null,
      pageState.showEditModal ? createEditEventModal() : null,
      pageState.message.visible ? createMessageNotification() : null,
    ].filter(Boolean),
  };
}

// Hero Section
function createHeroSection() {
  return {
    tag: "section",
    attributes: [
      ["class", "bg-gradient-to-r from-green-600 to-teal-600 py-20"],
    ],
    children: [
      {
        tag: "div",
        attributes: [
          ["class", "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center"],
        ],
        children: [
          {
            tag: "h1",
            attributes: [
              ["class", "text-4xl md:text-6xl font-bold text-white mb-6"],
            ],
            children: ["Mes événements"],
          },
          {
            tag: "p",
            attributes: [
              ["class", "text-xl text-green-100 max-w-3xl mx-auto mb-8"],
            ],
            children: [
              "Gérez vos événements, suivez les inscriptions et créez des expériences inoubliables.",
            ],
          },
          {
            tag: "button",
            attributes: [
              [
                "class",
                "bg-white text-green-600 font-bold py-3 px-8 rounded-xl hover:bg-green-50 transition-colors duration-300",
              ],
              ["onclick", "openCreateModal()"],
            ],
            children: ["+ Créer un événement"],
          },
        ],
      },
    ],
  };
}

// Section des événements
function createEventsSection() {
  return {
    tag: "section",
    attributes: [["class", "py-20"]],
    children: [
      {
        tag: "div",
        attributes: [["class", "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"]],
        children: [
          {
            tag: "div",
            attributes: [["class", "flex justify-between items-center mb-8"]],
            children: [
              {
                tag: "h2",
                attributes: [["class", "text-3xl font-bold text-gray-900"]],
                children: ["Vos événements"],
              },
              {
                tag: "div",
                attributes: [["class", "flex gap-4"]],
                children: [
                  {
                    tag: "button",
                    attributes: [
                      [
                        "class",
                        "bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-6 rounded-lg transition-colors duration-300",
                      ],
                      ["onclick", "openCreateModal()"],
                    ],
                    children: ["+ Nouvel événement"],
                  },
                ],
              },
            ],
          },
          createEventsGrid(),
        ],
      },
    ],
  };
}

function createEventsGrid() {
  if (pageState.loading) {
    return {
      tag: "div",
      attributes: [["class", "text-center py-12"]],
      children: [
        {
          tag: "div",
          attributes: [
            [
              "class",
              "animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto",
            ],
          ],
          children: [],
        },
        {
          tag: "p",
          attributes: [["class", "mt-4 text-gray-600"]],
          children: ["Chargement des événements..."],
        },
      ],
    };
  }

  if (pageState.events.length === 0) {
    return {
      tag: "div",
      attributes: [
        ["class", "text-center py-16 bg-white rounded-2xl shadow-lg"],
      ],
      children: [
        {
          tag: "div",
          attributes: [["class", "text-gray-400 text-6xl mb-4"]],
          children: ["🎪"],
        },
        {
          tag: "h3",
          attributes: [["class", "text-xl font-semibold text-gray-600 mb-2"]],
          children: ["Aucun événement créé"],
        },
        {
          tag: "p",
          attributes: [["class", "text-gray-500 mb-6"]],
          children: ["Créez votre premier événement pour commencer !"],
        },
        {
          tag: "button",
          attributes: [
            [
              "class",
              "bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-300",
            ],
            ["onclick", "openCreateModal()"],
          ],
          children: ["Créer mon premier événement"],
        },
      ],
    };
  }

  return {
    tag: "div",
    attributes: [
      ["class", "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"],
    ],
    children: pageState.events.map((event) => createEventCard(event)),
  };
}

function createEventCard(event) {
  const eventDate = new Date(event.date);
  const isUpcoming = eventDate > new Date();
  const statusColor = isUpcoming
    ? "bg-green-100 text-green-800"
    : "bg-gray-100 text-gray-800";
  const statusText = isUpcoming ? "À venir" : "Passé";

  return {
    tag: "div",
    attributes: [
      [
        "class",
        "bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden",
      ],
    ],
    children: [
      {
        tag: "div",
        attributes: [["class", "relative h-48 overflow-hidden"]],
        children: [
          {
            tag: "img",
            attributes: [
              ["src", event.image_url || "images/event_1.jpg"],
              ["alt", event.title],
              ["class", "w-full h-full object-cover"],
              ["onerror", "this.src='images/event_1.jpg'"],
            ],
            children: [],
          },
          {
            tag: "div",
            attributes: [
              [
                "class",
                `absolute top-4 right-4 ${statusColor} px-3 py-1 rounded-full text-xs font-bold`,
              ],
            ],
            children: [statusText],
          },
        ],
      },
      {
        tag: "div",
        attributes: [["class", "p-6"]],
        children: [
          {
            tag: "h3",
            attributes: [["class", "text-xl font-bold text-gray-900 mb-2"]],
            children: [event.title],
          },
          {
            tag: "p",
            attributes: [["class", "text-gray-600 text-sm mb-4 line-clamp-2"]],
            children: [event.description || "Aucune description"],
          },
          {
            tag: "div",
            attributes: [
              ["class", "flex items-center text-sm text-gray-500 mb-4"],
            ],
            children: [
              {
                tag: "svg",
                attributes: [
                  ["class", "w-4 h-4 mr-2"],
                  ["fill", "none"],
                  ["stroke", "currentColor"],
                  ["viewBox", "0 0 24 24"],
                ],
                children: [
                  {
                    tag: "path",
                    attributes: [
                      ["stroke-linecap", "round"],
                      ["stroke-linejoin", "round"],
                      ["stroke-width", "2"],
                      [
                        "d",
                        "M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z",
                      ],
                    ],
                    children: [],
                  },
                ],
              },
              eventDate.toLocaleDateString("fr-FR", {
                year: "numeric",
                month: "long",
                day: "numeric",
              }),
            ],
          },
          {
            tag: "div",
            attributes: [["class", "flex justify-between items-center"]],
            children: [
              {
                tag: "span",
                attributes: [["class", "text-lg font-bold text-green-600"]],
                children: [event.price ? `${event.price}€` : "Gratuit"],
              },
              {
                tag: "div",
                attributes: [["class", "flex gap-2"]],
                children: [
                  {
                    tag: "button",
                    attributes: [
                      [
                        "class",
                        "text-blue-600 hover:text-blue-800 p-2 rounded-lg hover:bg-blue-50 transition-colors",
                      ],
                      ["onclick", `editEvent('${event.id}')`],
                      ["title", "Modifier"],
                    ],
                    children: [
                      {
                        tag: "svg",
                        attributes: [
                          ["class", "w-5 h-5"],
                          ["fill", "none"],
                          ["stroke", "currentColor"],
                          ["viewBox", "0 0 24 24"],
                        ],
                        children: [
                          {
                            tag: "path",
                            attributes: [
                              ["stroke-linecap", "round"],
                              ["stroke-linejoin", "round"],
                              ["stroke-width", "2"],
                              [
                                "d",
                                "M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z",
                              ],
                            ],
                            children: [],
                          },
                        ],
                      },
                    ],
                  },
                  {
                    tag: "button",
                    attributes: [
                      [
                        "class",
                        "text-red-600 hover:text-red-800 p-2 rounded-lg hover:bg-red-50 transition-colors",
                      ],
                      ["onclick", `deleteEvent('${event.id}')`],
                      ["title", "Supprimer"],
                    ],
                    children: [
                      {
                        tag: "svg",
                        attributes: [
                          ["class", "w-5 h-5"],
                          ["fill", "none"],
                          ["stroke", "currentColor"],
                          ["viewBox", "0 0 24 24"],
                        ],
                        children: [
                          {
                            tag: "path",
                            attributes: [
                              ["stroke-linecap", "round"],
                              ["stroke-linejoin", "round"],
                              ["stroke-width", "2"],
                              [
                                "d",
                                "M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16",
                              ],
                            ],
                            children: [],
                          },
                        ],
                      },
                    ],
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
  };
}

// Modal de création d'événement
function createCreateEventModal() {
  return {
    tag: "div",
    attributes: [
      [
        "style",
        {
          position: "fixed",
          top: "0",
          left: "0",
          width: "100%",
          height: "100%",
          background: "rgba(0,0,0,0.5)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          zIndex: "1000",
          backdropFilter: "blur(5px)",
          padding: "16px",
        },
      ],
    ],
    events: {
      click: [
        (e) => {
          if (e.target === e.currentTarget) {
            closeCreateModal();
          }
        },
      ],
    },
    children: [
      {
        tag: "div",
        attributes: [
          [
            "class",
            "bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden shadow-2xl",
          ],
        ],
        events: {
          click: [
            (e) => {
              e.stopPropagation();
            },
          ],
        },
        children: [
          {
            tag: "div",
            attributes: [
              ["class", "bg-gradient-to-r from-green-600 to-yellow-600 p-6"],
            ],
            children: [
              {
                tag: "div",
                attributes: [["class", "flex justify-between items-center"]],
                children: [
                  {
                    tag: "h2",
                    attributes: [["class", "text-2xl font-bold text-white"]],
                    children: [
                      {
                        tag: "span",
                        attributes: [["class", "flex items-center"]],
                        children: ["Créer un nouvel événement"],
                      },
                    ],
                  },
                  {
                    tag: "button",
                    attributes: [
                      [
                        "class",
                        "text-white hover:text-gray-200 p-2 hover:bg-white/10 rounded-lg transition-all duration-200",
                      ],
                    ],
                    events: {
                      click: [() => closeCreateModal()],
                    },
                    children: [
                      {
                        tag: "svg",
                        attributes: [
                          ["class", "w-6 h-6"],
                          ["fill", "none"],
                          ["stroke", "currentColor"],
                          ["viewBox", "0 0 24 24"],
                        ],
                        children: [
                          {
                            tag: "path",
                            attributes: [
                              ["stroke-linecap", "round"],
                              ["stroke-linejoin", "round"],
                              ["stroke-width", "2"],
                              ["d", "M6 18L18 6M6 6l12 12"],
                            ],
                            children: [],
                          },
                        ],
                      },
                    ],
                  },
                ],
              },
              {
                tag: "p",
                attributes: [["class", "mt-2 text-blue-100"]],
                children: [
                  "Remplissez les informations ci-dessous pour créer votre événement",
                ],
              },
            ],
          },
          {
            tag: "div",
            attributes: [["class", "overflow-y-auto max-h-[calc(90vh-120px)]"]],
            children: [
              {
                tag: "form",
                attributes: [
                  ["class", "p-6"],
                  ["id", "create-event-form"],
                ],
                events: {
                  submit: [
                    function (e) {
                      e.preventDefault();
                      handleCreateEvent();
                    },
                  ],
                },
                children: [createEventForm()],
              },
            ],
          },
        ],
      },
    ],
  };
}

function createEventForm() {
  return {
    tag: "div",
    attributes: [["class", "space-y-6"]],
    children: [
      // Upload d'image
      {
        tag: "div",
        children: [
          {
            tag: "label",
            attributes: [
              ["class", "block text-sm font-medium text-gray-700 mb-2"],
            ],
            children: ["Image de l'événement"],
          },
          {
            tag: "div",
            attributes: [
              [
                "class",
                "mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-xl hover:border-blue-400 transition-colors",
              ],
            ],
            children: [
              {
                tag: "div",
                attributes: [["class", "space-y-1 text-center"]],
                children: [
                  {
                    tag: "div",
                    attributes: [
                      ["id", "image-preview"],
                      ["class", "hidden"],
                    ],
                    children: [
                      {
                        tag: "img",
                        attributes: [
                          ["id", "preview-img"],
                          [
                            "class",
                            "mx-auto h-32 w-auto rounded-lg object-cover mb-4",
                          ],
                        ],
                        children: [],
                      },
                    ],
                  },
                  {
                    tag: "div",
                    attributes: [["id", "upload-placeholder"]],
                    children: [
                      {
                        tag: "svg",
                        attributes: [
                          ["class", "mx-auto h-12 w-12 text-gray-400"],
                          ["stroke", "currentColor"],
                          ["fill", "none"],
                          ["viewBox", "0 0 48 48"],
                        ],
                        children: [
                          {
                            tag: "path",
                            attributes: [
                              [
                                "d",
                                "M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02",
                              ],
                              ["stroke-width", "2"],
                              ["stroke-linecap", "round"],
                              ["stroke-linejoin", "round"],
                            ],
                            children: [],
                          },
                        ],
                      },
                    ],
                  },
                  {
                    tag: "div",
                    attributes: [["class", "flex text-sm text-gray-600"]],
                    children: [
                      {
                        tag: "label",
                        attributes: [
                          ["for", "event-image"],
                          [
                            "class",
                            "relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500",
                          ],
                        ],
                        children: [
                          {
                            tag: "span",
                            children: ["Télécharger une image"],
                          },
                          {
                            tag: "input",
                            attributes: [
                              ["id", "event-image"],
                              ["name", "event-image"],
                              ["type", "file"],
                              ["accept", "image/*"],
                              ["class", "sr-only"],
                            ],
                            events: {
                              change: [
                                function (e) {
                                  handleImageUpload(e);
                                },
                              ],
                            },
                            children: [],
                          },
                        ],
                      },
                      {
                        tag: "p",
                        attributes: [["class", "pl-1"]],
                        children: [" ou glisser-déposer"],
                      },
                    ],
                  },
                  {
                    tag: "p",
                    attributes: [["class", "text-xs text-gray-500"]],
                    children: ["PNG, JPG, GIF jusqu'à 10MB"],
                  },
                ],
              },
            ],
          },
        ],
      },
      // Titre de l'événement
      {
        tag: "div",
        children: [
          {
            tag: "label",
            attributes: [
              ["class", "block text-sm font-medium text-gray-700 mb-2"],
            ],
            children: [
              "Titre de l'événement ",
              {
                tag: "span",
                attributes: [["class", "text-red-500"]],
                children: ["*"],
              },
            ],
          },
          {
            tag: "input",
            attributes: [
              ["type", "text"],
              ["id", "event-title"],
              [
                "class",
                "w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-gray-400",
              ],
              ["placeholder", "Donnez un titre accrocheur à votre événement"],
              ["required", "true"],
            ],
            children: [],
          },
        ],
      },
      // Description
      {
        tag: "div",
        children: [
          {
            tag: "label",
            attributes: [
              ["class", "block text-sm font-medium text-gray-700 mb-2"],
            ],
            children: [
              "Description ",
              {
                tag: "span",
                attributes: [["class", "text-red-500"]],
                children: ["*"],
              },
            ],
          },
          {
            tag: "textarea",
            attributes: [
              ["id", "event-description"],
              ["rows", "4"],
              [
                "class",
                "w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-gray-400 resize-none",
              ],
              [
                "placeholder",
                "Décrivez votre événement en détail : objectifs, programme, public cible...",
              ],
              ["required", "true"],
            ],
            children: [],
          },
        ],
      },
      // Date et heure
      {
        tag: "div",
        attributes: [["class", "grid grid-cols-1 md:grid-cols-2 gap-6"]],
        children: [
          {
            tag: "div",
            children: [
              {
                tag: "label",
                attributes: [
                  ["class", "block text-sm font-medium text-gray-700 mb-2"],
                ],
                children: [
                  "Date ",
                  {
                    tag: "span",
                    attributes: [["class", "text-red-500"]],
                    children: ["*"],
                  },
                ],
              },
              {
                tag: "input",
                attributes: [
                  ["type", "date"],
                  ["id", "event-date"],
                  [
                    "class",
                    "w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-gray-400",
                  ],
                  ["required", "true"],
                ],
                children: [],
              },
            ],
          },
          {
            tag: "div",
            children: [
              {
                tag: "label",
                attributes: [
                  ["class", "block text-sm font-medium text-gray-700 mb-2"],
                ],
                children: [
                  "Heure ",
                  {
                    tag: "span",
                    attributes: [["class", "text-red-500"]],
                    children: ["*"],
                  },
                ],
              },
              {
                tag: "input",
                attributes: [
                  ["type", "time"],
                  ["id", "event-time"],
                  [
                    "class",
                    "w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-gray-400",
                  ],
                  ["required", "true"],
                ],
                children: [],
              },
            ],
          },
        ],
      },
      // Lieu
      {
        tag: "div",
        children: [
          {
            tag: "label",
            attributes: [
              ["class", "block text-sm font-medium text-gray-700 mb-2"],
            ],
            children: [
              "Lieu ",
              {
                tag: "span",
                attributes: [["class", "text-red-500"]],
                children: ["*"],
              },
            ],
          },
          {
            tag: "input",
            attributes: [
              ["type", "text"],
              ["id", "event-location"],
              [
                "class",
                "w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-gray-400",
              ],
              ["placeholder", "Adresse complète ou nom du lieu"],
              ["required", "true"],
            ],
            children: [],
          },
        ],
      },
      // Prix et participants max
      {
        tag: "div",
        attributes: [["class", "grid grid-cols-1 md:grid-cols-2 gap-6"]],
        children: [
          {
            tag: "div",
            children: [
              {
                tag: "label",
                attributes: [
                  ["class", "block text-sm font-medium text-gray-700 mb-2"],
                ],
                children: ["Prix (€)"],
              },
              {
                tag: "div",
                attributes: [["class", "relative"]],
                children: [
                  {
                    tag: "div",
                    attributes: [
                      [
                        "class",
                        "absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none",
                      ],
                    ],
                    children: [
                      {
                        tag: "span",
                        attributes: [["class", "text-gray-500 sm:text-sm"]],
                        children: ["€"],
                      },
                    ],
                  },
                  {
                    tag: "input",
                    attributes: [
                      ["type", "number"],
                      ["id", "event-price"],
                      ["min", "0"],
                      ["step", "0.01"],
                      [
                        "class",
                        "w-full pl-8 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-gray-400",
                      ],
                      ["placeholder", "0.00"],
                    ],
                    children: [],
                  },
                ],
              },
              {
                tag: "p",
                attributes: [["class", "mt-1 text-sm text-gray-500"]],
                children: ["Laissez vide si gratuit"],
              },
            ],
          },
          {
            tag: "div",
            children: [
              {
                tag: "label",
                attributes: [
                  ["class", "block text-sm font-medium text-gray-700 mb-2"],
                ],
                children: ["Participants max"],
              },
              {
                tag: "input",
                attributes: [
                  ["type", "number"],
                  ["id", "event-max-participants"],
                  ["min", "1"],
                  [
                    "class",
                    "w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-gray-400",
                  ],
                  ["placeholder", "Nombre maximum de participants"],
                ],
                children: [],
              },
              {
                tag: "p",
                attributes: [["class", "mt-1 text-sm text-gray-500"]],
                children: ["Laissez vide si illimité"],
              },
            ],
          },
        ],
      },
      // Boutons d'action
      {
        tag: "div",
        attributes: [
          [
            "class",
            "flex flex-col sm:flex-row justify-end gap-4 pt-8 border-t border-gray-200",
          ],
        ],
        children: [
          {
            tag: "button",
            attributes: [
              ["type", "button"],
              [
                "class",
                "w-full sm:w-auto px-6 py-3 border-2 border-gray-300 text-gray-700 font-medium rounded-xl hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2",
              ],
              ["onclick", "closeCreateModal()"],
            ],
            children: ["Annuler"],
          },
          {
            tag: "button",
            attributes: [
              ["type", "submit"],
              [
                "class",
                "w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-green-600 to-green-600 hover:from-green-700 hover:to-green-700 text-white font-bold rounded-xl transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2",
              ],
              ["id", "submit-button"],
            ],
            children: ["Créer l'événement"],
          },
        ],
      },
    ],
  };
}

// Modal de modification d'événement
function createEditEventModal() {
  // Similar to create modal but with pre-filled values
  return createCreateEventModal(); // Simplified for now
}

// Notification de message
function createMessageNotification() {
  const bgColor =
    pageState.message.type === "success"
      ? "bg-green-100 border-green-500 text-green-700"
      : "bg-red-100 border-red-500 text-red-700";

  return {
    tag: "div",
    attributes: [
      [
        "class",
        `fixed top-4 right-4 ${bgColor} border-l-4 p-4 rounded-lg shadow-lg z-50 max-w-md`,
      ],
    ],
    children: [
      {
        tag: "div",
        attributes: [["class", "flex justify-between items-center"]],
        children: [
          pageState.message.text,
          {
            tag: "button",
            attributes: [
              ["class", "ml-4 text-current"],
              ["onclick", "closeMessage()"],
            ],
            children: ["✕"],
          },
        ],
      },
    ],
  };
}

// Fonctions de gestion des événements
async function loadUserEvents() {
  pageState.loading = true;
  rerenderPage();

  try {
    const user = await auth.getCurrentUser();
    if (!user.data.user) {
      throw new Error("Utilisateur non connecté");
    }

    const result = await database.getUserCreatedEvents(user.data.user.id);
    pageState.events = result.data || [];
  } catch (error) {
    console.error("Erreur lors du chargement des événements:", error);
    showMessage("Erreur lors du chargement des événements", "error");
    pageState.events = [];
  } finally {
    pageState.loading = false;
    rerenderPage();
  }
}

function openCreateModal() {
  pageState.showCreateModal = true;
  rerenderPage();
}

function closeCreateModal() {
  pageState.showCreateModal = false;
  rerenderPage();
}

async function handleCreateEvent() {
  try {
    // Désactiver le bouton de soumission
    const submitButton = document.getElementById("submit-button");
    if (submitButton) {
      submitButton.disabled = true;
      submitButton.innerHTML = `
        <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white inline" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        Création en cours...
      `;
    }

    const user = await auth.getCurrentUser();
    if (!user.data.user) {
      throw new Error("Utilisateur non connecté");
    }

    // Préparer les données de base du formulaire
    const formData = {
      title: document.getElementById("event-title").value,
      description: document.getElementById("event-description").value,
      date:
        document.getElementById("event-date").value +
        "T" +
        document.getElementById("event-time").value,
      location: document.getElementById("event-location").value,
      price: parseFloat(document.getElementById("event-price").value) || 0,
      max_participants:
        parseInt(document.getElementById("event-max-participants").value) ||
        null,
      created_by: user.data.user.id,
      community_id: null, // Pour l'instant, on n'associe pas à une communauté
    };

    console.log("Données du formulaire:", formData);

    // Gérer l'upload d'image si une image a été sélectionnée
    const imageFile = document.getElementById("event-image").files[0];
    console.log("Fichier image sélectionné:", imageFile);

    if (imageFile) {
      console.log("Upload d'image en cours...");

      // Créer d'abord l'événement pour obtenir un ID
      const eventResult = await database.createEvent(formData);
      console.log("Résultat création événement:", eventResult);

      if (eventResult.error) {
        throw new Error(eventResult.error.message);
      }

      const eventId = eventResult.data[0].id;
      console.log("ID de l'événement créé:", eventId);

      // Uploader l'image
      console.log("Upload de l'image vers Supabase Storage...");
      const uploadResult = await storage.uploadEventImage(imageFile, eventId);
      console.log("Résultat upload image:", uploadResult);

      if (uploadResult.error) {
        console.error(
          "Erreur lors de l'upload de l'image:",
          uploadResult.error
        );
        // Continuer même si l'upload échoue
        showMessage(
          "Événement créé, mais erreur lors de l'upload de l'image",
          "error"
        );
      } else {
        console.log("Image uploadée avec succès, URL:", uploadResult.data.url);

        // Mettre à jour l'événement avec l'URL de l'image
        const updateResult = await database.updateEvent(eventId, {
          image_url: uploadResult.data.url,
        });
        console.log("Résultat mise à jour avec image:", updateResult);

        if (updateResult.error) {
          console.error(
            "Erreur lors de la mise à jour avec l'image:",
            updateResult.error
          );
        }
      }
    } else {
      console.log(
        "Aucune image sélectionnée, création de l'événement sans image"
      );

      // Créer l'événement sans image
      const eventResult = await database.createEvent(formData);
      console.log("Résultat création événement sans image:", eventResult);

      if (eventResult.error) {
        throw new Error(eventResult.error.message);
      }
    }

    showMessage("Événement créé avec succès !", "success");
    closeCreateModal();
    await loadUserEvents();
  } catch (error) {
    console.error("Erreur lors de la création de l'événement:", error);
    showMessage(
      "Erreur lors de la création de l'événement: " + error.message,
      "error"
    );
  } finally {
    // Réactiver le bouton de soumission
    const submitButton = document.getElementById("submit-button");
    if (submitButton) {
      submitButton.disabled = false;
      submitButton.innerHTML = "Créer l'événement";
    }
  }
}

function editEvent(eventId) {
  const event = pageState.events.find((e) => e.id === eventId);
  if (event) {
    pageState.editingEvent = event;
    pageState.showEditModal = true;
    rerenderPage();
  }
}

async function deleteEvent(eventId) {
  if (confirm("Êtes-vous sûr de vouloir supprimer cet événement ?")) {
    try {
      await database.deleteEvent(eventId);
      showMessage("Événement supprimé avec succès !", "success");
      await loadUserEvents();
    } catch (error) {
      console.error("Erreur lors de la suppression:", error);
      showMessage("Erreur lors de la suppression de l'événement", "error");
    }
  }
}

function showMessage(text, type) {
  pageState.message = { text, type, visible: true };
  rerenderPage();

  setTimeout(() => {
    closeMessage();
  }, 5000);
}

function closeMessage() {
  pageState.message.visible = false;
  rerenderPage();
}

// Fonction pour gérer l'upload d'image
function handleImageUpload(event) {
  const file = event.target.files[0];
  if (!file) return;

  // Vérifier le type de fichier
  if (!file.type.startsWith("image/")) {
    showMessage("Veuillez sélectionner un fichier image valide", "error");
    return;
  }

  // Vérifier la taille du fichier (10MB max)
  if (file.size > 10 * 1024 * 1024) {
    showMessage(
      "L'image est trop volumineuse. Taille maximale : 10MB",
      "error"
    );
    return;
  }

  // Créer une prévisualisation
  const reader = new FileReader();
  reader.onload = function (e) {
    const previewContainer = document.getElementById("image-preview");
    const previewImg = document.getElementById("preview-img");
    const placeholder = document.getElementById("upload-placeholder");

    if (previewContainer && previewImg && placeholder) {
      previewImg.src = e.target.result;
      previewContainer.classList.remove("hidden");
      placeholder.classList.add("hidden");
    }
  };
  reader.readAsDataURL(file);
}

// Exports globaux
window.openCreateModal = openCreateModal;
window.closeCreateModal = closeCreateModal;
window.handleCreateEvent = handleCreateEvent;
window.handleImageUpload = handleImageUpload;
window.editEvent = editEvent;
window.deleteEvent = deleteEvent;
window.closeMessage = closeMessage;
