import { auth, database } from "../lib/supabase.js";
import { BrowserLink } from "../components/BrowserRouter.js";
import { createCommonNavbar, updateCommonUserDisplay, handleCommonLogout } from "../components/CommonNavbar.js";

let allEvents = [];
let filteredEvents = [];
let currentPage = 1;
const eventsPerPage = 12; // 3 colonnes x 4 rangées
let currentFilters = {
  category: '',
  location: '',
  date: '',
  price: '',
  sortBy: 'popular'
};

export default function EventsPage() {
  setTimeout(async () => {
    await updateCommonUserDisplay();
    await loadAllEvents();

    auth.onAuthStateChange((event, session) => {
      updateCommonUserDisplay();
      loadAllEvents();
    });
  }, 100);

  return {
    tag: "div",
    attributes: [["class", "min-h-screen bg-gray-50"]],
    children: [
      createCommonNavbar(),
      {
        tag: "main",
        attributes: [["class", "relative z-10"]],
        children: [
          createBreadcrumbs(),
          createEventsSection(),
          createPopularNearbySection()
        ]
      },
      createFooter()
    ]
  };
}

function createBreadcrumbs() {
  return {
    tag: "div",
    attributes: [["class", "w-full bg-white border-b border-gray-200 relative z-20"]],
    children: [
      {
        tag: "div",
        attributes: [["class", "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4"]],
        children: [
          {
            tag: "nav",
            attributes: [["class", "flex items-center space-x-2 text-sm"]],
            children: [
              BrowserLink({
                link: "/",
                title: {
                  tag: "span",
                  attributes: [["class", "text-blue-600 hover:text-blue-800 transition-colors font-medium"]],
                  children: ["Accueil"]
                }
              }),
              {
                tag: "svg",
                attributes: [
                  ["class", "w-4 h-4 text-gray-400"],
                  ["fill", "currentColor"],
                  ["viewBox", "0 0 20 20"]
                ],
                children: [
                  {
                    tag: "path",
                    attributes: [
                      ["fill-rule", "evenodd"],
                      ["d", "M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"],
                      ["clip-rule", "evenodd"]
                    ]
                  }
                ]
              },
              {
                tag: "span",
                attributes: [["class", "text-gray-700 font-medium"]],
                children: ["Événements"]
              }
            ]
          }
        ]
      }
    ]
  };
}

function createEventsSection() {
  return {
    tag: "div",
    attributes: [["class", "w-full relative z-10"]],
    children: [
      {
        tag: "div",
        attributes: [["class", "w-full bg-white border-b border-gray-200"]],
        children: [
          {
            tag: "div",
            attributes: [["class", "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8"]],
            children: [
              {
                tag: "div",
                attributes: [["class", "text-center"]],
                children: [
                  {
                    tag: "h1",
                    attributes: [["class", "text-3xl font-bold text-gray-900 sm:text-4xl"]],
                    children: ["Découvrez nos événements"]
                  },
                  {
                    tag: "p",
                    attributes: [["class", "mt-3 text-lg text-gray-600 max-w-2xl mx-auto"]],
                    children: ["Trouvez l'événement parfait selon vos préférences et rejoignez notre communauté"]
                  }
                ]
              }
            ]
          }
        ]
      },

      {
        tag: "div",
        attributes: [["class", "w-full bg-gray-50 min-h-screen"]],
        children: [
          {
            tag: "div",
            attributes: [["class", "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8"]],
            children: [
              createFiltersSection(),
              createEventsGrid(),
              createPagination()
            ]
          }
        ]
      }
    ]
  };
}

function createFiltersSection() {
  return {
    tag: "div",
    attributes: [["class", "w-full mb-8"]],
    children: [
      {
        tag: "div",
        attributes: [["class", "bg-white rounded-lg shadow-sm border border-gray-200 p-6"]],
        children: [
          {
            tag: "h2",
            attributes: [["class", "text-lg font-semibold text-gray-900 mb-6"]],
            children: ["Filtrer les événements"]
          },

          {
            tag: "div",
            attributes: [["class", "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6"]],
            children: [
              createCategoryFilter(),
              createLocationFilter(),
              createDateFilter(),
              createPriceFilter()
            ]
          },

          {
            tag: "div",
            attributes: [["class", "flex flex-col sm:flex-row sm:items-center sm:justify-between pt-6 border-t border-gray-200 gap-4"]],
            children: [
              {
                tag: "div",
                attributes: [["class", "flex items-center space-x-2"]],
                children: [
                  {
                    tag: "span",
                    attributes: [["class", "text-sm font-medium text-gray-700"]],
                    children: ["Trier par :"]
                  },
                  createSortFilter()
                ]
              },
              {
                tag: "div",
                attributes: [["id", "events-count"], ["class", "text-sm text-gray-600"]],
                children: [""]
              }
            ]
          }
        ]
      }
    ]
  };
}

function createCategoryFilter() {
  return {
    tag: "div",
    attributes: [["class", "w-full"]],
    children: [
      {
        tag: "label",
        attributes: [
          ["for", "category-filter"],
          ["class", "block text-sm font-medium text-gray-700 mb-2"]
        ],
        children: ["Catégorie"]
      },
      {
        tag: "select",
        attributes: [
          ["id", "category-filter"],
          ["name", "category"],
          ["class", "w-full px-3 py-2.5 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900"]
        ],
        events: {
          change: [() => applyFilters()]
        },
        children: [
          { tag: "option", attributes: [["value", ""]], children: ["Toutes les catégories"] },
          { tag: "option", attributes: [["value", "conference"]], children: ["Conférence"] },
          { tag: "option", attributes: [["value", "concert"]], children: ["Concert"] },
          { tag: "option", attributes: [["value", "sport"]], children: ["Sport"] },
          { tag: "option", attributes: [["value", "formation"]], children: ["Formation"] },
          { tag: "option", attributes: [["value", "soiree"]], children: ["Soirée"] },
          { tag: "option", attributes: [["value", "autre"]], children: ["Autre"] }
        ]
      }
    ]
  };
}

