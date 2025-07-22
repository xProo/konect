import { auth, database } from "../lib/supabase.js";
import { BrowserLink } from "../components/BrowserRouter.js";
import { createCommonNavbar, updateCommonUserDisplay, handleCommonLogout } from "../components/CommonNavbar.js";

export default function EventDetailPage() {
  // Récupérer l'ID de l'événement depuis les paramètres de l'URL
  const urlParams = new URLSearchParams(window.location.search);
  const eventId = urlParams.get('id');

  // Initialiser la page après le rendu
  setTimeout(async () => {
    await loadEventDetails(eventId);
    await updateUserDisplay();
    
    // Écouter les changements d'authentification
    auth.onAuthStateChange((event, session) => {
      updateUserDisplay();
      loadEventDetails(eventId); // Recharger pour mettre à jour les statuts d'inscription
    });
  }, 100);

  return {
    tag: "div",
    children: [
      createCommonNavbar(),
      {
        tag: "div",
        attributes: [["style", { 
          minHeight: "100vh", 
          backgroundColor: "#f8f9fa",
          paddingBottom: "40px"
        }]],
        children: [
          // Breadcrumb
          {
            tag: "div",
            attributes: [["style", { 
              maxWidth: "1200px", 
              margin: "0 auto", 
              padding: "20px 20px 0 20px",
              color: "#6c757d",
              fontSize: "14px"
            }]],
            children: [
              BrowserLink({ link: "/", title: "Accueil", style: "color: #6c757d; text-decoration: none;" }),
              " › ",
              BrowserLink({ link: "/events", title: "Événements", style: "color: #6c757d; text-decoration: none;" }),
              " › ",
              {
                tag: "span",
                attributes: [["id", "event-breadcrumb"], ["style", { color: "#495057" }]],
                children: ["Événement"]
              }
            ]
          },

          // Contenu principal
          {
            tag: "div",
            attributes: [["style", { 
              maxWidth: "1200px", 
              margin: "0 auto", 
              padding: "30px 20px",
              display: "grid",
              gridTemplateColumns: "400px 1fr",
              gap: "40px",
              alignItems: "start"
            }]],
            children: [
              // Image de l'événement (côté gauche)
              {
                tag: "div",
                attributes: [["style", { position: "sticky", top: "20px" }]],
                children: [
                  {
                    tag: "div",
                    attributes: [["id", "event-image"], ["style", { 
                      width: "100%", 
                      height: "500px",
                      backgroundColor: "#e9ecef",
                      borderRadius: "15px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "48px",
                      backgroundImage: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                      color: "white",
                      fontWeight: "bold",
                      textAlign: "center",
                      position: "relative",
                      overflow: "hidden"
                    }]],
                    children: [
                      {
                        tag: "div",
                        attributes: [["style", { 
                          position: "absolute",
                          top: "0",
                          left: "0",
                          right: "0",
                          bottom: "0",
                          background: "rgba(0,0,0,0.3)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          flexDirection: "column"
                        }]],
                        children: [
                          {
                            tag: "div",
                            attributes: [["id", "event-image-title"], ["style", { fontSize: "24px", textAlign: "center", padding: "0 20px" }]],
                            children: ["Événement"]
                          }
                        ]
                      }
                    ]
                  },

                  // Informations prix et billets (en dessous de l'image)
                  {
                    tag: "div",
                    attributes: [["id", "ticket-info"], ["style", { 
                      backgroundColor: "white",
                      borderRadius: "15px",
                      padding: "25px",
                      marginTop: "20px",
                      boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
                      border: "1px solid #dee2e6"
                    }]],
                    children: [
                      {
                        tag: "div",
                        attributes: [["style", { textAlign: "center", marginBottom: "20px" }]],
                        children: [
                          {
                            tag: "div",
                            attributes: [["style", { color: "#6c757d", fontSize: "14px", marginBottom: "5px" }]],
                            children: ["Places disponibles"]
                          },
                          {
                            tag: "div",
                            attributes: [["id", "available-spots"], ["style", { fontSize: "18px", fontWeight: "bold", color: "#28a745" }]],
                            children: ["Chargement..."]
                          }
                        ]
                      },
                      
                      {
                        tag: "div",
                        attributes: [["id", "price-section"], ["style", { textAlign: "center", marginBottom: "25px" }]],
                        children: [
                          {
                            tag: "div",
                            attributes: [["style", { fontSize: "28px", fontWeight: "bold", color: "#333", marginBottom: "10px" }]],
                            children: ["Gratuit"]
                          }
                        ]
                      },

                      {
                        tag: "div",
                        attributes: [["id", "action-buttons"], ["style", { display: "flex", flexDirection: "column", gap: "10px" }]],
                        children: [
                          {
                            tag: "div",
                            attributes: [["style", { textAlign: "center", padding: "20px", color: "#666" }]],
                            children: ["Chargement..."]
                          }
                        ]
                      }
                    ]
                  }
                ]
              },

              // Détails de l'événement (côté droit)
              {
                tag: "div",
                children: [
                  // En-tête avec tags
                  {
                    tag: "div",
                    attributes: [["id", "event-tags"], ["style", { marginBottom: "20px" }]],
                    children: [
                      {
                        tag: "span",
                        attributes: [["style", { 
                          display: "inline-block",
                          padding: "6px 12px",
                          backgroundColor: "#e9ecef",
                          color: "#495057",
                          borderRadius: "15px",
                          fontSize: "12px",
                          fontWeight: "bold",
                          marginRight: "10px"
                        }]],
                        children: ["Événement"]
                      }
                    ]
                  },

                  // Titre principal
                  {
                    tag: "h1",
                    attributes: [["id", "event-title"], ["style", { 
                      fontSize: "2.5rem", 
                      fontWeight: "bold", 
                      color: "#333", 
                      marginBottom: "25px",
                      lineHeight: "1.2"
                    }]],
                    children: ["Chargement..."]
                  },

                  // Informations principales
                  {
                    tag: "div",
                    attributes: [["style", { 
                      display: "grid", 
                      gap: "15px", 
                      marginBottom: "30px",
                      padding: "20px",
                      backgroundColor: "white",
                      borderRadius: "10px",
                      border: "1px solid #dee2e6"
                    }]],
                    children: [
                      {
                        tag: "div",
                        attributes: [["id", "event-date"], ["style", { display: "flex", alignItems: "center", gap: "15px" }]],
                        children: [
                          {
                            tag: "div",
                            attributes: [["style", { fontSize: "20px", width: "30px", textAlign: "center" }]],
                            children: ["📅"]
                          },
                          {
                            tag: "div",
                            children: [
                              {
                                tag: "div",
                                attributes: [["style", { fontWeight: "bold", color: "#333", fontSize: "16px" }]],
                                children: ["Date non définie"]
                              }
                            ]
                          }
                        ]
                      },
                      
                      {
                        tag: "div",
                        attributes: [["id", "event-location"], ["style", { display: "flex", alignItems: "center", gap: "15px" }]],
                        children: [
                          {
                            tag: "div",
                            attributes: [["style", { fontSize: "20px", width: "30px", textAlign: "center" }]],
                            children: ["📍"]
                          },
                          {
                            tag: "div",
                            children: [
                              {
                                tag: "div",
                                attributes: [["style", { fontWeight: "bold", color: "#333", fontSize: "16px" }]],
                                children: ["Lieu non défini"]
                              }
                            ]
                          }
                        ]
                      },

                      {
                        tag: "div",
                        attributes: [["id", "event-organizer"], ["style", { display: "flex", alignItems: "center", gap: "15px" }]],
                        children: [
                          {
                            tag: "div",
                            attributes: [["style", { fontSize: "20px", width: "30px", textAlign: "center" }]],
                            children: ["👤"]
                          },
                          {
                            tag: "div",
                            children: [
                              {
                                tag: "div",
                                attributes: [["style", { color: "#6c757d", fontSize: "14px" }]],
                                children: ["Organisé par"]
                              },
                              {
                                tag: "div",
                                attributes: [["style", { fontWeight: "bold", color: "#333", fontSize: "16px" }]],
                                children: ["Chargement..."]
                              }
                            ]
                          }
                        ]
                      }
                    ]
                  },

                  // Messages
                  {
                    tag: "div",
                    attributes: [["id", "message"], ["style", { padding: "10px", marginBottom: "20px", borderRadius: "5px", display: "none" }]],
                    children: []
                  },

                  // Description de l'événement
                  {
                    tag: "div",
                    attributes: [["style", { 
                      backgroundColor: "white",
                      borderRadius: "10px",
                      padding: "25px",
                      marginBottom: "30px",
                      border: "1px solid #dee2e6"
                    }]],
                    children: [
                      {
                        tag: "h2",
                        attributes: [["style", { 
                          fontSize: "1.5rem", 
                          fontWeight: "bold", 
                          color: "#333", 
                          marginBottom: "20px",
                          borderBottom: "2px solid #007bff",
                          paddingBottom: "10px"
                        }]],
                        children: ["📝 Détails de l'événement"]
                      },
                      {
                        tag: "div",
                        attributes: [["id", "event-description"], ["style", { 
                          color: "#555", 
                          lineHeight: "1.7", 
                          fontSize: "16px"
                        }]],
                        children: ["Chargement de la description..."]
                      }
                    ]
                  },

                  // Section Participants
                  {
                    tag: "div",
                    attributes: [["style", { 
                      backgroundColor: "white",
                      borderRadius: "10px",
                      padding: "25px",
                      border: "1px solid #dee2e6"
                    }]],
                    children: [
                      {
                        tag: "h2",
                        attributes: [["style", { 
                          fontSize: "1.5rem", 
                          fontWeight: "bold", 
                          color: "#333", 
                          marginBottom: "20px",
                          borderBottom: "2px solid #28a745",
                          paddingBottom: "10px"
                        }]],
                        children: ["👥 Participants"]
                      },
                      {
                        tag: "div",
                        attributes: [["id", "participants-list"], ["style", { minHeight: "100px" }]],
                        children: [
                          {
                            tag: "div",
                            attributes: [["style", { textAlign: "center", padding: "20px", color: "#666" }]],
                            children: ["Chargement des participants..."]
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

// === NAVIGATION ===

function createNavbar() {
  return {
    tag: "nav",
    attributes: [["style", { 
      padding: "20px", 
      backgroundColor: "#fff", 
      borderBottom: "1px solid #ddd",
      position: "sticky",
      top: "0",
      zIndex: "100",
      boxShadow: "0 2px 4px rgba(0,0,0,0.1)"
    }]],
    children: [
      {
        tag: "div",
        attributes: [["style", { 
          maxWidth: "1200px", 
          margin: "0 auto",
          display: "flex", 
          justifyContent: "space-between", 
          alignItems: "center",
          flexWrap: "wrap",
          gap: "20px"
        }]],
        children: [
          {
            tag: "div",
            attributes: [["style", { display: "flex", alignItems: "center", gap: "30px" }]],
            children: [
              BrowserLink({ 
                link: "/", 
                title: "🏠 Accueil",
                style: "text-decoration: none; font-weight: bold; color: #007bff; font-size: 18px;"
              }),
              BrowserLink({ 
                link: "/events", 
                title: "Événements",
                style: "text-decoration: none; color: #28a745; font-size: 16px;"
              }),
              BrowserLink({ 
                link: "/communities", 
                title: "🏘️ Mes Communautés",
                style: "text-decoration: none; color: #6c757d; font-size: 16px;"
              })
            ]
          },
          {
            tag: "div",
            attributes: [["id", "user-display"], ["style", { display: "flex", alignItems: "center", gap: "15px" }]],
            children: [
              {
                tag: "span",
                attributes: [["style", { color: "#666" }]],
                children: ["Chargement..."]
              }
            ]
          }
        ]
      }
    ]
  };
}

async function updateUserDisplay() {
  const { data: { user } } = await auth.getCurrentUser();
  const userDisplay = document.getElementById('user-display');
  
  if (!userDisplay) return;

  if (user) {
    let displayName = user.email;
    if (user.user_metadata && user.user_metadata.full_name) {
      displayName = user.user_metadata.full_name;
    } else if (user.user_metadata && user.user_metadata.prenom && user.user_metadata.nom) {
      displayName = `${user.user_metadata.prenom} ${user.user_metadata.nom}`;
    }

    userDisplay.innerHTML = `
      <span style="color: #28a745; font-weight: bold;"> ${displayName}</span>
      <button onclick="handleLogout()" style="padding: 8px 15px; background: #dc3545; color: white; border: none; border-radius: 5px; cursor: pointer; font-size: 14px;">
        🚪 Déconnexion
      </button>
    `;
  } else {
    userDisplay.innerHTML = `
      <a href="/connexion" style="text-decoration: none; padding: 8px 15px; background: #007bff; color: white; border-radius: 5px; font-weight: bold;">
        🔐 Se connecter
      </a>
      <a href="/inscription" style="text-decoration: none; padding: 8px 15px; background: #28a745; color: white; border-radius: 5px; font-weight: bold;">
        ✍️ S'inscrire
      </a>
    `;
  }
}

async function handleLogout() {
  const { error } = await auth.signOut();
  if (error) {
    showMessage('Erreur lors de la déconnexion', 'error');
  } else {
    showMessage('Déconnexion réussie', 'success');
    window.history.pushState({}, '', '/');
    const popStateEvent = new PopStateEvent('popstate', { state: {} });
    window.dispatchEvent(popStateEvent);
  }
}

// === CHARGEMENT DES DONNÉES ===

let currentEvent = null;
let currentUser = null;
let currentCommunity = null;

async function loadEventDetails(eventId) {
  if (!eventId) {
    showMessage('ID d\'événement manquant', 'error');
    return;
  }

  try {
    // Récupérer l'utilisateur actuel
    const { data: { user } } = await auth.getCurrentUser();
    currentUser = user;

    // Récupérer les détails de l'événement
    const { data: events, error: eventError } = await database.getEvents();
    if (eventError) {
      showMessage(`Erreur lors du chargement de l'événement : ${eventError.message}`, 'error');
      return;
    }

    currentEvent = events?.find(event => event.id === eventId);
    if (!currentEvent) {
      showMessage('Événement non trouvé', 'error');
      return;
    }

    // Récupérer les détails de la communauté organisatrice
    if (currentEvent.community_id) {
      const { data: communities, error: communityError } = await database.getCommunities();
      if (!communityError) {
        currentCommunity = communities?.find(c => c.id === currentEvent.community_id);
      }
    }

    // Afficher les détails
    displayEventDetails();
    await loadParticipants();
    await updateActionButtons();

  } catch (error) {
    showMessage(`Erreur inattendue : ${error.message}`, 'error');
  }
}

function displayEventDetails() {
  if (!currentEvent) return;

  // Breadcrumb
  const breadcrumb = document.getElementById('event-breadcrumb');
  if (breadcrumb) {
    breadcrumb.textContent = currentEvent.title;
  }

  // Titre de l'image
  const imageTitle = document.getElementById('event-image-title');
  if (imageTitle) {
    imageTitle.textContent = currentEvent.title;
  }

  // Titre principal
  const title = document.getElementById('event-title');
  if (title) {
    title.textContent = currentEvent.title;
  }

  // Date
  const eventDate = document.getElementById('event-date');
  if (eventDate && currentEvent.date) {
    const date = new Date(currentEvent.date);
    eventDate.innerHTML = `
      <div style="font-size: 20px; width: 30px; text-align: center;">📅</div>
      <div>
        <div style="color: #6c757d; font-size: 14px;">Date</div>
        <div style="font-weight: bold; color: #333; font-size: 16px;">
          ${date.toLocaleDateString('fr-FR', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}
        </div>
      </div>
    `;
  }

  // Lieu
  const location = document.getElementById('event-location');
  if (location) {
    location.innerHTML = `
      <div style="font-size: 20px; width: 30px; text-align: center;">📍</div>
      <div>
        <div style="color: #6c757d; font-size: 14px;">Lieu</div>
        <div style="font-weight: bold; color: #333; font-size: 16px;">
          ${currentEvent.location || 'Lieu non défini'}
        </div>
      </div>
    `;
  }

  // Organisateur
  const organizer = document.getElementById('event-organizer');
  if (organizer) {
    organizer.innerHTML = `
      <div style="font-size: 20px; width: 30px; text-align: center;">👤</div>
      <div>
        <div style="color: #6c757d; font-size: 14px;">Organisé par</div>
        <div style="font-weight: bold; color: #333; font-size: 16px;">
          ${currentCommunity?.name || 'Communauté'}
        </div>
      </div>
    `;
  }

  // Description
  const description = document.getElementById('event-description');
  if (description) {
    description.innerHTML = currentEvent.description || 
      "Cet événement promet d'être une expérience inoubliable ! Rejoignez-nous pour un moment de partage et de découverte.";
  }
}

async function loadParticipants() {
  if (!currentEvent) return;

  try {
    const { data: participants, error } = await database.getEventParticipants(currentEvent.id);
    
    if (error) {
      console.log('Erreur participants:', error);
      displayParticipants([]);
      return;
    }

    displayParticipants(participants || []);
    updateAvailableSpots(participants || []);

  } catch (error) {
    console.log('Erreur lors du chargement des participants:', error);
    displayParticipants([]);
  }
}

function displayParticipants(participants) {
  const container = document.getElementById('participants-list');
  if (!container) return;

  if (participants.length === 0) {
    container.innerHTML = `
      <div style="text-align: center; padding: 40px; color: #666;">
        <div style="font-size: 48px; margin-bottom: 15px;">👥</div>
        <p style="margin: 0; font-size: 18px;">Aucun participant pour le moment</p>
        <p style="margin: 10px 0 0 0; color: #888;">Soyez le premier à vous inscrire !</p>
      </div>
    `;
    return;
  }

  container.innerHTML = `
    <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(250px, 1fr)); gap: 15px;">
      ${participants.map(participant => `
        <div style="display: flex; align-items: center; gap: 15px; padding: 15px; border: 1px solid #dee2e6; border-radius: 10px; background: #f8f9fa;">
          <div style="width: 50px; height: 50px; border-radius: 50%; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); display: flex; align-items: center; justify-content: center; color: white; font-weight: bold; font-size: 18px;">
            ${(participant.user_profiles?.full_name || participant.user_profiles?.email || 'U').charAt(0).toUpperCase()}
          </div>
          <div style="flex: 1;">
            <div style="font-weight: bold; color: #333; margin-bottom: 2px;">
              ${participant.user_profiles?.full_name || participant.user_profiles?.email || 'Utilisateur'}
            </div>
            <div style="color: #6c757d; font-size: 14px;">
              Inscrit le ${new Date(participant.registered_at).toLocaleDateString('fr-FR')}
            </div>
          </div>
        </div>
      `).join('')}
    </div>
  `;
}

function updateAvailableSpots(participants) {
  const spotsElement = document.getElementById('available-spots');
  if (!spotsElement) return;

  const participantCount = participants.length;
  
  if (currentEvent.max_participants) {
    const remaining = currentEvent.max_participants - participantCount;
    spotsElement.innerHTML = `${remaining} place${remaining > 1 ? 's' : ''} restante${remaining > 1 ? 's' : ''}`;
    if (remaining <= 0) {
      spotsElement.style.color = '#dc3545';
      spotsElement.textContent = 'Complet';
    }
  } else {
    spotsElement.innerHTML = `${participantCount} participant${participantCount > 1 ? 's' : ''} inscrit${participantCount > 1 ? 's' : ''}`;
  }
}

async function updateActionButtons() {
  const container = document.getElementById('action-buttons');
  if (!container || !currentEvent) return;

  const eventDate = currentEvent.date ? new Date(currentEvent.date) : null;
  const isEventPassed = eventDate && eventDate < new Date();
  
  if (!currentUser) {
    container.innerHTML = `
      <a href="/connexion" style="padding: 15px 25px; background: #007bff; color: white; border: none; border-radius: 8px; cursor: pointer; font-weight: bold; text-decoration: none; text-align: center; font-size: 16px;">
        🔐 Se connecter pour s'inscrire
      </a>
      <div style="text-align: center; margin-top: 10px; font-size: 14px; color: #6c757d;">
        Connectez-vous pour participer à cet événement
      </div>
    `;
    return;
  }

  if (isEventPassed) {
    container.innerHTML = `
      <button disabled style="padding: 15px 25px; background: #6c757d; color: white; border: none; border-radius: 8px; cursor: not-allowed; font-weight: bold; font-size: 16px;">
        ✅ Événement terminé
      </button>
    `;
    return;
  }

  try {
    const { data: isRegistered } = await database.isRegisteredToEvent(currentUser.id, currentEvent.id);
    
    if (isRegistered) {
      container.innerHTML = `
        <button onclick="unregisterFromEvent()" style="padding: 15px 25px; background: #dc3545; color: white; border: none; border-radius: 8px; cursor: pointer; font-weight: bold; font-size: 16px;">
          ❌ Se désinscrire
        </button>
        <div style="text-align: center; margin-top: 10px; font-size: 14px; color: #28a745;">
          ✅ Vous êtes inscrit à cet événement
        </div>
      `;
    } else {
      container.innerHTML = `
        <button onclick="registerToEvent()" style="padding: 15px 25px; background: #28a745; color: white; border: none; border-radius: 8px; cursor: pointer; font-weight: bold; font-size: 16px;">
          ✅ S'inscrire à l'événement
        </button>
        <div style="text-align: center; margin-top: 10px; font-size: 14px; color: #6c757d;">
          Rejoignez cet événement maintenant
        </div>
      `;
    }
  } catch (error) {
    container.innerHTML = `
      <div style="text-align: center; padding: 20px; color: #666;">
        Fonctionnalité d'inscription non disponible
      </div>
    `;
  }
}

// === ACTIONS ===

async function registerToEvent() {
  if (!currentUser || !currentEvent) return;
  
  try {
    const { error } = await database.registerToEvent(currentUser.id, currentEvent.id);
    
    if (error) {
      showMessage(`Erreur lors de l'inscription : ${error.message}`, 'error');
    } else {
      showMessage('Inscription réussie ! ', 'success');
      await loadParticipants();
      await updateActionButtons();
    }
  } catch (error) {
    showMessage(`Erreur inattendue : ${error.message}`, 'error');
  }
}

async function unregisterFromEvent() {
  if (!currentUser || !currentEvent) return;
  
  if (!confirm('Êtes-vous sûr de vouloir vous désinscrire de cet événement ?')) {
    return;
  }
  
  try {
    const { error } = await database.unregisterFromEvent(currentUser.id, currentEvent.id);
    
    if (error) {
      showMessage(`Erreur lors de la désinscription : ${error.message}`, 'error');
    } else {
      showMessage('Désinscription réussie', 'success');
      await loadParticipants();
      await updateActionButtons();
    }
  } catch (error) {
    showMessage(`Erreur inattendue : ${error.message}`, 'error');
  }
}

function showMessage(message, type) {
  const messageDiv = document.getElementById('message');
  if (!messageDiv) return;
  
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
window.handleLogout = handleLogout;
window.registerToEvent = registerToEvent;
window.unregisterFromEvent = unregisterFromEvent; 