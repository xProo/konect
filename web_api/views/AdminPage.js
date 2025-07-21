import { auth, admin } from "../lib/supabase.js";
import { BrowserLink } from "../components/BrowserRouter.js";
import { createCommonNavbar, updateCommonUserDisplay, handleCommonLogout } from "../components/CommonNavbar.js";

export default function AdminPage() {
  // Initialiser la page après le rendu
  setTimeout(async () => {
    await checkAdminAccess();
    await updateCommonUserDisplay();
    
    // Écouter les changements d'authentification
    auth.onAuthStateChange(async (event, session) => {
      if (session) {
        await checkAdminAccess();
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
      
      // Hero Section
      {
        tag: "div",
        attributes: [["style", { 
          background: "linear-gradient(135deg, #343a40 0%, #f4a261 100%)", 
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
                      {
                        tag: "span",
                        attributes: [["style", { fontWeight: "500" }]],
                        children: ["Administration"]
                      }
                    ]
                  }
                ]
              },

              // Titre
              {
                tag: "div",
                children: [
                  {
                    tag: "h1",
                    attributes: [["style", { 
                      fontSize: "2.5rem", 
                      fontWeight: "300", 
                      margin: "0 0 15px 0",
                      letterSpacing: "-1px"
                    }]],
                    children: ["Espace Administrateur"]
                  },
                  {
                    tag: "p",
                    attributes: [["style", { 
                      fontSize: "1.1rem", 
                      opacity: "0.9",
                      fontWeight: "300",
                      margin: "0"
                    }]],
                    children: ["Gestion complète des utilisateurs, communautés et événements"]
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

              // Contrôle d'accès
              {
                tag: "div",
                attributes: [["id", "access-control"], ["style", { display: "none" }]],
                children: [
                  {
                    tag: "div",
                    attributes: [["style", { 
                      textAlign: "center", 
                      padding: "60px 20px",
                      backgroundColor: "white",
                      borderRadius: "12px",
                      border: "1px solid #e9ecef"
                    }]],
                    children: [
                      {
                        tag: "div",
                        attributes: [["style", { 
                          width: "80px", 
                          height: "80px", 
                          margin: "0 auto 20px", 
                          background: "#dc3545", 
                          borderRadius: "50%", 
                          display: "flex", 
                          alignItems: "center", 
                          justifyContent: "center" 
                        }]],
                        children: [
                          {
                            tag: "svg",
                            attributes: [
                              ["width", "32"],
                              ["height", "32"],
                              ["fill", "white"],
                              ["viewBox", "0 0 24 24"]
                            ],
                            children: [
                              {
                                tag: "path",
                                attributes: [["d", "M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm-2 16l-4-4 1.41-1.41L10 14.17l6.59-6.59L18 9l-8 8z"]]
                              }
                            ]
                          }
                        ]
                      },
                      {
                        tag: "h3",
                        attributes: [["style", { 
                          color: "#2c3e50", 
                          marginBottom: "10px", 
                          fontWeight: "600" 
                        }]],
                        children: ["Accès restreint"]
                      },
                      {
                        tag: "p",
                        attributes: [["style", { color: "#6c757d", margin: "0" }]],
                        children: ["Vous n'avez pas les permissions administrateur pour accéder à cette page."]
                      }
                    ]
                  }
                ]
              },

              // Statistiques générales
              {
                tag: "div",
                attributes: [["id", "admin-content"], ["style", { display: "none" }]],
                children: [
                  {
                    tag: "div",
                    attributes: [["style", { 
                      display: "grid", 
                      gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", 
                      gap: "25px", 
                      marginBottom: "40px" 
                    }]],
                    children: [
                      // Carte Utilisateurs
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
                                    children: ["Utilisateurs"]
                                  },
                                  {
                                    tag: "div",
                                    attributes: [["id", "stats-users"], ["style", { 
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
                                        attributes: [["d", "M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"]]
                                      }
                                    ]
                                  }
                                ]
                              }
                            ]
                          }
                        ]
                      },

                      // Carte Communautés
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
                                    children: ["Communautés"]
                                  },
                                  {
                                    tag: "div",
                                    attributes: [["id", "stats-communities"], ["style", { 
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
                          borderLeft: "4px solid #e76f51"
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
                                    attributes: [["id", "stats-events"], ["style", { 
                                      fontSize: "2rem", 
                                      fontWeight: "700", 
                                      color: "#e76f51" 
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
                                  backgroundColor: "#e76f51", 
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
                                      ["fill", "#e76f51"],
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

                      // Carte Inscriptions
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
                                    children: ["Inscriptions"]
                                  },
                                  {
                                    tag: "div",
                                    attributes: [["id", "stats-registrations"], ["style", { 
                                      fontSize: "2rem", 
                                      fontWeight: "700", 
                                      color: "#28a745" 
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

                  // Onglets de navigation
                  {
                    tag: "div",
                    attributes: [["style", { marginBottom: "30px" }]],
                    children: [
                      {
                        tag: "div",
                        attributes: [["style", { 
                          backgroundColor: "white", 
                          borderRadius: "12px", 
                          padding: "8px", 
                          boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
                          border: "1px solid #e9ecef"
                        }]],
                        children: [
                          {
                            tag: "div",
                            attributes: [["style", { 
                              display: "flex", 
                              gap: "8px",
                              justifyContent: "center",
                              flexWrap: "wrap"
                            }]],
                            children: [
                              {
                                tag: "button",
                                attributes: [
                                  ["onclick", "showTab('users')"],
                                  ["id", "tab-users"],
                                  ["style", { 
                                    padding: "12px 24px", 
                                    border: "none", 
                                    borderRadius: "8px", 
                                    cursor: "pointer",
                                    fontWeight: "500",
                                    backgroundColor: "#f4a261",
                                    color: "white"
                                  }]
                                ],
                                children: ["Utilisateurs"]
                              },
                              {
                                tag: "button",
                                attributes: [
                                  ["onclick", "showTab('communities')"],
                                  ["id", "tab-communities"],
                                  ["style", { 
                                    padding: "12px 24px", 
                                    border: "none", 
                                    borderRadius: "8px", 
                                    cursor: "pointer",
                                    fontWeight: "500",
                                    backgroundColor: "transparent",
                                    color: "#6c757d"
                                  }]
                                ],
                                children: ["Communautés"]
                              },
                              {
                                tag: "button",
                                attributes: [
                                  ["onclick", "showTab('events')"],
                                  ["id", "tab-events"],
                                  ["style", { 
                                    padding: "12px 24px", 
                                    border: "none", 
                                    borderRadius: "8px", 
                                    cursor: "pointer",
                                    fontWeight: "500",
                                    backgroundColor: "transparent",
                                    color: "#6c757d"
                                  }]
                                ],
                                children: ["Événements"]
                              }
                            ]
                          }
                        ]
                      }
                    ]
                  },

                  // Contenu des onglets
                  {
                    tag: "div",
                    attributes: [["id", "tab-content"]],
                    children: [
                      // Tab Utilisateurs
                      {
                        tag: "div",
                        attributes: [["id", "content-users"], ["style", { display: "block" }]],
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
                                tag: "div",
                                attributes: [["style", { 
                                  display: "flex", 
                                  justifyContent: "space-between", 
                                  alignItems: "center", 
                                  marginBottom: "25px" 
                                }]],
                                children: [
                                  {
                                    tag: "h2",
                                    attributes: [["style", { 
                                      color: "#2c3e50", 
                                      fontSize: "1.5rem",
                                      fontWeight: "600",
                                      margin: "0"
                                    }]],
                                    children: ["Gestion des utilisateurs"]
                                  },
                                  {
                                    tag: "input",
                                    attributes: [
                                      ["type", "text"],
                                      ["id", "search-users"],
                                      ["placeholder", "Rechercher un utilisateur..."],
                                      ["style", { 
                                        padding: "10px 15px", 
                                        border: "1px solid #dee2e6", 
                                        borderRadius: "8px", 
                                        width: "300px" 
                                      }],
                                      ["oninput", "searchUsers()"]
                                    ]
                                  }
                                ]
                              },
                              {
                                tag: "div",
                                attributes: [["id", "users-list"], ["style", { minHeight: "300px" }]],
                                children: [
                                  {
                                    tag: "div",
                                    attributes: [["style", { 
                                      textAlign: "center", 
                                      padding: "50px", 
                                      color: "#6c757d" 
                                    }]],
                                    children: ["Chargement des utilisateurs..."]
                                  }
                                ]
                              }
                            ]
                          }
                        ]
                      },

                      // Tab Communautés
                      {
                        tag: "div",
                        attributes: [["id", "content-communities"], ["style", { display: "none" }]],
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
                                tag: "div",
                                attributes: [["style", { 
                                  display: "flex", 
                                  justifyContent: "space-between", 
                                  alignItems: "center", 
                                  marginBottom: "25px" 
                                }]],
                                children: [
                                  {
                                    tag: "h2",
                                    attributes: [["style", { 
                                      color: "#2c3e50", 
                                      fontSize: "1.5rem",
                                      fontWeight: "600",
                                      margin: "0"
                                    }]],
                                    children: ["Gestion des communautés"]
                                  },
                                  {
                                    tag: "input",
                                    attributes: [
                                      ["type", "text"],
                                      ["id", "search-communities"],
                                      ["placeholder", "Rechercher une communauté..."],
                                      ["style", { 
                                        padding: "10px 15px", 
                                        border: "1px solid #dee2e6", 
                                        borderRadius: "8px", 
                                        width: "300px" 
                                      }],
                                      ["oninput", "searchCommunities()"]
                                    ]
                                  }
                                ]
                              },
                              {
                                tag: "div",
                                attributes: [["id", "communities-list"], ["style", { minHeight: "300px" }]],
                                children: [
                                  {
                                    tag: "div",
                                    attributes: [["style", { 
                                      textAlign: "center", 
                                      padding: "50px", 
                                      color: "#6c757d" 
                                    }]],
                                    children: ["Chargement des communautés..."]
                                  }
                                ]
                              }
                            ]
                          }
                        ]
                      },

                      // Tab Événements
                      {
                        tag: "div",
                        attributes: [["id", "content-events"], ["style", { display: "none" }]],
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
                                tag: "div",
                                attributes: [["style", { 
                                  display: "flex", 
                                  justifyContent: "space-between", 
                                  alignItems: "center", 
                                  marginBottom: "25px" 
                                }]],
                                children: [
                                  {
                                    tag: "h2",
                                    attributes: [["style", { 
                                      color: "#2c3e50", 
                                      fontSize: "1.5rem",
                                      fontWeight: "600",
                                      margin: "0"
                                    }]],
                                    children: ["Gestion des événements"]
                                  },
                                  {
                                    tag: "input",
                                    attributes: [
                                      ["type", "text"],
                                      ["id", "search-events"],
                                      ["placeholder", "Rechercher un événement..."],
                                      ["style", { 
                                        padding: "10px 15px", 
                                        border: "1px solid #dee2e6", 
                                        borderRadius: "8px", 
                                        width: "300px" 
                                      }],
                                      ["oninput", "searchEvents()"]
                                    ]
                                  }
                                ]
                              },
                              {
                                tag: "div",
                                attributes: [["id", "events-list"], ["style", { minHeight: "300px" }]],
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
          }
        ]
      }
    ]
  };
}

// === FONCTIONS DE CONTRÔLE D'ACCÈS ===

async function checkAdminAccess() {
  try {
    const { data: { user } } = await auth.getCurrentUser();
    
    if (!user) {
      window.history.pushState({}, '', '/connexion');
      const popStateEvent = new PopStateEvent('popstate', { state: {} });
      window.dispatchEvent(popStateEvent);
      return;
    }

    const isAdminUser = await admin.isAdmin();
    
    if (!isAdminUser) {
      document.getElementById('access-control').style.display = 'block';
      document.getElementById('admin-content').style.display = 'none';
    } else {
      document.getElementById('access-control').style.display = 'none';
      document.getElementById('admin-content').style.display = 'block';
      await loadAdminData();
    }
  } catch (error) {
    showMessage('Erreur lors de la vérification des permissions', 'error');
  }
}

async function loadAdminData() {
  try {
    // Charger les statistiques
    await loadStats();
    
    // Charger les données par défaut (utilisateurs)
    await loadUsers();
    
  } catch (error) {
    showMessage('Erreur lors du chargement des données', 'error');
  }
}

async function loadStats() {
  try {
    const { data: stats, error } = await admin.getStats();
    
    if (error) {
      showMessage(`Erreur lors du chargement des statistiques : ${error.message}`, 'error');
      return;
    }

    document.getElementById('stats-users').textContent = stats?.total_users || 0;
    document.getElementById('stats-communities').textContent = stats?.total_communities || 0;
    document.getElementById('stats-events').textContent = stats?.total_events || 0;
    document.getElementById('stats-registrations').textContent = stats?.total_registrations || 0;

  } catch (error) {
    showMessage('Erreur lors du chargement des statistiques', 'error');
  }
}

// === GESTION DES ONGLETS ===

function showTab(tabName) {
  // Masquer tous les contenus
  document.getElementById('content-users').style.display = 'none';
  document.getElementById('content-communities').style.display = 'none';
  document.getElementById('content-events').style.display = 'none';

  // Réinitialiser tous les boutons
  document.getElementById('tab-users').style.backgroundColor = 'transparent';
  document.getElementById('tab-users').style.color = '#6c757d';
  document.getElementById('tab-communities').style.backgroundColor = 'transparent';
  document.getElementById('tab-communities').style.color = '#6c757d';
  document.getElementById('tab-events').style.backgroundColor = 'transparent';
  document.getElementById('tab-events').style.color = '#6c757d';

  // Afficher le contenu sélectionné
  document.getElementById(`content-${tabName}`).style.display = 'block';
  document.getElementById(`tab-${tabName}`).style.backgroundColor = '#f4a261';
  document.getElementById(`tab-${tabName}`).style.color = 'white';

  // Charger les données si nécessaire
  switch (tabName) {
    case 'users':
      loadUsers();
      break;
    case 'communities':
      loadCommunities();
      break;
    case 'events':
      loadEvents();
      break;
  }
}

// === GESTION DES UTILISATEURS ===

async function loadUsers() {
  try {
    const { data: users, error } = await admin.getAllUsers();
    
    if (error) {
      showMessage(`Erreur lors du chargement des utilisateurs : ${error.message}`, 'error');
      return;
    }

    displayUsers(users || []);

  } catch (error) {
    showMessage('Erreur lors du chargement des utilisateurs', 'error');
  }
}

function displayUsers(users) {
  const container = document.getElementById('users-list');
  
  if (users.length === 0) {
    container.innerHTML = `
      <div style="text-align: center; padding: 60px 20px; color: #6c757d;">
        <div style="width: 80px; height: 80px; margin: 0 auto 20px; background: #f8f9fa; border-radius: 50%; display: flex; align-items: center; justify-content: center;">
          <svg width="32" height="32" fill="#6c757d" viewBox="0 0 24 24">
            <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
          </svg>
        </div>
        <h3 style="color: #2c3e50; margin-bottom: 10px; font-weight: 600;">Aucun utilisateur</h3>
      </div>
    `;
    return;
  }

  container.innerHTML = `
    <div style="display: grid; gap: 15px;">
      ${users.map(user => `
        <div style="display: flex; justify-content: space-between; align-items: center; padding: 20px; border: 1px solid #e9ecef; border-radius: 10px; background: #f8f9fa;">
          <div style="display: flex; align-items: center; gap: 15px;">
            <div style="width: 50px; height: 50px; border-radius: 50%; background: linear-gradient(135deg, #f4a261 0%, #e76f51 100%); display: flex; align-items: center; justify-content: center; color: white; font-weight: 600; font-size: 1.2rem;">
              ${(user.full_name || user.email || 'U').charAt(0).toUpperCase()}
            </div>
            <div>
              <div style="font-weight: 600; color: #2c3e50; font-size: 1.1rem; margin-bottom: 5px;">
                ${user.full_name || user.email}
                ${user.is_admin ? '<span style="background: #dc3545; color: white; padding: 2px 8px; border-radius: 12px; font-size: 12px; margin-left: 8px;">ADMIN</span>' : ''}
              </div>
              <div style="color: #6c757d; font-size: 14px; margin-bottom: 3px;">
                ${user.email}
              </div>
              <div style="color: #adb5bd; font-size: 12px;">
                Créé le ${new Date(user.created_at).toLocaleDateString('fr-FR')}
              </div>
            </div>
          </div>
          <div style="display: flex; gap: 10px;">
            <button onclick="toggleAdmin('${user.id}', ${!user.is_admin})" style="padding: 8px 12px; background: ${user.is_admin ? '#dc3545' : '#28a745'}; color: white; border: none; border-radius: 6px; cursor: pointer; font-size: 12px;">
              ${user.is_admin ? 'Retirer admin' : 'Promouvoir admin'}
            </button>
            <button onclick="editUser('${user.id}')" style="padding: 8px 12px; background: #f4a261; color: white; border: none; border-radius: 6px; cursor: pointer; font-size: 12px;">
              Modifier
            </button>
            <button onclick="deleteUser('${user.id}')" style="padding: 8px 12px; background: #6c757d; color: white; border: none; border-radius: 6px; cursor: pointer; font-size: 12px;">
              Supprimer
            </button>
          </div>
        </div>
      `).join('')}
    </div>
  `;
}

async function searchUsers() {
  const query = document.getElementById('search-users').value.trim();
  
  if (query.length < 2) {
    await loadUsers();
    return;
  }

  try {
    const { data: users, error } = await admin.searchUsers(query);
    
    if (error) {
      showMessage(`Erreur lors de la recherche : ${error.message}`, 'error');
      return;
    }

    displayUsers(users || []);

  } catch (error) {
    showMessage('Erreur lors de la recherche', 'error');
  }
}

async function toggleAdmin(userId, makeAdmin) {
  try {
    const { error } = await admin.toggleAdminStatus(userId, makeAdmin);
    
    if (error) {
      showMessage(`Erreur : ${error.message}`, 'error');
    } else {
      showMessage(`Statut administrateur ${makeAdmin ? 'accordé' : 'retiré'} avec succès`, 'success');
      await loadUsers();
      await loadStats();
    }
  } catch (error) {
    showMessage('Erreur lors de la modification du statut', 'error');
  }
}

function editUser(userId) {
  showMessage('Fonctionnalité de modification à venir...', 'info');
}

async function deleteUser(userId) {
  if (!confirm('Êtes-vous sûr de vouloir désactiver cet utilisateur ?')) {
    return;
  }

  try {
    const { error } = await admin.deleteUser(userId);
    
    if (error) {
      showMessage(`Erreur : ${error.message}`, 'error');
    } else {
      showMessage('Utilisateur désactivé avec succès', 'success');
      await loadUsers();
      await loadStats();
    }
  } catch (error) {
    showMessage('Erreur lors de la suppression', 'error');
  }
}

// === GESTION DES COMMUNAUTÉS ===

async function loadCommunities() {
  try {
    const { data: communities, error } = await admin.getAllCommunities();
    
    if (error) {
      showMessage(`Erreur lors du chargement des communautés : ${error.message}`, 'error');
      return;
    }

    displayCommunities(communities || []);

  } catch (error) {
    showMessage('Erreur lors du chargement des communautés', 'error');
  }
}

function displayCommunities(communities) {
  const container = document.getElementById('communities-list');
  
  if (communities.length === 0) {
    container.innerHTML = `
      <div style="text-align: center; padding: 60px 20px; color: #6c757d;">
        <div style="width: 80px; height: 80px; margin: 0 auto 20px; background: #f8f9fa; border-radius: 50%; display: flex; align-items: center; justify-content: center;">
          <svg width="32" height="32" fill="#6c757d" viewBox="0 0 24 24">
            <path d="M16 4c0-1.11.89-2 2-2s2 .89 2 2-.89 2-2 2-2-.89-2-2zM4 18v-4h3v4h2v-7.5c0-.83-.67-1.5-1.5-1.5S6 9.67 6 10.5V11H4c-.83 0-1.5.67-1.5 1.5v5c0 .83.67 1.5 1.5 1.5z"/>
          </svg>
        </div>
        <h3 style="color: #2c3e50; margin-bottom: 10px; font-weight: 600;">Aucune communauté</h3>
      </div>
    `;
    return;
  }

  container.innerHTML = `
    <div style="display: grid; gap: 20px;">
      ${communities.map(community => `
        <div style="border: 1px solid #e9ecef; border-radius: 12px; padding: 25px; background: #f8f9fa; border-left: 4px solid #6c757d;">
          <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 20px;">
            <div style="flex: 1;">
              <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 15px;">
                <div style="width: 40px; height: 40px; border-radius: 50%; background: linear-gradient(135deg, #6c757d 0%, #f4a261 100%); display: flex; align-items: center; justify-content: center;">
                  <svg width="20" height="20" fill="white" viewBox="0 0 24 24">
                    <path d="M16 4c0-1.11.89-2 2-2s2 .89 2 2-.89 2-2 2-2-.89-2-2zM4 18v-4h3v4h2v-7.5c0-.83-.67-1.5-1.5-1.5S6 9.67 6 10.5V11H4c-.83 0-1.5.67-1.5 1.5v5c0 .83.67 1.5 1.5 1.5z"/>
                  </svg>
                </div>
                <div>
                  <h3 style="margin: 0; color: #2c3e50; font-size: 1.3rem; font-weight: 600;">
                    ${community.name}
                  </h3>
                  <div style="color: #6c757d; font-size: 14px;">
                    Par ${community.user_profiles?.full_name || community.user_profiles?.email || 'Utilisateur inconnu'}
                  </div>
                </div>
              </div>
              <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px; margin-bottom: 15px;">
                <div style="display: flex; align-items: center; gap: 8px; color: #6c757d;">
                  <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                  </svg>
                  <span>${community.category || 'Non catégorisé'}</span>
                </div>
                <div style="display: flex; align-items: center; gap: 8px; color: #6c757d;">
                  <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                  </svg>
                  <span>${community.location || 'Lieu non spécifié'}</span>
                </div>
                <div style="display: flex; align-items: center; gap: 8px; color: #6c757d;">
                  <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM7 10h5v5H7z"/>
                  </svg>
                  <span>Créée le ${new Date(community.created_at).toLocaleDateString('fr-FR')}</span>
                </div>
              </div>
            </div>
            <div style="display: flex; flex-direction: column; gap: 10px;">
              <div style="display: flex; gap: 10px;">
                <button onclick="editCommunity('${community.id}')" style="padding: 10px 15px; background: #f4a261; color: white; border: none; border-radius: 8px; cursor: pointer; font-weight: 500; display: flex; align-items: center; gap: 8px;">
                  <svg width="16" height="16" fill="white" viewBox="0 0 24 24">
                    <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/>
                  </svg>
                  Modifier
                </button>
                <button onclick="deleteCommunity('${community.id}')" style="padding: 10px 15px; background: #dc3545; color: white; border: none; border-radius: 8px; cursor: pointer; font-weight: 500; display: flex; align-items: center; gap: 8px;">
                  <svg width="16" height="16" fill="white" viewBox="0 0 24 24">
                    <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/>
                  </svg>
                  Supprimer
                </button>
              </div>
            </div>
          </div>
          <p style="margin: 0; color: #6c757d; line-height: 1.5; font-style: italic;">
            ${community.description || 'Aucune description'}
          </p>
        </div>
      `).join('')}
    </div>
  `;
}

async function searchCommunities() {
  const query = document.getElementById('search-communities').value.trim();
  
  if (query.length < 2) {
    await loadCommunities();
    return;
  }

  try {
    const { data: communities, error } = await admin.searchCommunities(query);
    
    if (error) {
      showMessage(`Erreur lors de la recherche : ${error.message}`, 'error');
      return;
    }

    displayCommunities(communities || []);

  } catch (error) {
    showMessage('Erreur lors de la recherche', 'error');
  }
}

function editCommunity(communityId) {
  showMessage('Fonctionnalité de modification à venir...', 'info');
}

async function deleteCommunity(communityId) {
  if (!confirm('Êtes-vous sûr de vouloir supprimer cette communauté ? Cette action est irréversible.')) {
    return;
  }

  try {
    const { error } = await admin.deleteCommunityAdmin(communityId);
    
    if (error) {
      showMessage(`Erreur : ${error.message}`, 'error');
    } else {
      showMessage('Communauté supprimée avec succès', 'success');
      await loadCommunities();
      await loadStats();
    }
  } catch (error) {
    showMessage('Erreur lors de la suppression', 'error');
  }
}

// === GESTION DES ÉVÉNEMENTS ===

async function loadEvents() {
  try {
    const { data: events, error } = await admin.getAllEvents();
    
    if (error) {
      showMessage(`Erreur lors du chargement des événements : ${error.message}`, 'error');
      return;
    }

    displayEvents(events || []);

  } catch (error) {
    showMessage('Erreur lors du chargement des événements', 'error');
  }
}

function displayEvents(events) {
  const container = document.getElementById('events-list');
  
  if (events.length === 0) {
    container.innerHTML = `
      <div style="text-align: center; padding: 60px 20px; color: #6c757d;">
        <div style="width: 80px; height: 80px; margin: 0 auto 20px; background: #f8f9fa; border-radius: 50%; display: flex; align-items: center; justify-content: center;">
          <svg width="32" height="32" fill="#6c757d" viewBox="0 0 24 24">
            <path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM7 10h5v5H7z"/>
          </svg>
        </div>
        <h3 style="color: #2c3e50; margin-bottom: 10px; font-weight: 600;">Aucun événement</h3>
      </div>
    `;
    return;
  }

  container.innerHTML = `
    <div style="display: grid; gap: 20px;">
      ${events.map(event => `
        <div style="border: 1px solid #e9ecef; border-radius: 12px; padding: 25px; background: #f8f9fa; border-left: 4px solid #e76f51;">
          <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 20px;">
            <div style="flex: 1;">
              <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 15px;">
                <div style="width: 40px; height: 40px; border-radius: 50%; background: linear-gradient(135deg, #e76f51 0%, #f4a261 100%); display: flex; align-items: center; justify-content: center;">
                  <svg width="20" height="20" fill="white" viewBox="0 0 24 24">
                    <path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM7 10h5v5H7z"/>
                  </svg>
                </div>
                <div>
                  <h3 style="margin: 0; color: #2c3e50; font-size: 1.3rem; font-weight: 600;">
                    ${event.title}
                  </h3>
                  <div style="color: #6c757d; font-size: 14px;">
                    Communauté : ${event.communities?.name || 'Communauté supprimée'}
                  </div>
                </div>
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
                  <span>${event.location || 'Lieu non spécifié'}</span>
                </div>
                <div style="display: flex; align-items: center; gap: 8px; color: #6c757d;">
                  <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM7 10h5v5H7z"/>
                  </svg>
                  <span>Créé le ${new Date(event.created_at).toLocaleDateString('fr-FR')}</span>
                </div>
              </div>
            </div>
            <div style="display: flex; flex-direction: column; gap: 10px;">
              <div style="display: flex; gap: 10px;">
                <button onclick="viewEventParticipants('${event.id}')" style="padding: 10px 15px; background: #6c757d; color: white; border: none; border-radius: 8px; cursor: pointer; font-weight: 500; display: flex; align-items: center; gap: 8px;">
                  <svg width="16" height="16" fill="white" viewBox="0 0 24 24">
                    <path d="M16 4c0-1.11.89-2 2-2s2 .89 2 2-.89 2-2 2-2-.89-2-2zM4 18v-4h3v4h2v-7.5c0-.83-.67-1.5-1.5-1.5S6 9.67 6 10.5V11H4c-.83 0-1.5.67-1.5 1.5v5c0 .83.67 1.5 1.5 1.5z"/>
                  </svg>
                  Participants
                </button>
                <button onclick="deleteEvent('${event.id}')" style="padding: 10px 15px; background: #dc3545; color: white; border: none; border-radius: 8px; cursor: pointer; font-weight: 500; display: flex; align-items: center; gap: 8px;">
                  <svg width="16" height="16" fill="white" viewBox="0 0 24 24">
                    <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/>
                  </svg>
                  Supprimer
                </button>
              </div>
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

async function searchEvents() {
  const query = document.getElementById('search-events').value.trim();
  
  if (query.length < 2) {
    await loadEvents();
    return;
  }

  try {
    const { data: events, error } = await admin.searchEvents(query);
    
    if (error) {
      showMessage(`Erreur lors de la recherche : ${error.message}`, 'error');
      return;
    }

    displayEvents(events || []);

  } catch (error) {
    showMessage('Erreur lors de la recherche', 'error');
  }
}

function viewEventParticipants(eventId) {
  showMessage('Fonctionnalité de visualisation des participants à venir...', 'info');
}

async function deleteEvent(eventId) {
  if (!confirm('Êtes-vous sûr de vouloir supprimer cet événement ? Cette action est irréversible.')) {
    return;
  }

  try {
    const { error } = await admin.deleteEventAdmin(eventId);
    
    if (error) {
      showMessage(`Erreur : ${error.message}`, 'error');
    } else {
      showMessage('Événement supprimé avec succès', 'success');
      await loadEvents();
      await loadStats();
    }
  } catch (error) {
    showMessage('Erreur lors de la suppression', 'error');
  }
}

// === UTILITAIRES ===

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

// Rendre les fonctions disponibles globalement
window.showTab = showTab;
window.searchUsers = searchUsers;
window.searchCommunities = searchCommunities;
window.searchEvents = searchEvents;
window.toggleAdmin = toggleAdmin;
window.editUser = editUser;
window.deleteUser = deleteUser;
window.editCommunity = editCommunity;
window.deleteCommunity = deleteCommunity;
window.viewEventParticipants = viewEventParticipants;
window.deleteEvent = deleteEvent;
window.handleLogout = handleCommonLogout; 