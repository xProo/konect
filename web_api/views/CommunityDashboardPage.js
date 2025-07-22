import { auth, database, storage } from "../lib/supabase.js";
import { BrowserLink } from "../components/BrowserRouter.js";
import { createCommonNavbar, updateCommonUserDisplay, handleCommonLogout } from "../components/CommonNavbar.js";

export default function CommunityDashboardPage() {
  // Récupérer l'ID de la communauté depuis les paramètres de l'URL
  const urlParams = new URLSearchParams(window.location.search);
  const communityId = urlParams.get('id');

  // Initialiser la page après le rendu
  setTimeout(async () => {
    await loadDashboard(communityId);
    await updateCommonUserDisplay();
    
    // Écouter les changements d'authentification
    auth.onAuthStateChange((event, session) => {
      if (session) {
        loadDashboard(communityId);
      } else {
        window.history.pushState({}, '', '/connexion');
        const popStateEvent = new PopStateEvent('popstate', { state: {} });
        window.dispatchEvent(popStateEvent);
      }
      updateCommonUserDisplay();
    });
  }, 100);

  return {
    tag: "div",
    children: [
      createCommonNavbar(),
      
      // Hero Section avec breadcrumb
      {
        tag: "div",
        attributes: [["style", { 
          background: "linear-gradient(135deg, #6c757d 0%, #f4a261 100%)", 
          padding: "60px 20px 40px", 
          color: "white" 
        }]],
        children: [
          {
            tag: "div",
            attributes: [["style", { maxWidth: "1200px", margin: "0 auto" }]],
            children: [
              // Breadcrumb
              {
                tag: "nav",
                attributes: [["style", { marginBottom: "30px" }]],
                children: [
                  {
                    tag: "div",
                    attributes: [["style", { 
                      display: "flex", 
                      alignItems: "center", 
                      gap: "8px", 
                      fontSize: "14px", 
                      opacity: "0.9" 
                    }]],
                    children: [
                      BrowserLink({ 
                        link: "/", 
                        title: "Accueil",
                        style: "color: white; text-decoration: none;"
                      }),
                      {
                        tag: "span",
                        children: ["/"]
                      },
                      BrowserLink({ 
                        link: "/communities", 
                        title: "Mes Communautés",
                        style: "color: white; text-decoration: none;"
                      }),
                      {
                        tag: "span",
                        children: ["/"]
                      },
                      {
                        tag: "span",
                        attributes: [["style", { fontWeight: "500" }]],
                        children: ["Dashboard"]
                      }
                    ]
                  }
                ]
              },

              // Titre et informations de base
              {
                tag: "div",
                attributes: [["id", "community-header"]],
                children: [
                  {
                    tag: "h1",
                    attributes: [["style", { 
                      fontSize: "2.5rem", 
                      fontWeight: "300", 
                      margin: "0 0 15px 0",
                      letterSpacing: "-1px"
                    }]],
                    children: ["Dashboard Communauté"]
                  },
                  {
                    tag: "div",
                    attributes: [["style", { 
                      fontSize: "1.1rem", 
                      opacity: "0.9",
                      fontWeight: "300"
                    }]],
                    children: ["Chargement des informations..."]
                  }
                ]
              }
            ]
          }
        ]
      },

      // Main Content
      {
        tag: "div",
        attributes: [["style", { 
          backgroundColor: "#f8f9fa",
          minHeight: "100vh",
          paddingBottom: "40px"
        }]],
        children: [
          {
            tag: "div",
            attributes: [["style", { 
              maxWidth: "1200px", 
              margin: "0 auto", 
              padding: "40px 20px" 
            }]],
            children: [
              // Messages
              {
                tag: "div",
                attributes: [["id", "message"], ["style", { 
                  padding: "15px", 
                  marginBottom: "30px", 
                  borderRadius: "8px", 
                  display: "none",
                  fontSize: "14px",
                  fontWeight: "500"
                }]],
                children: []
              },

              // Statistiques principales en cards
              {
                tag: "div",
                attributes: [["style", { 
                  display: "grid", 
                  gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", 
                  gap: "25px", 
                  marginBottom: "40px" 
                }]],
                children: [
                  // Carte Membres
                  {
                    tag: "div",
                    attributes: [["style", { 
                      backgroundColor: "white", 
                      padding: "30px", 
                      borderRadius: "12px", 
                      boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
                      border: "1px solid #e9ecef",
                      borderLeft: "4px solid #f4a261"
                    }]],
                    children: [
                      {
                        tag: "div",
                        attributes: [["style", { 
                          display: "flex", 
                          alignItems: "center", 
                          justifyContent: "space-between", 
                          marginBottom: "20px" 
                        }]],
                        children: [
                          {
                            tag: "div",
                            children: [
                              {
                                tag: "h3",
                                attributes: [["style", { 
                                  margin: "0 0 5px 0", 
                                  color: "#2c3e50", 
                                  fontSize: "1.1rem",
                                  fontWeight: "600"
                                }]],
                                children: ["Membres"]
                              },
                              {
                                tag: "div",
                                attributes: [["id", "members-count"], ["style", { 
                                  fontSize: "2rem", 
                                  fontWeight: "700", 
                                  color: "#f4a261" 
                                }]],
                                children: ["..."]
                              }
                            ]
                          },
                          {
                            tag: "div",
                            attributes: [["style", { 
                              width: "50px", 
                              height: "50px", 
                              borderRadius: "50%", 
                              backgroundColor: "#f4a261", 
                              display: "flex", 
                              alignItems: "center", 
                              justifyContent: "center",
                              opacity: "0.1"
                            }]],
                            children: [
                              {
                                tag: "svg",
                                attributes: [
                                  ["width", "24"],
                                  ["height", "24"],
                                  ["fill", "#f4a261"],
                                  ["viewBox", "0 0 24 24"]
                                ],
                                children: [
                                  {
                                    tag: "path",
                                    attributes: [["d", "M16 4c0-1.11.89-2 2-2s2 .89 2 2-.89 2-2 2-2-.89-2-2zM4 18v-4h3v4h2v-7.5c0-.83-.67-1.5-1.5-1.5S6 9.67 6 10.5V11H4c-.83 0-1.5.67-1.5 1.5v5c0 .83.67 1.5 1.5 1.5z"]]
                                  }
                                ]
                              }
                            ]
                          }
                        ]
                      }
                    ]
                  },

                  // Carte Événements
                  {
                    tag: "div",
                    attributes: [["style", { 
                      backgroundColor: "white", 
                      padding: "30px", 
                      borderRadius: "12px", 
                      boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
                      border: "1px solid #e9ecef",
                      borderLeft: "4px solid #6c757d"
                    }]],
                    children: [
                      {
                        tag: "div",
                        attributes: [["style", { 
                          display: "flex", 
                          alignItems: "center", 
                          justifyContent: "space-between", 
                          marginBottom: "20px" 
                        }]],
                        children: [
                          {
                            tag: "div",
                            children: [
                              {
                                tag: "h3",
                                attributes: [["style", { 
                                  margin: "0 0 5px 0", 
                                  color: "#2c3e50", 
                                  fontSize: "1.1rem",
                                  fontWeight: "600"
                                }]],
                                children: ["Événements"]
                              },
                              {
                                tag: "div",
                                attributes: [["id", "events-count"], ["style", { 
                                  fontSize: "2rem", 
                                  fontWeight: "700", 
                                  color: "#6c757d" 
                                }]],
                                children: ["..."]
                              }
                            ]
                          },
                          {
                            tag: "div",
                            attributes: [["style", { 
                              width: "50px", 
                              height: "50px", 
                              borderRadius: "50%", 
                              backgroundColor: "#6c757d", 
                              display: "flex", 
                              alignItems: "center", 
                              justifyContent: "center",
                              opacity: "0.1"
                            }]],
                            children: [
                              {
                                tag: "svg",
                                attributes: [
                                  ["width", "24"],
                                  ["height", "24"],
                                  ["fill", "#6c757d"],
                                  ["viewBox", "0 0 24 24"]
                                ],
                                children: [
                                  {
                                    tag: "path",
                                    attributes: [["d", "M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM7 10h5v5H7z"]]
                                  }
                                ]
                              }
                            ]
                          }
                        ]
                      }
                    ]
                  },

                  // Carte Statut
                  {
                    tag: "div",
                    attributes: [["style", { 
                      backgroundColor: "white", 
                      padding: "30px", 
                      borderRadius: "12px", 
                      boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
                      border: "1px solid #e9ecef",
                      borderLeft: "4px solid #28a745"
                    }]],
                    children: [
                      {
                        tag: "div",
                        attributes: [["style", { 
                          display: "flex", 
                          alignItems: "center", 
                          justifyContent: "space-between", 
                          marginBottom: "20px" 
                        }]],
                        children: [
                          {
                            tag: "div",
                            children: [
                              {
                                tag: "h3",
                                attributes: [["style", { 
                                  margin: "0 0 5px 0", 
                                  color: "#2c3e50", 
                                  fontSize: "1.1rem",
                                  fontWeight: "600"
                                }]],
                                children: ["Statut"]
                              },
                              {
                                tag: "div",
                                attributes: [["style", { 
                                  fontSize: "1.1rem", 
                                  fontWeight: "600", 
                                  color: "#28a745" 
                                }]],
                                children: ["Active"]
                              }
                            ]
                          },
                          {
                            tag: "div",
                            attributes: [["style", { 
                              width: "50px", 
                              height: "50px", 
                              borderRadius: "50%", 
                              backgroundColor: "#28a745", 
                              display: "flex", 
                              alignItems: "center", 
                              justifyContent: "center",
                              opacity: "0.1"
                            }]],
                            children: [
                              {
                                tag: "svg",
                                attributes: [
                                  ["width", "24"],
                                  ["height", "24"],
                                  ["fill", "#28a745"],
                                  ["viewBox", "0 0 24 24"]
                                ],
                                children: [
                                  {
                                    tag: "path",
                                    attributes: [["d", "M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z"]]
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

              // Section Actions rapides
              {
                tag: "div",
                attributes: [["style", { marginBottom: "40px" }]],
                children: [
                  {
                    tag: "div",
                    attributes: [["style", { 
                      backgroundColor: "white", 
                      padding: "30px", 
                      borderRadius: "12px", 
                      boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
                      border: "1px solid #e9ecef"
                    }]],
                    children: [
                      {
                        tag: "h2",
                        attributes: [["style", { 
                          color: "#2c3e50", 
                          marginBottom: "25px", 
                          fontSize: "1.5rem",
                          fontWeight: "600",
                          borderBottom: "2px solid #f4a261", 
                          paddingBottom: "10px",
                          display: "inline-block"
                        }]],
                        children: ["Actions rapides"]
                      },
                      
                      {
                        tag: "div",
                        attributes: [["style", { 
                          display: "grid", 
                          gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", 
                          gap: "20px" 
                        }]],
                        children: [
                          {
                            tag: "button",
                            attributes: [
                              ["onclick", "createCommunityEvent()"],
                              ["style", { 
                                padding: "20px", 
                                backgroundColor: "#f4a261", 
                                color: "white", 
                                border: "none", 
                                borderRadius: "10px", 
                                cursor: "pointer",
                                fontWeight: "600",
                                fontSize: "16px",
                                display: "flex",
                                alignItems: "center",
                                gap: "12px",
                                transition: "transform 0.2s ease, box-shadow 0.2s ease"
                              }]
                            ],
                            children: [
                              {
                                tag: "svg",
                                attributes: [
                                  ["width", "20"],
                                  ["height", "20"],
                                  ["fill", "white"],
                                  ["viewBox", "0 0 24 24"]
                                ],
                                children: [
                                  {
                                    tag: "path",
                                    attributes: [["d", "M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM7 10h5v5H7z"]]
                                  }
                                ]
                              },
                              "Créer un événement"
                            ]
                          },
                          {
                            tag: "button",
                            attributes: [
                              ["onclick", "inviteMembers()"],
                              ["style", { 
                                padding: "20px", 
                                backgroundColor: "#6c757d", 
                                color: "white", 
                                border: "none", 
                                borderRadius: "10px", 
                                cursor: "pointer",
                                fontWeight: "600",
                                fontSize: "16px",
                                display: "flex",
                                alignItems: "center",
                                gap: "12px",
                                transition: "transform 0.2s ease, box-shadow 0.2s ease"
                              }]
                            ],
                            children: [
                              {
                                tag: "svg",
                                attributes: [
                                  ["width", "20"],
                                  ["height", "20"],
                                  ["fill", "white"],
                                  ["viewBox", "0 0 24 24"]
                                ],
                                children: [
                                  {
                                    tag: "path",
                                    attributes: [["d", "M15 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm-9-2V7H4v3H1v2h3v3h2v-3h3v-2H6zm9 4c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"]]
                                  }
                                ]
                              },
                              "Inviter des membres"
                            ]
                          },
                          {
                            tag: "button",
                            attributes: [
                              ["onclick", "editCommunity()"],
                              ["style", { 
                                padding: "20px", 
                                backgroundColor: "#495057", 
                                color: "white", 
                                border: "none", 
                                borderRadius: "10px", 
                                cursor: "pointer",
                                fontWeight: "600",
                                fontSize: "16px",
                                display: "flex",
                                alignItems: "center",
                                gap: "12px",
                                transition: "transform 0.2s ease, box-shadow 0.2s ease"
                              }]
                            ],
                            children: [
                              {
                                tag: "svg",
                                attributes: [
                                  ["width", "20"],
                                  ["height", "20"],
                                  ["fill", "white"],
                                  ["viewBox", "0 0 24 24"]
                                ],
                                children: [
                                  {
                                    tag: "path",
                                    attributes: [["d", "M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"]]
                                  }
                                ]
                              },
                              "Modifier la communauté"
                            ]
                          },
                          {
                            tag: "button",
                            attributes: [
                              ["onclick", "viewPublicPage()"],
                              ["style", { 
                                padding: "20px", 
                                backgroundColor: "#e76f51", 
                                color: "white", 
                                border: "none", 
                                borderRadius: "10px", 
                                cursor: "pointer",
                                fontWeight: "600",
                                fontSize: "16px",
                                display: "flex",
                                alignItems: "center",
                                gap: "12px",
                                transition: "transform 0.2s ease, box-shadow 0.2s ease"
                              }]
                            ],
                            children: [
                              {
                                tag: "svg",
                                attributes: [
                                  ["width", "20"],
                                  ["height", "20"],
                                  ["fill", "white"],
                                  ["viewBox", "0 0 24 24"]
                                ],
                                children: [
                                  {
                                    tag: "path",
                                    attributes: [["d", "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"]]
                                  }
                                ]
                              },
                              "Voir page publique"
                            ]
                          }
                        ]
                      }
                    ]
                  }
                ]
              },

              // Section Membres
              {
                tag: "div",
                attributes: [["style", { marginBottom: "40px" }]],
                children: [
                  {
                    tag: "div",
                    attributes: [["style", { 
                      backgroundColor: "white", 
                      padding: "30px", 
                      borderRadius: "12px", 
                      boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
                      border: "1px solid #e9ecef"
                    }]],
                    children: [
                      {
                        tag: "h2",
                        attributes: [["style", { 
                          color: "#2c3e50", 
                          marginBottom: "25px", 
                          fontSize: "1.5rem",
                          fontWeight: "600",
                          borderBottom: "2px solid #f4a261", 
                          paddingBottom: "10px",
                          display: "inline-block"
                        }]],
                        children: ["Gestion des membres"]
                      },

                      {
                        tag: "div",
                        attributes: [["id", "members-list"], ["style", { minHeight: "200px" }]],
                        children: [
                          {
                            tag: "div",
                            attributes: [["style", { 
                              textAlign: "center", 
                              padding: "50px", 
                              color: "#6c757d" 
                            }]],
                            children: ["Chargement des membres..."]
                          }
                        ]
                      }
                    ]
                  }
                ]
              },

              // Section Événements
              {
                tag: "div",
                children: [
                  {
                    tag: "div",
                    attributes: [["style", { 
                      backgroundColor: "white", 
                      padding: "30px", 
                      borderRadius: "12px", 
                      boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
                      border: "1px solid #e9ecef"
                    }]],
                    children: [
                      {
                        tag: "h2",
                        attributes: [["style", { 
                          color: "#2c3e50", 
                          marginBottom: "25px", 
                          fontSize: "1.5rem",
                          fontWeight: "600",
                          borderBottom: "2px solid #6c757d", 
                          paddingBottom: "10px",
                          display: "inline-block"
                        }]],
                        children: ["Événements de la communauté"]
                      },

                      {
                        tag: "div",
                        attributes: [["id", "events-list"], ["style", { minHeight: "200px" }]],
                        children: [
                          {
                            tag: "div",
                            attributes: [["style", { 
                              textAlign: "center", 
                              padding: "50px", 
                              color: "#6c757d" 
                            }]],
                            children: ["Chargement des événements..."]
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

// === FONCTIONS ===

async function loadDashboard(communityId) {
  try {
    const { data: { user } } = await auth.getCurrentUser();
    
    if (!user) {
      showMessage('Vous devez être connecté pour accéder au dashboard', 'error');
      return;
    }

    // Charger les informations de la communauté
    const { data: communities, error: communityError } = await database.getUserCommunities(user.id);
    
    if (communityError) {
      showMessage(`Erreur lors du chargement de la communauté : ${communityError.message}`, 'error');
      return;
    }

    const community = communities?.find(c => c.id === communityId);
    
    if (!community) {
      showMessage('Communauté non trouvée ou vous n\'êtes pas le référent', 'error');
      return;
    }

    // Mettre à jour le header
    updateCommunityHeader(community);

    // Charger les statistiques
    await loadStatistics(communityId);

    // Charger les membres
    await loadMembers(communityId);

    // Charger les événements
    await loadEvents(communityId);

  } catch (error) {
    showMessage(`Erreur inattendue : ${error.message}`, 'error');
  }
}

function updateCommunityHeader(community) {
  const header = document.getElementById('community-header');
  header.innerHTML = `
    <h1 style="font-size: 2.5rem; font-weight: 300; margin: 0 0 15px 0; letter-spacing: -1px;">
      Dashboard - ${community.name}
    </h1>
    <div style="font-size: 1.1rem; opacity: 0.9; font-weight: 300; line-height: 1.5;">
      <div style="display: inline-flex; align-items: center; gap: 15px; flex-wrap: wrap;">
        <span style="background: rgba(255,255,255,0.2); padding: 6px 12px; border-radius: 20px; font-size: 0.9rem; backdrop-filter: blur(10px);">
          ${community.category || 'Général'}
        </span>
        <span style="display: flex; align-items: center; gap: 5px;">
          <svg width="16" height="16" fill="white" viewBox="0 0 24 24">
            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
          </svg>
          ${community.location || 'Non spécifié'}
        </span>
      </div>
      <div style="margin-top: 15px; font-style: italic; opacity: 0.8;">
        ${community.description || ''}
      </div>
    </div>
  `;
}

async function loadStatistics(communityId) {
  try {
    const { data: stats, error } = await database.getCommunityStats(communityId);
    
    if (error) {
      showMessage(`Erreur lors du chargement des statistiques : ${error.message}`, 'error');
      return;
    }

    document.getElementById('members-count').textContent = stats.members_count || 0;
    document.getElementById('events-count').textContent = stats.events_count || 0;

  } catch (error) {
    showMessage(`Erreur lors du chargement des statistiques : ${error.message}`, 'error');
  }
}

async function loadMembers(communityId) {
  try {
    const { data: members, error } = await database.getCommunityMembers(communityId);
    
    if (error) {
      showMessage(`Erreur lors du chargement des membres : ${error.message}`, 'error');
      return;
    }

    displayMembers(members || []);

  } catch (error) {
    showMessage(`Erreur lors du chargement des membres : ${error.message}`, 'error');
  }
}

function displayMembers(members) {
  const container = document.getElementById('members-list');
  
  if (members.length === 0) {
    container.innerHTML = `
      <div style="text-align: center; padding: 60px 20px; color: #6c757d;">
        <div style="width: 80px; height: 80px; margin: 0 auto 20px; background: #f8f9fa; border-radius: 50%; display: flex; align-items: center; justify-content: center;">
          <svg width="32" height="32" fill="#6c757d" viewBox="0 0 24 24">
            <path d="M16 4c0-1.11.89-2 2-2s2 .89 2 2-.89 2-2 2-2-.89-2-2zM4 18v-4h3v4h2v-7.5c0-.83-.67-1.5-1.5-1.5S6 9.67 6 10.5V11H4c-.83 0-1.5.67-1.5 1.5v5c0 .83.67 1.5 1.5 1.5z"/>
          </svg>
        </div>
        <h3 style="color: #2c3e50; margin-bottom: 10px; font-weight: 600;">Aucun membre</h3>
        <p style="margin: 0;">Invitez des personnes à rejoindre votre communauté</p>
      </div>
    `;
    return;
  }

  container.innerHTML = `
    <div style="display: grid; gap: 15px;">
      ${members.map(member => `
        <div style="display: flex; justify-content: space-between; align-items: center; padding: 20px; border: 1px solid #e9ecef; border-radius: 10px; background: #f8f9fa; transition: box-shadow 0.2s ease;">
          <div style="display: flex; align-items: center; gap: 15px;">
            <div style="width: 50px; height: 50px; border-radius: 50%; background: linear-gradient(135deg, #f4a261 0%, #e76f51 100%); display: flex; align-items: center; justify-content: center; color: white; font-weight: 600; font-size: 1.2rem;">
              ${(member.user_profiles?.full_name || member.user_profiles?.email || 'U').charAt(0).toUpperCase()}
            </div>
            <div>
              <div style="font-weight: 600; color: #2c3e50; font-size: 1.1rem; margin-bottom: 5px;">
                ${member.user_profiles?.full_name || member.user_profiles?.email || 'Utilisateur'}
              </div>
              <div style="color: #6c757d; font-size: 14px; margin-bottom: 3px;">
                ${member.user_profiles?.email || 'Email non disponible'}
              </div>
              <div style="color: #adb5bd; font-size: 12px;">
                Membre depuis le ${new Date(member.joined_at).toLocaleDateString('fr-FR')}
              </div>
            </div>
          </div>
          <button onclick="removeMember('${member.user_id}')" style="padding: 10px 15px; background: #dc3545; color: white; border: none; border-radius: 8px; cursor: pointer; font-size: 14px; font-weight: 500; display: flex; align-items: center; gap: 8px;">
            <svg width="16" height="16" fill="white" viewBox="0 0 24 24">
              <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/>
            </svg>
            Retirer
          </button>
        </div>
      `).join('')}
    </div>
  `;
}

async function loadEvents(communityId) {
  try {
    const { data: events, error } = await database.getCommunityEvents(communityId);
    
    if (error) {
      showMessage(`Erreur lors du chargement des événements : ${error.message}`, 'error');
      return;
    }

    displayEvents(events || []);

  } catch (error) {
    showMessage(`Erreur lors du chargement des événements : ${error.message}`, 'error');
  }
}

async function displayEvents(events) {
  const container = document.getElementById('events-list');
  
  if (events.length === 0) {
    container.innerHTML = `
      <div style="text-align: center; padding: 60px 20px; color: #6c757d;">
        <div style="width: 80px; height: 80px; margin: 0 auto 20px; background: #f8f9fa; border-radius: 50%; display: flex; align-items: center; justify-content: center;">
          <svg width="32" height="32" fill="#6c757d" viewBox="0 0 24 24">
            <path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM7 10h5v5H7z"/>
          </svg>
        </div>
        <h3 style="color: #2c3e50; margin-bottom: 10px; font-weight: 600;">Aucun événement créé</h3>
        <p style="margin: 0;">Commencez par créer votre premier événement</p>
      </div>
    `;
    return;
  }

  // Récupérer les statistiques de chaque événement
  const eventsWithStats = await Promise.all(
    events.map(async (event) => {
      try {
        const { data: participants } = await database.getEventParticipants(event.id);
        return { ...event, participantCount: participants?.length || 0 };
      } catch (error) {
        return { ...event, participantCount: 0 };
      }
    })
  );

  container.innerHTML = `
    <div style="display: grid; gap: 20px;">
      ${eventsWithStats.map(event => `
        <div style="border: 1px solid #e9ecef; border-radius: 12px; padding: 25px; background: #f8f9fa; border-left: 4px solid #f4a261;">
          <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 20px;">
            <div style="flex: 1;">
              <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 15px;">
                <div style="width: 40px; height: 40px; border-radius: 50%; background: linear-gradient(135deg, #f4a261 0%, #e76f51 100%); display: flex; align-items: center; justify-content: center;">
                  <svg width="20" height="20" fill="white" viewBox="0 0 24 24">
                    <path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM7 10h5v5H7z"/>
                  </svg>
                </div>
                <h3 style="margin: 0; color: #2c3e50; font-size: 1.3rem; font-weight: 600;">
                  ${event.title || 'Événement sans titre'}
                </h3>
              </div>
              <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px; margin-bottom: 15px;">
                <div style="display: flex; align-items: center; gap: 8px; color: #6c757d;">
                  <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM7 10h5v5H7z"/>
                  </svg>
                  <span>${event.date ? new Date(event.date).toLocaleDateString('fr-FR') : 'Date non définie'}</span>
                </div>
                <div style="display: flex; align-items: center; gap: 8px; color: #6c757d;">
                  <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                  </svg>
                  <span>${event.location || 'Lieu non défini'}</span>
                </div>
                <div style="display: flex; align-items: center; gap: 8px; color: #f4a261; font-weight: 600;">
                  <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M16 4c0-1.11.89-2 2-2s2 .89 2 2-.89 2-2 2-2-.89-2-2zM4 18v-4h3v4h2v-7.5c0-.83-.67-1.5-1.5-1.5S6 9.67 6 10.5V11H4c-.83 0-1.5.67-1.5 1.5v5c0 .83.67 1.5 1.5 1.5z"/>
                  </svg>
                  <span>${event.participantCount} participant${event.participantCount > 1 ? 's' : ''}</span>
                </div>
              </div>
            </div>
            <div style="display: flex; flex-direction: column; gap: 10px;">
              <div style="display: flex; gap: 10px;">
                <button onclick="editEvent('${event.id}')" style="padding: 10px 15px; background: #f4a261; color: white; border: none; border-radius: 8px; cursor: pointer; font-weight: 500; display: flex; align-items: center; gap: 8px;">
                  <svg width="16" height="16" fill="white" viewBox="0 0 24 24">
                    <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/>
                  </svg>
                  Modifier
                </button>
                <button onclick="deleteEvent('${event.id}')" style="padding: 10px 15px; background: #dc3545; color: white; border: none; border-radius: 8px; cursor: pointer; font-weight: 500; display: flex; align-items: center; gap: 8px;">
                  <svg width="16" height="16" fill="white" viewBox="0 0 24 24">
                    <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/>
                  </svg>
                  Supprimer
                </button>
              </div>
              <button onclick="viewEventParticipants('${event.id}')" style="padding: 10px 15px; background: #6c757d; color: white; border: none; border-radius: 8px; cursor: pointer; font-weight: 500; font-size: 14px; display: flex; align-items: center; gap: 8px;">
                <svg width="16" height="16" fill="white" viewBox="0 0 24 24">
                  <path d="M16 4c0-1.11.89-2 2-2s2 .89 2 2-.89 2-2 2-2-.89-2-2zM4 18v-4h3v4h2v-7.5c0-.83-.67-1.5-1.5-1.5S6 9.67 6 10.5V11H4c-.83 0-1.5.67-1.5 1.5v5c0 .83.67 1.5 1.5 1.5z"/>
                </svg>
                Voir participants
              </button>
            </div>
          </div>
          <p style="margin: 0; color: #6c757d; line-height: 1.5; font-style: italic;">
            ${event.description || 'Aucune description'}
          </p>
        </div>
      `).join('')}
    </div>
  `;
}

// Actions rapides
function createCommunityEvent() {
  const urlParams = new URLSearchParams(window.location.search);
  const communityId = urlParams.get('id');
  
  if (!communityId) {
    showMessage('Erreur : ID de communauté manquant', 'error');
    return;
  }
  
  showEventForm(communityId);
}

function inviteMembers() {
  showMessage('Fonctionnalité d\'invitation de membres à venir...', 'info');
}

function editCommunity() {
  showMessage('Fonctionnalité d\'édition de communauté à venir...', 'info');
}

function viewPublicPage() {
  showMessage('Fonctionnalité de page publique à venir...', 'info');
}

async function editEvent(eventId) {
  try {
    // Récupérer les détails de l'événement
    const { data: events, error } = await database.getCommunityEvents(
      new URLSearchParams(window.location.search).get('id')
    );
    
    if (error) {
      showMessage(`Erreur lors du chargement de l'événement : ${error.message}`, 'error');
      return;
    }
    
    const event = events?.find(e => e.id === eventId);
    if (!event) {
      showMessage('Événement non trouvé', 'error');
      return;
    }
    
    showEventForm(event.community_id, event);
    
  } catch (error) {
    showMessage(`Erreur inattendue : ${error.message}`, 'error');
  }
}

async function deleteEvent(eventId) {
  if (!confirm('Êtes-vous sûr de vouloir supprimer cet événement ? Cette action est irréversible.')) {
    return;
  }

  try {
    const { error } = await database.deleteEvent(eventId);
    
    if (error) {
      showMessage(`Erreur lors de la suppression : ${error.message}`, 'error');
    } else {
      showMessage('Événement supprimé avec succès', 'success');
      // Recharger la liste des événements
      const urlParams = new URLSearchParams(window.location.search);
      const communityId = urlParams.get('id');
      await loadEvents(communityId);
      await loadStatistics(communityId);
    }
  } catch (error) {
    showMessage(`Erreur inattendue : ${error.message}`, 'error');
  }
}

async function removeMember(userId) {
  if (!confirm('Êtes-vous sûr de vouloir retirer ce membre de la communauté ?')) {
    return;
  }

  // Récupérer l'ID de la communauté depuis les paramètres de l'URL
  const urlParams = new URLSearchParams(window.location.search);
  const communityId = urlParams.get('id');

  try {
    const { error } = await database.leaveCommunity(userId, communityId);
    
    if (error) {
      showMessage(`Erreur lors du retrait du membre : ${error.message}`, 'error');
    } else {
      showMessage('Membre retiré avec succès', 'success');
      await loadMembers(communityId);
      await loadStatistics(communityId);
    }
  } catch (error) {
    showMessage(`Erreur inattendue : ${error.message}`, 'error');
  }
}

function showMessage(message, type) {
  const messageDiv = document.getElementById('message');
  messageDiv.textContent = message;
  messageDiv.style.display = 'block';
  
  if (type === 'success') {
    messageDiv.style.backgroundColor = '#d4edda';
    messageDiv.style.color = '#155724';
    messageDiv.style.border = '1px solid #c3e6cb';
  } else if (type === 'error') {
    messageDiv.style.backgroundColor = '#f8d7da';
    messageDiv.style.color = '#721c24';
    messageDiv.style.border = '1px solid #f5c6cb';
  } else if (type === 'info') {
    messageDiv.style.backgroundColor = '#d1ecf1';
    messageDiv.style.color = '#0c5460';
    messageDiv.style.border = '1px solid #bee5eb';
  }
  
  setTimeout(() => {
    messageDiv.style.display = 'none';
  }, 5000);
}

// === GESTION DES ÉVÉNEMENTS ===

function showEventForm(communityId, eventToEdit = null) {
  const isEdit = !!eventToEdit;
  const modalId = 'event-modal';
  
  // Supprimer le modal existant s'il y en a un
  const existingModal = document.getElementById(modalId);
  if (existingModal) {
    existingModal.remove();
  }
  
  const modal = document.createElement('div');
  modal.id = modalId;
  modal.style.cssText = `
    position: fixed; top: 0; left: 0; width: 100%; height: 100%; 
    background: rgba(0,0,0,0.5); display: flex; justify-content: center; 
    align-items: center; z-index: 1000; backdrop-filter: blur(5px);
  `;
  
  modal.innerHTML = `
    <div style="background: white; padding: 40px; border-radius: 12px; width: 90%; max-width: 600px; max-height: 90vh; overflow-y: auto; border-top: 4px solid #f4a261;">
      <h2 style="margin: 0 0 25px 0; color: #2c3e50; font-size: 1.8rem; font-weight: 600;">
        ${isEdit ? 'Modifier l\'événement' : 'Créer un nouvel événement'}
      </h2>
      
      <form id="event-form">
        <div style="margin-bottom: 20px;">
          <label style="display: block; margin-bottom: 8px; font-weight: 500; color: #2c3e50;">Titre *</label>
          <input type="text" id="event-title" required 
                 style="width: 100%; padding: 12px; border: 1px solid #dee2e6; border-radius: 8px; box-sizing: border-box; font-size: 14px;"
                 value="${eventToEdit?.title || ''}" placeholder="Nom de l'événement">
        </div>
        
        <div style="margin-bottom: 20px;">
          <label style="display: block; margin-bottom: 8px; font-weight: 500; color: #2c3e50;">Description</label>
          <textarea id="event-description" rows="3"
                    style="width: 100%; padding: 12px; border: 1px solid #dee2e6; border-radius: 8px; box-sizing: border-box; resize: vertical; font-size: 14px;"
                    placeholder="Description de l'événement">${eventToEdit?.description || ''}</textarea>
        </div>
        
                <div style="margin-bottom: 20px;">
          <label style="display: block; margin-bottom: 8px; font-weight: 500; color: #2c3e50;">Image de l'événement</label>
          <div style="display: flex; gap: 15px; align-items: start;">
            <div style="flex: 1;">
              <input type="file" id="event-image" accept="image/*"
                     style="width: 100%; padding: 12px; border: 1px solid #dee2e6; border-radius: 8px; box-sizing: border-box; font-size: 14px;">
              <small style="color: #6c757d; font-size: 12px;">Formats acceptés: JPG, PNG, GIF (max 5MB)</small>
            </div>
            <div id="image-preview" style="width: 100px; height: 80px; border: 2px dashed #dee2e6; border-radius: 8px; display: flex; align-items: center; justify-content: center; background: #f8f9fa; color: #6c757d; font-size: 12px; text-align: center;">
              ${eventToEdit?.image_url ? `<img src="${eventToEdit.image_url}" style="width: 100%; height: 100%; object-fit: cover; border-radius: 6px;">` : 'Aperçu'}
            </div>
          </div>
        </div>
        
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 20px;">
          <div>
            <label style="display: block; margin-bottom: 8px; font-weight: 500; color: #2c3e50;">Date *</label>
            <input type="date" id="event-date" required
                   style="width: 100%; padding: 12px; border: 1px solid #dee2e6; border-radius: 8px; box-sizing: border-box; font-size: 14px;"
                   value="${eventToEdit?.date ? eventToEdit.date.split('T')[0] : ''}">
          </div>
          
          <div>
            <label style="display: block; margin-bottom: 8px; font-weight: 500; color: #2c3e50;">Lieu *</label>
            <input type="text" id="event-location" required
                   style="width: 100%; padding: 12px; border: 1px solid #dee2e6; border-radius: 8px; box-sizing: border-box; font-size: 14px;"
                   value="${eventToEdit?.location || ''}" placeholder="Adresse ou lieu">
          </div>
        </div>
        
        <div style="display: flex; gap: 12px; justify-content: flex-end; margin-top: 30px;">
          <button type="button" onclick="closeEventModal()" 
                  style="padding: 12px 24px; background: #6c757d; color: white; border: none; border-radius: 8px; cursor: pointer; font-weight: 500;">
            Annuler
          </button>
          <button type="submit"
                  style="padding: 12px 24px; background: #f4a261; color: white; border: none; border-radius: 8px; cursor: pointer; font-weight: 500;">
            ${isEdit ? 'Mettre à jour' : 'Créer l\'événement'}
          </button>
        </div>
      </form>
    </div>
  `;
  
    document.body.appendChild(modal);
  
  // Gérer la prévisualisation d'image
  document.getElementById('event-image').addEventListener('change', function(e) {
    const file = e.target.files[0];
    const preview = document.getElementById('image-preview');
    
    if (file) {
      // Vérifier la taille (5MB max)
      if (file.size > 5 * 1024 * 1024) {
        showMessage('L\'image ne doit pas dépasser 5MB', 'error');
        e.target.value = '';
        return;
      }
      
      const reader = new FileReader();
      reader.onload = function(e) {
        preview.innerHTML = `<img src="${e.target.result}" style="width: 100%; height: 100%; object-fit: cover; border-radius: 6px;">`;
      };
      reader.readAsDataURL(file);
    } else {
      preview.innerHTML = 'Aperçu';
    }
  });

  // Gérer la soumission du formulaire
  document.getElementById('event-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    await handleEventSubmit(communityId, eventToEdit?.id);
  });
  
  // Fermer le modal en cliquant à l'extérieur
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      closeEventModal();
    }
  });
}

function closeEventModal() {
  const modal = document.getElementById('event-modal');
  if (modal) {
    modal.remove();
  }
}

async function handleEventSubmit(communityId, eventId = null) {
  const isEdit = !!eventId;
  
  // Récupérer le bouton de soumission
  const submitButton = document.querySelector('#event-form button[type="submit"]');
  const originalButtonText = submitButton.innerHTML;
  
  // Activer l'état de chargement
  setLoadingState(submitButton, true, isEdit);
  
  const eventData = {
    title: document.getElementById('event-title').value.trim(),
    description: document.getElementById('event-description').value.trim(),
    date: document.getElementById('event-date').value,
    location: document.getElementById('event-location').value.trim(),
    community_id: communityId
  };
  
  // Gérer l'image sélectionnée
  const imageFile = document.getElementById('event-image').files[0];
  if (imageFile) {
    try {
      const reader = new FileReader();
      const imageData = await new Promise((resolve, reject) => {
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(imageFile);
      });
      eventData.image_url = imageData;
    } catch (error) {
      showMessage('Erreur lors du traitement de l\'image', 'error');
      setLoadingState(submitButton, false, isEdit, originalButtonText);
      return;
    }
  }
  
  // Validation
  if (!eventData.title || !eventData.date || !eventData.location) {
    showMessage('Veuillez remplir tous les champs obligatoires', 'error');
    setLoadingState(submitButton, false, isEdit, originalButtonText);
    return;
  }
  
  try {
    let result;
    if (isEdit) {
      result = await database.updateEvent(eventId, eventData);
    } else {
      result = await database.createEvent(eventData);
    }
    
    if (result.error) {
      showMessage(`Erreur lors de ${isEdit ? 'la modification' : 'la création'} : ${result.error.message}`, 'error');
      setLoadingState(submitButton, false, isEdit, originalButtonText);
    } else {
      showMessage(`Événement ${isEdit ? 'modifié' : 'créé'} avec succès !`, 'success');
      closeEventModal();
      // Recharger les événements
      await loadEvents(communityId);
      await loadStatistics(communityId);
    }
  } catch (error) {
    showMessage(`Erreur inattendue : ${error.message}`, 'error');
    setLoadingState(submitButton, false, isEdit, originalButtonText);
  }
}

// Fonction pour gérer l'état de chargement du bouton
function setLoadingState(button, isLoading, isEdit, originalText = null) {
  if (isLoading) {
    button.disabled = true;
    button.style.opacity = '0.7';
    button.style.cursor = 'not-allowed';
    button.innerHTML = `
      <div style="display: flex; align-items: center; justify-content: center; gap: 8px;">
        <div class="spinner" style="
          width: 16px; 
          height: 16px; 
          border: 2px solid transparent; 
          border-top: 2px solid white; 
          border-radius: 50%; 
          animation: spin 1s linear infinite;
        "></div>
        ${isEdit ? 'Mise à jour...' : 'Création...'}
      </div>
    `;
    
    // Ajouter l'animation CSS si elle n'existe pas déjà
    if (!document.getElementById('spinner-animation')) {
      const style = document.createElement('style');
      style.id = 'spinner-animation';
      style.textContent = `
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `;
      document.head.appendChild(style);
    }
  } else {
    button.disabled = false;
    button.style.opacity = '1';
    button.style.cursor = 'pointer';
    button.innerHTML = originalText || (isEdit ? 'Mettre à jour' : 'Créer l\'événement');
  }
}

async function viewEventParticipants(eventId) {
  try {
    const { data: participants, error } = await database.getEventParticipants(eventId);
    
    if (error) {
      showMessage(`Erreur lors du chargement des participants : ${error.message}`, 'error');
      return;
    }
    
    showParticipantsModal(participants || [], eventId);
    
  } catch (error) {
    showMessage(`Erreur inattendue : ${error.message}`, 'error');
  }
}

function showParticipantsModal(participants, eventId) {
  const modalId = 'participants-modal';
  
  // Supprimer le modal existant s'il y en a un
  const existingModal = document.getElementById(modalId);
  if (existingModal) {
    existingModal.remove();
  }
  
  const modal = document.createElement('div');
  modal.id = modalId;
  modal.style.cssText = `
    position: fixed; top: 0; left: 0; width: 100%; height: 100%; 
    background: rgba(0,0,0,0.5); display: flex; justify-content: center; 
    align-items: center; z-index: 1000; backdrop-filter: blur(5px);
  `;
  
  modal.innerHTML = `
    <div style="background: white; padding: 40px; border-radius: 12px; width: 90%; max-width: 600px; max-height: 80vh; overflow-y: auto; border-top: 4px solid #6c757d;">
      <h2 style="margin: 0 0 25px 0; color: #2c3e50; font-size: 1.8rem; font-weight: 600;">
        Participants à l'événement (${participants.length})
      </h2>
      
      ${participants.length === 0 ? `
        <div style="text-align: center; padding: 60px 20px; color: #6c757d;">
          <div style="width: 80px; height: 80px; margin: 0 auto 20px; background: #f8f9fa; border-radius: 50%; display: flex; align-items: center; justify-content: center;">
            <svg width="32" height="32" fill="#6c757d" viewBox="0 0 24 24">
              <path d="M16 4c0-1.11.89-2 2-2s2 .89 2 2-.89 2-2 2-2-.89-2-2zM4 18v-4h3v4h2v-7.5c0-.83-.67-1.5-1.5-1.5S6 9.67 6 10.5V11H4c-.83 0-1.5.67-1.5 1.5v5c0 .83.67 1.5 1.5 1.5z"/>
            </svg>
          </div>
          <p style="margin: 0;">Aucun participant pour le moment</p>
        </div>
      ` : `
        <div style="display: grid; gap: 15px; margin-bottom: 30px;">
          ${participants.map(participant => `
            <div style="display: flex; align-items: center; gap: 15px; padding: 20px; border: 1px solid #e9ecef; border-radius: 10px; background: #f8f9fa;">
              <div style="width: 50px; height: 50px; border-radius: 50%; background: linear-gradient(135deg, #f4a261 0%, #e76f51 100%); display: flex; align-items: center; justify-content: center; color: white; font-weight: 600; font-size: 1.2rem;">
                ${(participant.user_profiles?.full_name || participant.user_profiles?.email || 'U').charAt(0).toUpperCase()}
              </div>
              <div>
                <div style="font-weight: 600; color: #2c3e50; font-size: 1.1rem; margin-bottom: 5px;">
                  ${participant.user_profiles?.full_name || participant.user_profiles?.email || 'Utilisateur'}
                </div>
                <div style="color: #6c757d; font-size: 14px; margin-bottom: 3px;">
                  ${participant.user_profiles?.email || 'Email non disponible'}
                </div>
                <div style="color: #adb5bd; font-size: 12px;">
                  Inscrit le ${new Date(participant.registered_at).toLocaleDateString('fr-FR')}
                </div>
              </div>
            </div>
          `).join('')}
        </div>
      `}
      
      <div style="display: flex; justify-content: flex-end;">
        <button type="button" onclick="closeParticipantsModal()" 
                style="padding: 12px 24px; background: #6c757d; color: white; border: none; border-radius: 8px; cursor: pointer; font-weight: 500;">
          Fermer
        </button>
      </div>
    </div>
  `;
  
  document.body.appendChild(modal);
  
  // Fermer le modal en cliquant à l'extérieur
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      closeParticipantsModal();
    }
  });
}

function closeParticipantsModal() {
  const modal = document.getElementById('participants-modal');
  if (modal) {
    modal.remove();
  }
}

// Rendre les fonctions disponibles globalement
window.createCommunityEvent = createCommunityEvent;
window.inviteMembers = inviteMembers;
window.editCommunity = editCommunity;
window.viewPublicPage = viewPublicPage;
window.editEvent = editEvent;
window.deleteEvent = deleteEvent;
window.removeMember = removeMember;
window.viewEventParticipants = viewEventParticipants;
window.closeEventModal = closeEventModal;
window.closeParticipantsModal = closeParticipantsModal;
window.handleLogout = handleCommonLogout; 