function createLocationFilter() {
  return {
    tag: "div",
    attributes: [["class", "w-full"]],
    children: [
      {
        tag: "label",
        attributes: [
          ["for", "location-filter"],
          ["class", "block text-sm font-medium text-gray-700 mb-2"]
        ],
        children: ["Lieu"]
      },
      {
        tag: "select",
        attributes: [
          ["id", "location-filter"],
          ["name", "location"],
          ["class", "w-full px-3 py-2.5 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900"]
        ],
        events: {
          change: [() => applyFilters()]
        },
        children: [
          { tag: "option", attributes: [["value", ""]], children: ["Tous les lieux"] },
          { tag: "option", attributes: [["value", "paris"]], children: ["Paris"] },
          { tag: "option", attributes: [["value", "lyon"]], children: ["Lyon"] },
          { tag: "option", attributes: [["value", "marseille"]], children: ["Marseille"] },
          { tag: "option", attributes: [["value", "toulouse"]], children: ["Toulouse"] },
          { tag: "option", attributes: [["value", "nice"]], children: ["Nice"] },
          { tag: "option", attributes: [["value", "online"]], children: ["En ligne"] }
        ]
      }
    ]
  };
}

function createDateFilter() {
  return {
    tag: "div",
    attributes: [["class", "w-full"]],
    children: [
      {
        tag: "label",
        attributes: [
          ["for", "date-filter"],
          ["class", "block text-sm font-medium text-gray-700 mb-2"]
        ],
        children: ["Date"]
      },
      {
        tag: "select",
        attributes: [
          ["id", "date-filter"],
          ["name", "date"],
          ["class", "w-full px-3 py-2.5 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900"]
        ],
        events: {
          change: [() => applyFilters()]
        },
        children: [
          { tag: "option", attributes: [["value", ""]], children: ["Toutes les dates"] },
          { tag: "option", attributes: [["value", "today"]], children: ["Aujourd'hui"] },
          { tag: "option", attributes: [["value", "week"]], children: ["Cette semaine"] },
          { tag: "option", attributes: [["value", "month"]], children: ["Ce mois"] },
          { tag: "option", attributes: [["value", "upcoming"]], children: ["À venir"] }
        ]
      }
    ]
  };
}

function createPriceFilter() {
  return {
    tag: "div",
    attributes: [["class", "w-full"]],
    children: [
      {
        tag: "label",
        attributes: [
          ["for", "price-filter"],
          ["class", "block text-sm font-medium text-gray-700 mb-2"]
        ],
        children: ["Prix"]
      },
      {
        tag: "select",
        attributes: [
          ["id", "price-filter"],
          ["name", "price"],
          ["class", "w-full px-3 py-2.5 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900"]
        ],
        events: {
          change: [() => applyFilters()]
        },
        children: [
          { tag: "option", attributes: [["value", ""]], children: ["Tous les prix"] },
          { tag: "option", attributes: [["value", "free"]], children: ["Gratuit"] },
          { tag: "option", attributes: [["value", "paid"]], children: ["Payant"] },
          { tag: "option", attributes: [["value", "0-25"]], children: ["0€ - 25€"] },
          { tag: "option", attributes: [["value", "25-50"]], children: ["25€ - 50€"] },
          { tag: "option", attributes: [["value", "50-100"]], children: ["50€ - 100€"] },
          { tag: "option", attributes: [["value", "100+"]], children: ["100€+"] }
        ]
      }
    ]
  };
}

function createSortFilter() {
  return {
    tag: "select",
    attributes: [
      ["id", "sort-filter"],
      ["name", "sort"],
      ["class", "px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900 text-sm"]
    ],
    events: {
      change: [() => applyFilters()]
    },
    children: [
      { tag: "option", attributes: [["value", "popular"]], children: ["Plus populaire"] },
      { tag: "option", attributes: [["value", "date_asc"]], children: ["Date croissante"] },
      { tag: "option", attributes: [["value", "date_desc"]], children: ["Date décroissante"] },
      { tag: "option", attributes: [["value", "price_asc"]], children: ["Prix croissant"] },
      { tag: "option", attributes: [["value", "price_desc"]], children: ["Prix décroissant"] },
      { tag: "option", attributes: [["value", "title"]], children: ["Alphabétique"] }
    ]
  };
}

function createEventsGrid() {
  return {
    tag: "div",
    attributes: [["class", "w-full"]],
    children: [
      {
        tag: "div",
        attributes: [["id", "events-grid"], ["class", "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"]],
        children: [
          {
            tag: "div",
            attributes: [["class", "col-span-full flex justify-center items-center py-16"]],
            children: [
              {
                tag: "div",
                attributes: [["class", "text-center"]],
                children: [
                  {
                    tag: "div",
                    attributes: [["class", "inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-4"]],
                    children: []
                  },
                  {
                    tag: "p",
                    attributes: [["class", "text-gray-600 text-lg"]],
                    children: ["Chargement des événements..."]
                  }
                ]
              }
            ]
          }
        ]
      }
    ]
  };
}

function createPagination() {
  return {
    tag: "div",
    attributes: [["class", "w-full mt-8"]],
    children: [
      {
        tag: "div",
        attributes: [["id", "pagination"], ["class", "flex justify-center items-center"]],
        children: []
      }
    ]
  };
}

