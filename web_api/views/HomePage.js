import { BrowserLink } from "../components/BrowserRouter.js";
import { auth, database } from "../lib/supabase.js";
import { createCommonNavbar, updateCommonUserDisplay, handleCommonLogout } from "../components/CommonNavbar.js";

export default function HomePage() {
  // Initialiser l'affichage utilisateur après le rendu
  setTimeout(async () => {
    await updateCommonUserDisplay();
    await loadEvents();
    await loadCommunities();

    // Écouter les changements d'authentification
    auth.onAuthStateChange((event, session) => {
      updateCommonUserDisplay();
      loadEvents();
      loadCommunities();
    });
  }, 100);

  return {
    tag: "div",
    attributes: [["class", "min-h-screen bg-gradient-to-br from-slate-50 to-blue-50"]],
    children: [
      createCommonNavbar(),
      createHeroSection(),
      createFeaturesSection(),
      createCategoriesSection(),
      createEventsShowcase(),
      createCtaSection(),
      createFooter()
    ]
  };
}

// Hero Section moderne avec Tailwind CSS
function createHeroSection() {
  return {
    tag: "section",
    attributes: [["class", "relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-blue-600 via-purple-600 to-pink-500"]],
    children: [
      // Background pattern
      {
        tag: "div",
        attributes: [["class", "absolute inset-0 bg-black bg-opacity-20"]],
        children: []
      },
      // Animated background shapes
      {
        tag: "div",
        attributes: [["class", "absolute inset-0 overflow-hidden"]],
        children: [
          {
            tag: "div",
            attributes: [["class", "absolute -top-40 -right-32 w-80 h-80 bg-white bg-opacity-10 rounded-full blur-3xl animate-pulse"]],
            children: []
          },
          {
            tag: "div",
            attributes: [["class", "absolute -bottom-40 -left-32 w-80 h-80 bg-yellow-300 bg-opacity-20 rounded-full blur-3xl animate-pulse"]],
            children: []
          }
        ]
      },
      // Main content
      {
        tag: "div",
        attributes: [["class", "relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center"]],
        children: [
          {
            tag: "div",
            attributes: [["class", "space-y-8"]],
            children: [
              // Badge
              {
                tag: "div",
                attributes: [["class", "inline-flex items-center bg-white bg-opacity-20 backdrop-blur-sm rounded-full px-6 py-2 text-white text-sm font-medium border border-white border-opacity-30"]],

              },
              // Main heading
              {
                tag: "h1",
                attributes: [["class", "text-5xl md:text-7xl lg:text-8xl font-black text-white leading-tight"]],
                children: [
                  "Découvrez des ",
                  {
                    tag: "span",
                    attributes: [["class", "bg-gradient-to-r from-yellow-300 to-orange-400 bg-clip-text text-transparent"]],
                    children: ["événements"]
                  },
                  " extraordinaires"
                ]
              },
              // Subtitle
              {
                tag: "p",
                attributes: [["class", "text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto leading-relaxed"]],
                children: [
                  "Connectez-vous à votre communauté et vivez des expériences inoubliables. Plus de 10,000 événements vous attendent."
                ]
              },
              // CTA Buttons
              {
                tag: "div",
                attributes: [["class", "flex flex-col sm:flex-row gap-4 justify-center items-center pt-4"]],
                children: [
                  {
                    tag: "button",
                    attributes: [
                      ["class", "group bg-white text-black-600 font-bold py-4 px-8 rounded-2xl text-lg shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 hover:bg-yellow-50"],
                      ["onclick", "scrollToEvents()"]
                    ],
                    children: [
                      {
                        tag: "span",
                        attributes: [["class", "flex items-center"]],
                        children: [
                          "Explorer les événements",
                          {
                            tag: "svg",
                            attributes: [
                              ["class", "w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform"],
                              ["fill", "currentColor"],
                              ["viewBox", "0 0 20 20"]
                            ],
                            children: [
                              {
                                tag: "path",
                                attributes: [["d", "M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"]],
                                children: []
                              }
                            ]
                          }
                        ]
                      }
                    ]
                  },
                  {
                    tag: "button",
                    attributes: [
                      ["class", "group border-2 border-white text-white font-semibold py-4 px-8 rounded-2xl text-lg hover:bg-white hover:text-black transition-all duration-300"],
                      ["onclick", "scrollToCategories()"]
                    ],
                    children: [
                      {
                        tag: "span",
                        attributes: [["class", "flex items-center"]],
                        children: [
                          "Télécharger l'app",
                          {
                            tag: "svg",
                            attributes: [
                              ["class", "w-5 h-5 ml-2 group-hover:rotate-12 transition-transform"],
                              ["fill", "currentColor"],
                              ["viewBox", "0 0 20 20"]
                            ],
                            children: [
                              {
                                tag: "path",
                                attributes: [["d", "M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z"]],
                                children: []
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
          },
          // Stats quick preview
          {
            tag: "div",
            attributes: [["class", "mt-16 grid grid-cols-2 md:grid-cols-4 gap-8 text-white"]],
            children: [
              createStatItem("10K+", "Événements"),
              createStatItem("50K+", "Participants"),
              createStatItem("500+", "Villes"),
              createStatItem("98%", "Satisfaction")
            ]
          }
        ]
      },
      // Scroll indicator
      {
        tag: "div",
        attributes: [["class", "absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce"]],
        children: [
          {
            tag: "div",
            attributes: [["class", "w-6 h-10 border-2 border-white rounded-full flex justify-center"]],
            children: [
              {
                tag: "div",
                attributes: [["class", "w-1 h-3 bg-white rounded-full mt-2 animate-pulse"]],
                children: []
              }
            ]
          }
        ]
      }
    ]
  };
}

function createStatItem(number, label) {
  return {
    tag: "div",
    attributes: [["class", "text-center"]],
    children: [
      {
        tag: "div",
        attributes: [["class", "text-2xl md:text-3xl font-bold"]],
        children: [number]
      },
      {
        tag: "div",
        attributes: [["class", "text-blue-200 text-sm"]],
        children: [label]
      }
    ]
  };
}

// Section des fonctionnalités clés
function createFeaturesSection() {
  return {
    tag: "section",
    attributes: [["class", "py-20 bg-white relative"]],
    children: [
      {
        tag: "div",
        attributes: [["class", "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"]],
        children: [
          {
            tag: "div",
            attributes: [["class", "text-center mb-16"]],
            children: [
              {
                tag: "h2",
                attributes: [["class", "text-4xl md:text-5xl font-bold text-gray-900 mb-6"]],
                children: ["Pourquoi choisir Konect ?"]
              },
              {
                tag: "p",
                attributes: [["class", "text-xl text-gray-600 max-w-3xl mx-auto"]],
                children: ["Une plateforme complète pour découvrir, organiser et participer aux meilleurs événements de votre région."]
              }
            ]
          },
          {
            tag: "div",
            attributes: [["class", "grid grid-cols-1 md:grid-cols-3 gap-8"]],
            children: [
              createFeatureCard(
                "Découverte Intelligente",
                "Algorithme IA qui recommande des événements personnalisés selon vos goûts et votre localisation.",
                "from-blue-500 to-cyan-400"
              ),
              createFeatureCard(
                "Réservation Instantanée",
                "Réservez vos places en quelques clics avec paiement sécurisé et billets électroniques.",
                "from-purple-500 to-pink-400"
              ),
              createFeatureCard(
                "Communauté Active",
                "Connectez-vous avec d'autres passionnés et créez des liens durables autour de vos centres d'intérêt.",
                "from-orange-500 to-red-400"
              )
            ]
          }
        ]
      }
    ]
  };
}

function createFeatureCard(title, description, gradient) {
  return {
    tag: "div",
    attributes: [["class", "group relative bg-white p-8 rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-gray-100"]],
    children: [
      {
        tag: "div",
        attributes: [["class", `absolute inset-0 bg-gradient-to-br ${gradient} opacity-0 group-hover:opacity-10 rounded-3xl transition-opacity duration-500`]],
        children: []
      },
      {
        tag: "div",
        attributes: [["class", "relative z-10"]],
        children: [
          {
            tag: "h3",
            attributes: [["class", "text-2xl font-bold text-gray-900 mb-4 group-hover:text-blue-600 transition-colors"]],
            children: [title]
          },
          {
            tag: "p",
            attributes: [["class", "text-gray-600 leading-relaxed"]],
            children: [description]
          }
        ]
      }
    ]
  };
}

// Section des catégories d'événements
function createCategoriesSection() {
  return {
    tag: "section",
    attributes: [["class", "py-20 bg-gradient-to-br from-gray-50 to-blue-50"], ["id", "categories"]],
    children: [
      {
        tag: "div",
        attributes: [["class", "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"]],
        children: [
          {
            tag: "div",
            attributes: [["class", "text-center mb-16"]],
            children: [
              {
                tag: "h2",
                attributes: [["class", "text-4xl md:text-5xl font-bold text-gray-900 mb-6"]],
                children: ["Explorez par catégorie"]
              },
              {
                tag: "p",
                attributes: [["class", "text-xl text-gray-600 max-w-2xl mx-auto"]],
                children: ["Trouvez exactement ce que vous cherchez parmi notre large sélection d'événements."]
              }
            ]
          },
          {
            tag: "div",
            attributes: [["class", "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6"]],
            children: [
              createCategoryCard("🎵", "Musique", "music", "from-pink-500 to-red-500"),
              createCategoryCard("🎭", "Culture", "culture", "from-purple-500 to-indigo-500"),
              createCategoryCard("⚽", "Sport", "sport", "from-green-500 to-teal-500"),
              createCategoryCard("🎨", "Art", "art", "from-yellow-500 to-orange-500"),
              createCategoryCard("🍕", "Food", "food", "from-red-500 to-pink-500"),
              createCategoryCard("🎓", "Éducation", "education", "from-blue-500 to-cyan-500")
            ]
          }
        ]
      }
    ]
  };
}

function createCategoryCard(icon, title, category, gradient) {
  return {
    tag: "div",
    attributes: [
      ["class", "group cursor-pointer bg-white rounded-3xl p-6 text-center transition-all duration-500 hover:shadow-2xl hover:-translate-y-3 border border-gray-100"],
      ["onclick", `filterByCategory('${category}');scrollToEvents();`]
    ],
    children: [
      {
        tag: "div",
        attributes: [["class", `w-16 h-16 bg-gradient-to-br ${gradient} rounded-2xl flex items-center justify-center text-3xl mb-4 mx-auto group-hover:scale-110 group-hover:rotate-6 transition-all duration-300`]],
        children: [icon]
      },
      {
        tag: "h3",
        attributes: [["class", "font-bold text-gray-900 group-hover:text-blue-600 transition-colors text-lg"]],
        children: [title]
      },
      {
        tag: "div",
        attributes: [["class", "w-0 group-hover:w-full h-1 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto mt-3 transition-all duration-300 rounded-full"]],
        children: []
      }
    ]
  };
}

// Section showcase des événements
function createEventsShowcase() {
  return {
    tag: "section",
    attributes: [["class", "py-20 bg-white"], ["id", "events"]],
    children: [
      {
        tag: "div",
        attributes: [["class", "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"]],
        children: [
          {
            tag: "div",
            attributes: [["class", "text-center mb-16"]],
            children: [
              {
                tag: "h2",
                attributes: [["class", "text-4xl md:text-5xl font-bold text-gray-900 mb-6"]],
                children: ["Événements populaires"]
              },
              {
                tag: "p",
                attributes: [["class", "text-xl text-gray-600"]],
                children: ["Découvrez les événements les plus attendus du moment"]
              }
            ]
          },
          {
            tag: "div",
            attributes: [["class", "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"], ["id", "events-showcase"]],
            children: [
              createLoadingPlaceholder(),
              createLoadingPlaceholder(),
              createLoadingPlaceholder()
            ]
          },
          {
            tag: "div",
            attributes: [["class", "text-center mt-12"]],
            children: [
              {
                tag: "button",
                attributes: [
                  ["class", "group bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold py-4 px-8 rounded-2xl text-lg shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300"],
                  ["onclick", "window.location.hash = 'events'"]
                ],
                children: [
                  {
                    tag: "span",
                    attributes: [["class", "flex items-center justify-center"]],
                    children: [
                      "Voir tous les événements",
                      {
                        tag: "svg",
                        attributes: [
                          ["class", "w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform"],
                          ["fill", "currentColor"],
                          ["viewBox", "0 0 20 20"]
                        ],
                        children: [
                          {
                            tag: "path",
                            attributes: [["d", "M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"]],
                            children: []
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
      }
    ]
  };
}

function createLoadingPlaceholder() {
  return {
    tag: "div",
    attributes: [["class", "bg-white rounded-3xl shadow-lg overflow-hidden animate-pulse"]],
    children: [
      {
        tag: "div",
        attributes: [["class", "h-48 bg-gray-200"]],
        children: []
      },
      {
        tag: "div",
        attributes: [["class", "p-6"]],
        children: [
          {
            tag: "div",
            attributes: [["class", "h-4 bg-gray-200 rounded mb-4"]],
            children: []
          },
          {
            tag: "div",
            attributes: [["class", "h-3 bg-gray-200 rounded mb-2"]],
            children: []
          },
          {
            tag: "div",
            attributes: [["class", "h-3 bg-gray-200 rounded w-2/3"]],
            children: []
          }
        ]
      }
    ]
  };
}

function createBigStatItem(number, label, icon) {
  return {
    tag: "div",
    attributes: [["class", "text-center group"]],
    children: [
      {
        tag: "div",
        attributes: [["class", "text-4xl mb-4 group-hover:scale-110 transition-transform duration-300"]],
        children: [icon]
      },
      {
        tag: "div",
        attributes: [["class", "text-3xl md:text-4xl font-bold mb-2"]],
        children: [number]
      },
      {
        tag: "div",
        attributes: [["class", "text-blue-200"]],
        children: [label]
      }
    ]
  };
}

// Section CTA (Call to Action)
function createCtaSection() {
  return {
    tag: "section",
    attributes: [["class", "py-20 bg-gray-900 text-white relative overflow-hidden"]],
    children: [
      {
        tag: "div",
        attributes: [["class", "absolute inset-0"]],
        children: [
          {
            tag: "div",
            attributes: [["class", "absolute top-20 left-20 w-40 h-40 bg-blue-500 rounded-full opacity-20 blur-3xl"]],
            children: []
          },
          {
            tag: "div",
            attributes: [["class", "absolute bottom-20 right-20 w-60 h-60 bg-purple-500 rounded-full opacity-20 blur-3xl"]],
            children: []
          }
        ]
      },
      {
        tag: "div",
        attributes: [["class", "relative z-10 max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8"]],
        children: [
          {
            tag: "h2",
            attributes: [["class", "text-4xl md:text-6xl font-bold mb-6"]],
            children: ["Prêt à vivre l'expérience ?"]
          },
          {
            tag: "p",
            attributes: [["class", "text-xl md:text-2xl text-gray-300 mb-8 max-w-2xl mx-auto"]],
            children: ["Rejoignez notre communauté et découvrez des événements qui vous ressemblent."]
          },
          {
            tag: "div",
            attributes: [["class", "flex flex-col sm:flex-row gap-4 justify-center items-center"]],
            children: [
              {
                tag: "button",
                attributes: [
                  ["class", "bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-black font-bold py-4 px-8 rounded-2xl text-lg shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300"],
                  ["onclick", "window.location.hash = 'inscription'"]
                ],
                children: ["Commencer maintenant"]
              },
              {
                tag: "button",
                attributes: [
                  ["class", "border-2 border-white text-white hover:bg-white hover:text-gray-900 font-semibold py-4 px-8 rounded-2xl text-lg transition-all duration-300"],
                  ["onclick", "window.location.hash = 'events'"]
                ],
                children: ["Parcourir les événements"]
              }
            ]
          }
        ]
      }
    ]
  };
}

// Footer moderne
function createFooter() {
  return {
    tag: "footer",
    attributes: [["class", "bg-black text-white py-16"]],
    children: [
      {
        tag: "div",
        attributes: [["class", "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"]],
        children: [
          {
            tag: "div",
            attributes: [["class", "grid grid-cols-1 md:grid-cols-4 gap-8 mb-8"]],
            children: [
              {
                tag: "div",
                children: [
                  {
                    tag: "div",
                    attributes: [["class", "flex items-center mb-4"]],
                    children: [
                      {
                        tag: "div",
                        attributes: [["class", "w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center text-white font-bold text-xl mr-3"]],
                        children: ["K"]
                      },
                      {
                        tag: "span",
                        attributes: [["class", "text-2xl font-bold"]],
                        children: ["Konect"]
                      }
                    ]
                  },
                  {
                    tag: "p",
                    attributes: [["class", "text-gray-400 text-sm leading-relaxed"]],
                    children: ["Connectez-vous à votre communauté et découvrez des événements exceptionnels près de chez vous."]
                  }
                ]
              },
              createFooterColumn("Navigation", [
                { text: "Accueil", link: "#" },
                { text: "Événements", link: "#events" },
                { text: "Communautés", link: "#communities" },
                { text: "À propos", link: "#about" }
              ]),
              createFooterColumn("Support", [
                { text: "Centre d'aide", link: "#help" },
                { text: "Contact", link: "#contact" },
                { text: "FAQ", link: "#faq" },
                { text: "Politique de confidentialité", link: "#privacy" }
              ]),
              createFooterColumn("Suivez-nous", [
                { text: "Facebook", link: "#" },
                { text: "Twitter", link: "#" },
                { text: "Instagram", link: "#" },
                { text: "LinkedIn", link: "#" }
              ])
            ]
          },
          {
            tag: "div",
            attributes: [["class", "border-t border-gray-800 pt-8 text-center text-gray-400 text-sm"]],
            children: [`© ${new Date().getFullYear()} Konect. Tous droits réservés. Fait avec ❤️ en France.`]
          }
        ]
      }
    ]
  };
}

function createFooterColumn(title, links) {
  return {
    tag: "div",
    children: [
      {
        tag: "h3",
        attributes: [["class", "font-semibold mb-4 text-lg"]],
        children: [title]
      },
      {
        tag: "ul",
        attributes: [["class", "space-y-2"]],
        children: links.map(link => ({
          tag: "li",
          children: [
            {
              tag: "a",
              attributes: [
                ["href", link.link],
                ["class", "text-gray-400 hover:text-white transition-colors duration-200 text-sm"]
              ],
              children: [link.text]
            }
          ]
        }))
      }
    ]
  };
}

// Fonctions utilitaires
let allEvents = [];
let allCommunities = [];

async function loadEvents() {
  try {
    const result = await database.getEvents();
    allEvents = result.data || [];
    updateEventsShowcase(allEvents.slice(0, 6));
  } catch (error) {
    console.error('Erreur lors du chargement des événements:', error);
  }
}

async function loadCommunities() {
  try {
    const result = await database.getCommunities();
    allCommunities = result.data || [];
  } catch (error) {
    console.error('Erreur lors du chargement des communautés:', error);
  }
}

function updateEventsShowcase(events) {
  const showcase = document.getElementById('events-showcase');
  if (!showcase) return;

  if (events.length === 0) {
    showcase.innerHTML = '<div class="col-span-full text-center text-gray-500 py-12">Aucun événement disponible</div>';
    return;
  }

  const eventsHTML = events.map(event => createEventCardHTML(event)).join('');
  showcase.innerHTML = eventsHTML;
}

function createEventCardHTML(event) {
  const eventDate = new Date(event.date);
  const day = eventDate.getDate().toString().padStart(2, '0');
  const month = eventDate.toLocaleDateString('fr-FR', { month: 'short' });
  const time = eventDate.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });

  const price = event.price ? `${event.price}€` : 'Gratuit';
  const category = event.category || 'Événement';

  return `
    <div class="group cursor-pointer bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 overflow-hidden border border-gray-100" onclick="goToEventDetail('${event.id}')">
      <div class="relative h-48 overflow-hidden">
        <img 
          class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
          src="${event.image_url || 'images/event_1.jpg'}"
          alt="${event.title}"
          onerror="this.src='images/event_1.jpg'"
        />
        <div class="absolute top-4 left-4 bg-white rounded-xl px-3 py-2 shadow-lg">
          <div class="text-center">
            <div class="text-xl font-bold text-gray-900">${day}</div>
            <div class="text-xs text-gray-600 uppercase">${month}</div>
          </div>
        </div>
        <div class="absolute top-4 right-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white px-3 py-1 rounded-full text-xs font-bold">
          ${category}
        </div>
      </div>
      
      <div class="p-6">
        <h3 class="text-xl font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-blue-600 transition-colors">
          ${event.title}
        </h3>
        
        <div class="flex items-center text-sm text-gray-600 mb-4">
          <svg class="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
          </svg>
          <span class="truncate">${event.location || 'Lieu à définir'}</span>
        </div>
        
        <div class="flex items-center justify-between">
          <div class="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">${price}</div>
          <button class="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-2 rounded-xl font-medium transition-all duration-300 transform hover:scale-105">
            Voir détails
          </button>
        </div>
      </div>
    </div>
  `;
}

// Fonctions de navigation
function goToEventDetail(eventId) {
  window.location.hash = `event-detail?id=${eventId}`;
}

function filterByCategory(category) {
  window.location.hash = `events?category=${category}`;
}

function scrollToEvents() {
  const eventsSection = document.getElementById('events');
  if (eventsSection) {
    eventsSection.scrollIntoView({ behavior: 'smooth' });
  }
}

function scrollToCategories() {
  const categoriesSection = document.getElementById('categories');
  if (categoriesSection) {
    categoriesSection.scrollIntoView({ behavior: 'smooth' });
  }
}

// Exports globaux
window.loadEvents = loadEvents;
window.loadCommunities = loadCommunities;
window.goToEventDetail = goToEventDetail;
window.filterByCategory = filterByCategory;
window.scrollToEvents = scrollToEvents;
window.scrollToCategories = scrollToCategories;