function createPopularNearbySection() {
  return {
    tag: "section",
    attributes: [["class", "w-full bg-white border-t border-gray-200 py-16"]],
    children: [
      {
        tag: "div",
        attributes: [["class", "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"]],
        children: [
          {
            tag: "div",
            attributes: [["class", "text-center mb-12"]],
            children: [
              {
                tag: "h2",
                attributes: [["class", "text-3xl font-bold text-gray-900 mb-4"]],
                children: ["Populaire à proximité"]
              },
              {
                tag: "p",
                attributes: [["class", "text-lg text-gray-600 max-w-2xl mx-auto"]],
                children: ["Découvrez les événements les plus appréciés près de chez vous"]
              }
            ]
          },

          {
            tag: "div",
            attributes: [["id", "popular-events-grid"], ["class", "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"]],
            children: [
              createPopularEventCard({
                id: 'pop1',
                title: 'Concert Jazz & Blues',
                date: '2025-07-30T20:00:00',
                location: 'Paris',
                price: 35,
                category: 'concert',
                image_url: 'images/soiree_music.jpg',
                participants_count: 156
              }),
              createPopularEventCard({
                id: 'pop2',
                title: 'Conférence Tech Innovation',
                date: '2025-08-02T14:00:00',
                location: 'Lyon',
                price: 0,
                category: 'conference',
                image_url: 'images/press-conference.svg',
                participants_count: 89
              }),
              createPopularEventCard({
                id: 'pop3',
                title: 'Tournoi de Basketball',
                date: '2025-08-05T18:00:00',
                location: 'Marseille',
                price: 15,
                category: 'sport',
                image_url: 'images/basketball.svg',
                participants_count: 234
              })
            ]
          },

          {
            tag: "div",
            attributes: [["class", "text-center mt-12"]],
            children: [
              {
                tag: "button",
                attributes: [
                  ["class", "inline-flex items-center px-6 py-3 border border-gray-300 shadow-sm text-base font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"],
                  ["onclick", "showMorePopularEvents()"]
                ],
                children: [
                  "Voir plus d'événements",
                  {
                    tag: "svg",
                    attributes: [
                      ["class", "ml-2 w-5 h-5"],
                      ["fill", "none"],
                      ["stroke", "currentColor"],
                      ["viewBox", "0 0 24 24"]
                    ],
                    children: [
                      {
                        tag: "path",
                        attributes: [
                          ["stroke-linecap", "round"],
                          ["stroke-linejoin", "round"],
                          ["stroke-width", "2"],
                          ["d", "M9 5l7 7-7 7"]
                        ]
                      }
                    ]
                  }
                ]
              }
            ]
          }
        ]
      }
    ]
  };
}

function createPopularEventCard(event) {
  const eventDate = new Date(event.date);
  const day = eventDate.getDate().toString().padStart(2, '0');
  const month = eventDate.toLocaleDateString('fr-FR', { month: 'short' });
  const time = eventDate.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });

  const price = event.price ? `${event.price}€` : 'Gratuit';
  const category = event.category || 'Événement';

  const categoryColors = {
    'conference': 'bg-blue-100 text-blue-800 border-blue-200',
    'concert': 'bg-purple-100 text-purple-800 border-purple-200',
    'sport': 'bg-green-100 text-green-800 border-green-200',
    'formation': 'bg-yellow-100 text-yellow-800 border-yellow-200',
    'soiree': 'bg-pink-100 text-pink-800 border-pink-200',
    'autre': 'bg-gray-100 text-gray-800 border-gray-200'
  };

  const categoryClass = categoryColors[event.category?.toLowerCase()] || categoryColors['autre'];

  return {
    tag: "div",
    attributes: [
      ["class", "bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg hover:border-gray-300 transition-all duration-300 cursor-pointer group card-hover"],
      ["onclick", `goToEventDetail('${event.id}')`]
    ],
    children: [
      {
        tag: "div",
        attributes: [["class", "relative h-48 overflow-hidden"]],
        children: [
          {
            tag: "img",
            attributes: [
              ["class", "w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"],
              ["alt", event.title],
              ["src", event.image_url || 'images/event_1.jpg'],
              ["onerror", "this.src='images/event_1.jpg'"]
            ]
          },
          {
            tag: "div",
            attributes: [["class", "absolute top-4 right-4 bg-red-500 text-white rounded-full px-3 py-1 text-sm font-medium shadow-lg"]],
            children: [
              {
                tag: "div",
                attributes: [["class", "flex items-center space-x-1"]],
                children: [
                  {
                    tag: "svg",
                    attributes: [
                      ["class", "w-4 h-4"],
                      ["fill", "currentColor"],
                      ["viewBox", "0 0 20 20"]
                    ],
                    children: [
                      {
                        tag: "path",
                        attributes: [["d", "M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"]]
                      }
                    ]
                  },
                  {
                    tag: "span",
                    children: ["Populaire"]
                  }
                ]
              }
            ]
          },
          {
            tag: "div",
            attributes: [["class", "absolute top-4 left-4 bg-white rounded-lg px-3 py-2 shadow-lg border border-gray-100"]],
            children: [
              {
                tag: "div",
                attributes: [["class", "text-center"]],
                children: [
                  {
                    tag: "div",
                    attributes: [["class", "text-xl font-bold text-gray-900 leading-none"]],
                    children: [day]
                  },
                  {
                    tag: "div",
                    attributes: [["class", "text-xs text-gray-600 uppercase font-medium mt-1"]],
                    children: [month]
                  }
                ]
              }
            ]
          }
        ]
      },

      {
        tag: "div",
        attributes: [["class", "p-6"]],
        children: [
          {
            tag: "div",
            attributes: [["class", "flex items-center justify-between mb-3"]],
            children: [
              {
                tag: "span",
                attributes: [["class", `inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${categoryClass}`]],
                children: [category]
              },
              {
                tag: "div",
                attributes: [["class", "flex items-center text-sm text-gray-500"]],
                children: [
                  {
                    tag: "svg",
                    attributes: [
                      ["class", "w-4 h-4 mr-1"],
                      ["fill", "none"],
                      ["stroke", "currentColor"],
                      ["viewBox", "0 0 24 24"]
                    ],
                    children: [
                      {
                        tag: "path",
                        attributes: [
                          ["stroke-linecap", "round"],
                          ["stroke-linejoin", "round"],
                          ["stroke-width", "2"],
                          ["d", "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"]
                        ]
                      }
                    ]
                  },
                  `${event.participants_count} participants`
                ]
              }
            ]
          },

          {
            tag: "h3",
            attributes: [["class", "text-lg font-semibold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors leading-tight line-clamp-2"]],
            children: [event.title]
          },

          {
            tag: "div",
            attributes: [["class", "space-y-2 mb-4"]],
            children: [
              {
                tag: "div",
                attributes: [["class", "flex items-center text-sm text-gray-600"]],
                children: [
                  {
                    tag: "svg",
                    attributes: [
                      ["class", "w-4 h-4 mr-2 text-gray-400 flex-shrink-0"],
                      ["fill", "none"],
                      ["stroke", "currentColor"],
                      ["viewBox", "0 0 24 24"]
                    ],
                    children: [
                      {
                        tag: "path",
                        attributes: [
                          ["stroke-linecap", "round"],
                          ["stroke-linejoin", "round"],
                          ["stroke-width", "2"],
                          ["d", "M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"]
                        ]
                      },
                      {
                        tag: "path",
                        attributes: [
                          ["stroke-linecap", "round"],
                          ["stroke-linejoin", "round"],
                          ["stroke-width", "2"],
                          ["d", "M15 11a3 3 0 11-6 0 3 3 0 016 0z"]
                        ]
                      }
                    ]
                  },
                  {
                    tag: "span",
                    attributes: [["class", "truncate"]],
                    children: [event.location || 'Lieu à définir']
                  }
                ]
              },
              {
                tag: "div",
                attributes: [["class", "flex items-center text-sm text-gray-600"]],
                children: [
                  {
                    tag: "svg",
                    attributes: [
                      ["class", "w-4 h-4 mr-2 text-gray-400 flex-shrink-0"],
                      ["fill", "none"],
                      ["stroke", "currentColor"],
                      ["viewBox", "0 0 24 24"]
                    ],
                    children: [
                      {
                        tag: "path",
                        attributes: [
                          ["stroke-linecap", "round"],
                          ["stroke-linejoin", "round"],
                          ["stroke-width", "2"],
                          ["d", "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"]
                        ]
                      }
                    ]
                  },
                  time
                ]
              }
            ]
          },

          {
            tag: "div",
            attributes: [["class", "flex items-center justify-between pt-4 border-t border-gray-100"]],
            children: [
              {
                tag: "div",
                attributes: [["class", "text-xl font-bold text-gray-900"]],
                children: [price]
              },
              {
                tag: "button",
                attributes: [
                  ["class", "inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"],
                  ["onclick", `event.stopPropagation(); handleEventAction('${event.id}')`]
                ],
                children: [
                  "Voir détails",
                  {
                    tag: "svg",
                    attributes: [
                      ["class", "w-4 h-4 ml-2"],
                      ["fill", "none"],
                      ["stroke", "currentColor"],
                      ["viewBox", "0 0 24 24"]
                    ],
                    children: [
                      {
                        tag: "path",
                        attributes: [
                          ["stroke-linecap", "round"],
                          ["stroke-linejoin", "round"],
                          ["stroke-width", "2"],
                          ["d", "M9 5l7 7-7 7"]
                        ]
                      }
                    ]
                  }
                ]
              }
            ]
          }
        ]
      }
    ]
  };
}

function createFooter() {
  return {
    tag: "footer",
    attributes: [["class", "bg-gray-900 text-white"]],
    children: [
      {
        tag: "div",
        attributes: [["class", "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12"]],
        children: [
          {
            tag: "div",
            attributes: [["class", "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"]],
            children: [
              {
                tag: "div",
                children: [
                  {
                    tag: "h3",
                    attributes: [["class", "text-lg font-semibold mb-4"]],
                    children: ["À propos de Konect"]
                  },
                  {
                    tag: "p",
                    attributes: [["class", "text-gray-400 mb-4 text-sm leading-relaxed"]],
                    children: ["Découvrez et participez aux meilleurs événements près de chez vous. Connectez-vous avec votre communauté et créez des souvenirs inoubliables."]
                  },
                  {
                    tag: "div",
                    attributes: [["class", "flex space-x-4"]],
                    children: [
                      {
                        tag: "a",
                        attributes: [
                          ["href", "#"],
                          ["class", "text-gray-400 hover:text-white transition-colors"]
                        ],
                        children: [
                          {
                            tag: "svg",
                            attributes: [
                              ["class", "w-5 h-5"],
                              ["fill", "currentColor"],
                              ["viewBox", "0 0 24 24"]
                            ],
                            children: [
                              {
                                tag: "path",
                                attributes: [["d", "M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"]]
                              }
                            ]
                          }
                        ]
                      },
                      {
                        tag: "a",
                        attributes: [
                          ["href", "#"],
                          ["class", "text-gray-400 hover:text-white transition-colors"]
                        ],
                        children: [
                          {
                            tag: "svg",
                            attributes: [
                              ["class", "w-5 h-5"],
                              ["fill", "currentColor"],
                              ["viewBox", "0 0 24 24"]
                            ],
                            children: [
                              {
                                tag: "path",
                                attributes: [["d", "M22.46 6c-.77.35-1.6.58-2.46.69.88-.53 1.56-1.37 1.88-2.38-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98C8.28 9.09 5.11 7.38 3 4.79c-.37.63-.58 1.37-.58 2.15 0 1.49.75 2.81 1.91 3.56-.71 0-1.37-.2-1.95-.5v.03c0 2.08 1.48 3.82 3.44 4.21a4.22 4.22 0 0 1-1.93.07 4.28 4.28 0 0 0 4 2.98 8.521 8.521 0 0 1-5.33 1.84c-.34 0-.68-.02-1.02-.06C3.44 20.29 5.7 21 8.12 21 16 21 20.33 14.46 20.33 8.79c0-.19 0-.37-.01-.56.84-.6 1.56-1.36 2.14-2.23z"]]
                              }
                            ]
                          }
                        ]
                      },
                      {
                        tag: "a",
                        attributes: [
                          ["href", "#"],
                          ["class", "text-gray-400 hover:text-white transition-colors"]
                        ],
                        children: [
                          {
                            tag: "svg",
                            attributes: [
                              ["class", "w-5 h-5"],
                              ["fill", "currentColor"],
                              ["viewBox", "0 0 24 24"]
                            ],
                            children: [
                              {
                                tag: "path",
                                attributes: [["d", "M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.174-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.097.118.112.222.083.343-.09.378-.293 1.199-.334 1.363-.053.225-.172.271-.402.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.357-.629-2.748-1.378 0 0-.599 2.282-.744 2.840-.282 1.084-1.064 2.456-1.549 3.235C9.584 23.815 10.77 24.001 12.017 24.001c6.624 0 11.99-5.367 11.99-11.988C24.007 5.367 18.641.001 12.017.001z"]]
                              }
                            ]
                          }
                        ]
                      }
                    ]
                  }
                ]
              },

              {
                tag: "div",
                children: [
                  {
                    tag: "h3",
                    attributes: [["class", "text-lg font-semibold mb-4"]],
                    children: ["Navigation"]
                  },
                  {
                    tag: "ul",
                    attributes: [["class", "space-y-2"]],
                    children: [
                      {
                        tag: "li",
                        children: [
                          {
                            tag: "a",
                            attributes: [
                              ["href", "#"],
                              ["class", "text-gray-400 hover:text-white transition-colors text-sm"]
                            ],
                            children: ["Accueil"]
                          }
                        ]
                      },
                      {
                        tag: "li",
                        children: [
                          {
                            tag: "a",
                            attributes: [
                              ["href", "#events"],
                              ["class", "text-gray-400 hover:text-white transition-colors text-sm"]
                            ],
                            children: ["Événements"]
                          }
                        ]
                      },
                      {
                        tag: "li",
                        children: [
                          {
                            tag: "a",
                            attributes: [
                              ["href", "#"],
                              ["class", "text-gray-400 hover:text-white transition-colors text-sm"]
                            ],
                            children: ["Créer un événement"]
                          }
                        ]
                      },
                      {
                        tag: "li",
                        children: [
                          {
                            tag: "a",
                            attributes: [
                              ["href", "#"],
                              ["class", "text-gray-400 hover:text-white transition-colors text-sm"]
                            ],
                            children: ["Mon profil"]
                          }
                        ]
                      }
                    ]
                  }
                ]
              },

              {
                tag: "div",
                children: [
                  {
                    tag: "h3",
                    attributes: [["class", "text-lg font-semibold mb-4"]],
                    children: ["Support"]
                  },
                  {
                    tag: "ul",
                    attributes: [["class", "space-y-2"]],
                    children: [
                      {
                        tag: "li",
                        children: [
                          {
                            tag: "a",
                            attributes: [
                              ["href", "#"],
                              ["class", "text-gray-400 hover:text-white transition-colors text-sm"]
                            ],
                            children: ["Centre d'aide"]
                          }
                        ]
                      },
                      {
                        tag: "li",
                        children: [
                          {
                            tag: "a",
                            attributes: [
                              ["href", "#"],
                              ["class", "text-gray-400 hover:text-white transition-colors text-sm"]
                            ],
                            children: ["Nous contacter"]
                          }
                        ]
                      },
                      {
                        tag: "li",
                        children: [
                          {
                            tag: "a",
                            attributes: [
                              ["href", "#"],
                              ["class", "text-gray-400 hover:text-white transition-colors text-sm"]
                            ],
                            children: ["Conditions d'utilisation"]
                          }
                        ]
                      },
                      {
                        tag: "li",
                        children: [
                          {
                            tag: "a",
                            attributes: [
                              ["href", "#"],
                              ["class", "text-gray-400 hover:text-white transition-colors text-sm"]
                            ],
                            children: ["Politique de confidentialité"]
                          }
                        ]
                      }
                    ]
                  }
                ]
              },

              {
                tag: "div",
                children: [
                  {
                    tag: "h3",
                    attributes: [["class", "text-lg font-semibold mb-4"]],
                    children: ["Contact"]
                  },
                  {
                    tag: "div",
                    attributes: [["class", "space-y-3"]],
                    children: [
                      {
                        tag: "div",
                        attributes: [["class", "flex items-center text-gray-400 text-sm"]],
                        children: [
                          {
                            tag: "svg",
                            attributes: [
                              ["class", "w-4 h-4 mr-2 flex-shrink-0"],
                              ["fill", "none"],
                              ["stroke", "currentColor"],
                              ["viewBox", "0 0 24 24"]
                            ],
                            children: [
                              {
                                tag: "path",
                                attributes: [
                                  ["stroke-linecap", "round"],
                                  ["stroke-linejoin", "round"],
                                  ["stroke-width", "2"],
                                  ["d", "M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"]
                                ]
                              }
                            ]
                          },
                          "contact@konect.fr"
                        ]
                      },
                      {
                        tag: "div",
                        attributes: [["class", "flex items-center text-gray-400 text-sm"]],
                        children: [
                          {
                            tag: "svg",
                            attributes: [
                              ["class", "w-4 h-4 mr-2 flex-shrink-0"],
                              ["fill", "none"],
                              ["stroke", "currentColor"],
                              ["viewBox", "0 0 24 24"]
                            ],
                            children: [
                              {
                                tag: "path",
                                attributes: [
                                  ["stroke-linecap", "round"],
                                  ["stroke-linejoin", "round"],
                                  ["stroke-width", "2"],
                                  ["d", "M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"]
                                ]
                              }
                            ]
                          },
                          "+33 1 23 45 67 89"
                        ]
                      },
                      {
                        tag: "div",
                        attributes: [["class", "flex items-start text-gray-400 text-sm"]],
                        children: [
                          {
                            tag: "svg",
                            attributes: [
                              ["class", "w-4 h-4 mr-2 flex-shrink-0 mt-0.5"],
                              ["fill", "none"],
                              ["stroke", "currentColor"],
                              ["viewBox", "0 0 24 24"]
                            ],
                            children: [
                              {
                                tag: "path",
                                attributes: [
                                  ["stroke-linecap", "round"],
                                  ["stroke-linejoin", "round"],
                                  ["stroke-width", "2"],
                                  ["d", "M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"]
                                ]
                              },
                              {
                                tag: "path",
                                attributes: [
                                  ["stroke-linecap", "round"],
                                  ["stroke-linejoin", "round"],
                                  ["stroke-width", "2"],
                                  ["d", "M15 11a3 3 0 11-6 0 3 3 0 016 0z"]
                                ]
                              }
                            ]
                          },
                          {
                            tag: "span",
                            children: ["123 Rue de la Paix, 75001 Paris, France"]
                          }
                        ]
                      }
                    ]
                  }
                ]
              }
            ]
          },

          {
            tag: "div",
            attributes: [["class", "border-t border-gray-800 mt-8 pt-8"]],
            children: [
              {
                tag: "div",
                attributes: [["class", "flex flex-col md:flex-row justify-between items-center"]],
                children: [
                  {
                    tag: "div",
                    attributes: [["class", "flex items-center mb-4 md:mb-0"]],
                    children: [
                      {
                        tag: "img",
                        attributes: [
                          ["src", "images/logo.svg"],
                          ["alt", "Konect"],
                          ["class", "h-8 w-auto mr-3"]
                        ]
                      },
                      {
                        tag: "span",
                        attributes: [["class", "text-xl font-bold"]],
                        children: ["Konect"]
                      }
                    ]
                  },
                  {
                    tag: "div",
                    attributes: [["class", "text-gray-400 text-sm text-center md:text-right"]],
                    children: [
                      {
                        tag: "p",
                        children: [`© ${new Date().getFullYear()} Konect. Tous droits réservés.`]
                      }
                    ]
                  }
                ]
              }
            ]
          }
        ]
      }
    ]
  };
}

async function loadAllEvents() {
  try {
    const result = await database.getEvents();
    allEvents = result.data || [];
    applyFilters();
  } catch (error) {
    console.error('Erreur lors du chargement des événements:', error);
    const grid = document.getElementById('events-grid');
    if (grid) {
      grid.innerHTML = '<div class="error-message">Erreur lors du chargement des événements</div>';
    }
  }
}

function applyFilters() {
  const categoryFilter = document.getElementById('category-filter')?.value || '';
  const locationFilter = document.getElementById('location-filter')?.value || '';
  const dateFilter = document.getElementById('date-filter')?.value || '';
  const priceFilter = document.getElementById('price-filter')?.value || '';
  const sortFilter = document.getElementById('sort-filter')?.value || 'popular';

  currentFilters = {
    category: categoryFilter,
    location: locationFilter,
    date: dateFilter,
    price: priceFilter,
    sortBy: sortFilter
  };

  filteredEvents = [...allEvents];

  if (categoryFilter) {
    filteredEvents = filteredEvents.filter(event =>
      event.category?.toLowerCase() === categoryFilter.toLowerCase()
    );
  }

  if (locationFilter && locationFilter !== 'online') {
    filteredEvents = filteredEvents.filter(event =>
      event.location?.toLowerCase().includes(locationFilter.toLowerCase())
    );
  } else if (locationFilter === 'online') {
    filteredEvents = filteredEvents.filter(event =>
      event.is_online || event.location?.toLowerCase().includes('ligne')
    );
  }

  if (dateFilter) {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    filteredEvents = filteredEvents.filter(event => {
      if (!event.date) return false;
      const eventDate = new Date(event.date);

      switch (dateFilter) {
        case 'today':
          return eventDate.toDateString() === today.toDateString();
        case 'week':
          const oneWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
          return eventDate >= today && eventDate <= oneWeek;
        case 'month':
          const oneMonth = new Date(today.getFullYear(), today.getMonth() + 1, today.getDate());
          return eventDate >= today && eventDate <= oneMonth;
        case 'upcoming':
          return eventDate >= today;
        default:
          return true;
      }
    });
  }

  if (priceFilter) {
    filteredEvents = filteredEvents.filter(event => {
      const price = event.price || 0;
      switch (priceFilter) {
        case 'free':
          return price === 0;
        case 'paid':
          return price > 0;
        case '0-25':
          return price >= 0 && price <= 25;
        case '25-50':
          return price > 25 && price <= 50;
        case '50-100':
          return price > 50 && price <= 100;
        case '100+':
          return price > 100;
        default:
          return true;
      }
    });
  }

  filteredEvents.sort((a, b) => {
    switch (sortFilter) {
      case 'date_asc':
        return new Date(a.date || 0) - new Date(b.date || 0);
      case 'date_desc':
        return new Date(b.date || 0) - new Date(a.date || 0);
      case 'price_asc':
        return (a.price || 0) - (b.price || 0);
      case 'price_desc':
        return (b.price || 0) - (a.price || 0);
      case 'title':
        return (a.title || '').localeCompare(b.title || '');
      case 'popular':
      default:
        return (b.participants_count || 0) - (a.participants_count || 0);
    }
  });

  currentPage = 1;

  displayEvents();
  updatePagination();
}

function displayEvents() {
  const grid = document.getElementById('events-grid');
  const countElement = document.getElementById('events-count');

  if (!grid) return;

  if (countElement) {
    const totalEvents = filteredEvents.length;
    const startIndex = (currentPage - 1) * eventsPerPage + 1;
    const endIndex = Math.min(currentPage * eventsPerPage, totalEvents);

    if (totalEvents === 0) {
      countElement.textContent = "Aucun événement trouvé";
    } else {
      countElement.textContent = `Affichage de ${startIndex} à ${endIndex} sur ${totalEvents} événement${totalEvents > 1 ? 's' : ''}`;
    }
  }

  if (filteredEvents.length === 0) {
    grid.innerHTML = `
      <div class="col-span-full text-center py-16">
        <div class="text-gray-400 mb-6">
          <svg class="mx-auto h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
        </div>
        <h3 class="text-lg font-medium text-gray-900 mb-2">Aucun événement trouvé</h3>
        <p class="text-gray-600 mb-6">Essayez de modifier vos critères de recherche pour voir plus de résultats.</p>
        <button 
          onclick="resetFilters()" 
          class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Réinitialiser les filtres
        </button>
      </div>
    `;
    return;
  }

  const startIndex = (currentPage - 1) * eventsPerPage;
  const endIndex = startIndex + eventsPerPage;
  const eventsToShow = filteredEvents.slice(startIndex, endIndex);

  const eventsHTML = eventsToShow.map((event, index) => {
    return `<div class="animate-fadeIn" style="animation-delay: ${index * 0.1}s">${createEventCard(event)}</div>`;
  }).join('');

  grid.innerHTML = eventsHTML;
} function createEventCard(event) {
  const eventDate = new Date(event.date);
  const day = eventDate.getDate().toString().padStart(2, '0');
  const month = eventDate.toLocaleDateString('fr-FR', { month: 'short' });
  const time = eventDate.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });

  const price = event.price ? `${event.price}€` : 'Gratuit';
  const category = event.category || 'Événement';

  const isPastEvent = eventDate < new Date();
  const categoryColors = {
    'conference': 'bg-blue-100 text-blue-800 border-blue-200',
    'concert': 'bg-purple-100 text-purple-800 border-purple-200',
    'sport': 'bg-green-100 text-green-800 border-green-200',
    'formation': 'bg-yellow-100 text-yellow-800 border-yellow-200',
    'soiree': 'bg-pink-100 text-pink-800 border-pink-200',
    'autre': 'bg-gray-100 text-gray-800 border-gray-200'
  };

  const categoryClass = categoryColors[event.category?.toLowerCase()] || categoryColors['autre'];

  return `
    <div class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg hover:border-gray-300 transition-all duration-300 cursor-pointer group" onclick="goToEventDetail('${event.id}')">
      <!-- Image -->
      <div class="relative h-48 overflow-hidden">
        <img 
          class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
          alt="${event.title}" 
          src="${event.image_url || 'images/event_1.jpg'}"
          onerror="this.src='images/event_1.jpg'"
        />
        <!-- Badge de date -->
        <div class="absolute top-4 left-4 bg-white rounded-lg px-3 py-2 shadow-lg border border-gray-100">
          <div class="text-center">
            <div class="text-xl font-bold text-gray-900 leading-none">${day}</div>
            <div class="text-xs text-gray-600 uppercase font-medium mt-1">${month}</div>
          </div>
        </div>
        <!-- Overlay pour événements passés -->
        ${isPastEvent ? `
          <div class="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center">
            <div class="bg-white rounded-lg px-4 py-2 shadow-lg">
              <span class="text-gray-800 font-semibold text-sm">Événement terminé</span>
            </div>
          </div>
        ` : ''}
      </div>
      
      <!-- Contenu -->
      <div class="p-6">
        <!-- En-tête avec catégorie et heure -->
        <div class="flex items-center justify-between mb-3">
          <span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${categoryClass}">
            ${category}
          </span>
          <div class="flex items-center text-sm text-gray-500">
            <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
            ${time}
          </div>
        </div>
        
        <!-- Titre -->
        <h3 class="text-lg font-semibold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors leading-tight" style="display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; min-height: 3.5rem;">
          ${event.title}
        </h3>
        
        <!-- Localisation -->
        <div class="flex items-center text-sm text-gray-600 mb-4">
          <svg class="w-4 h-4 mr-2 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
          </svg>
          <span class="truncate">${event.location || 'Lieu à définir'}</span>
        </div>
        
        <!-- Prix et bouton -->
        <div class="flex items-center justify-between pt-4 border-t border-gray-100">
          <div class="text-xl font-bold text-gray-900">
            ${price}
          </div>
          <button 
            class="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            onclick="event.stopPropagation(); handleEventAction('${event.id}')"
            ${isPastEvent ? 'disabled' : ''}
          >
            ${isPastEvent ? 'Terminé' : 'Voir détails'}
            ${!isPastEvent ? `
              <svg class="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
              </svg>
            ` : ''}
          </button>
        </div>
      </div>
    </div>
  `;
}

function updatePagination() {
  const pagination = document.getElementById('pagination');
  if (!pagination) return;

  const totalPages = Math.ceil(filteredEvents.length / eventsPerPage);

  if (totalPages <= 1) {
    pagination.innerHTML = '';
    return;
  }

  let paginationHTML = '<nav class="inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">';

  if (currentPage > 1) {
    paginationHTML += `
      <button 
        class="relative inline-flex items-center rounded-l-md px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 hover:bg-gray-50 hover:text-gray-700 focus:z-10 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
        onclick="changePage(${currentPage - 1})"
      >
        <span class="sr-only">Précédent</span>
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
        </svg>
      </button>
    `;
  } else {
    paginationHTML += `
      <span class="relative inline-flex items-center rounded-l-md px-3 py-2 text-sm font-medium text-gray-300 bg-gray-50 border border-gray-300 cursor-not-allowed">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
        </svg>
      </span>
    `;
  }

  const maxVisiblePages = 5;
  let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
  let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

  if (endPage - startPage + 1 < maxVisiblePages) {
    startPage = Math.max(1, endPage - maxVisiblePages + 1);
  }

  if (startPage > 1) {
    paginationHTML += `
      <button 
        class="relative inline-flex items-center px-4 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 hover:bg-gray-50 hover:text-gray-700 focus:z-10 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
        onclick="changePage(1)"
      >
        1
      </button>
    `;
    if (startPage > 2) {
      paginationHTML += `
        <span class="relative inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300">
          ...
        </span>
      `;
    }
  }

  for (let i = startPage; i <= endPage; i++) {
    if (i === currentPage) {
      paginationHTML += `
        <button 
          class="relative inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-blue-600 z-10 focus:z-20 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          aria-current="page"
        >
          ${i}
        </button>
      `;
    } else {
      paginationHTML += `
        <button 
          class="relative inline-flex items-center px-4 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 hover:bg-gray-50 hover:text-gray-700 focus:z-10 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
          onclick="changePage(${i})"
        >
          ${i}
        </button>
      `;
    }
  }

  if (endPage < totalPages) {
    if (endPage < totalPages - 1) {
      paginationHTML += `
        <span class="relative inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300">
          ...
        </span>
      `;
    }
    paginationHTML += `
      <button 
        class="relative inline-flex items-center px-4 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 hover:bg-gray-50 hover:text-gray-700 focus:z-10 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
        onclick="changePage(${totalPages})"
      >
        ${totalPages}
      </button>
    `;
  }

  if (currentPage < totalPages) {
    paginationHTML += `
      <button 
        class="relative inline-flex items-center rounded-r-md px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 hover:bg-gray-50 hover:text-gray-700 focus:z-10 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
        onclick="changePage(${currentPage + 1})"
      >
        <span class="sr-only">Suivant</span>
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
        </svg>
      </button>
    `;
  } else {
    paginationHTML += `
      <span class="relative inline-flex items-center rounded-r-md px-3 py-2 text-sm font-medium text-gray-300 bg-gray-50 border border-gray-300 cursor-not-allowed">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
        </svg>
      </span>
    `;
  }

  paginationHTML += '</nav>';
  pagination.innerHTML = paginationHTML;
}

function changePage(page) {
  const totalPages = Math.ceil(filteredEvents.length / eventsPerPage);

  if (page >= 1 && page <= totalPages) {
    currentPage = page;
    displayEvents();

    const eventsSection = document.getElementById('events-section');
    if (eventsSection) {
      eventsSection.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  }
}

function resetFilters() {
  const categorySelect = document.getElementById('category-filter');
  const locationSelect = document.getElementById('location-filter');
  const dateSelect = document.getElementById('date-filter');
  const priceRange = document.getElementById('price-range');
  const sortSelect = document.getElementById('sort-filter');

  if (categorySelect) categorySelect.value = '';
  if (locationSelect) locationSelect.value = '';
  if (dateSelect) dateSelect.value = '';
  if (priceRange) priceRange.value = '100';
  if (sortSelect) sortSelect.value = 'date-asc';

  appliedFilters = {
    category: '',
    location: '',
    date: '',
    maxPrice: 100,
    sort: 'date-asc'
  };

  currentPage = 1;

  applyFilters();
}

function goToEventDetail(eventId) {
  window.location = `event-detail?id=${eventId}`;
}

function handleEventAction(eventId) {
  goToEventDetail(eventId);
}

function showMorePopularEvents() {
  window.location = 'events?filter=popular';

  if (window.location.includes('events')) {
    const sortSelect = document.getElementById('sort-filter');
    if (sortSelect) {
      sortSelect.value = 'popular';
      applyFilters();
    }
  }
}

window.applyFilters = applyFilters;
window.changePage = changePage;
window.resetFilters = resetFilters;
window.goToEventDetail = goToEventDetail;
window.handleEventAction = handleEventAction;
window.showMorePopularEvents = showMorePopularEvents; 