import { auth, database } from "../lib/supabase.js";
import { BrowserLink } from "../components/BrowserRouter.js";

export default function EventsPage() {
  // Initialiser la page après le rendu
  setTimeout(async () => {
    await loadPublicEvents();
    await updateUserDisplay();
    
    // Écouter les changements d'authentification
    auth.onAuthStateChange((event, session) => {
      updateUserDisplay();
      loadPublicEvents(); // Recharger pour mettre à jour les statuts d'inscription
    });
  }, 100);

  return {
    tag: "div",
    children: [
      createNavbar(),
      {
        tag: "div",
        attributes: [["style", { padding: "20px", maxWidth: "1200px", margin: "0 auto" }]],
        children: [
          // Header
          {
            tag: "div",
            attributes: [["style", { textAlign: "center", marginBottom: "40px" }]],
            children: [
              {
                tag: "h1",
                attributes: [["style", { color: "#333", marginBottom: "10px", fontSize: "2.5rem" }]],
                children: ["🎉 Événements Publics"]
              },
              {
                tag: "p",
                attributes: [["style", { color: "#666", fontSize: "1.2rem", margin: "0" }]],
                children: ["Découvrez et participez aux événements de notre communauté"]
              }
            ]
          },

          // Messages
          {
            tag: "div",
            attributes: [["id", "message"], ["style", { padding: "10px", marginBottom: "20px", borderRadius: "5px", display: "none" }]],
            children: []
          },

          // Filtres
          {
            tag: "div",
            attributes: [["style", { 
              background: "#f8f9fa", 
              padding: "20px", 
              borderRadius: "10px", 
              marginBottom: "30px",
              border: "1px solid #dee2e6"
            }]],
            children: [
              {
                tag: "h3",
                attributes: [["style", { margin: "0 0 15px 0", color: "#333" }]],
                children: ["🔍 Filtrer les événements"]
              },
              {
                tag: "div",
                attributes: [["style", { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "15px" }]],
                children: [
                  {
                    tag: "div",
                    children: [
                      {
                        tag: "label",
                        attributes: [["style", { display: "block", marginBottom: "5px", fontWeight: "bold", color: "#333" }]],
                        children: ["Rechercher"]
                      },
                      {
                        tag: "input",
                        attributes: [
                          ["type", "text"],
                          ["id", "search-input"],
                          ["placeholder", "Nom de l'événement..."],
                          ["style", { width: "100%", padding: "8px", border: "1px solid #ddd", borderRadius: "5px", boxSizing: "border-box" }]
                        ],
                        events: {
                          input: [() => filterEvents()]
                        }
                      }
                    ]
                  },
                  {
                    tag: "div",
                    children: [
                      {
                        tag: "label",
                        attributes: [["style", { display: "block", marginBottom: "5px", fontWeight: "bold", color: "#333" }]],
                        children: ["Prix"]
                      },
                      {
                        tag: "select",
                        attributes: [
                          ["id", "price-filter"],
                          ["style", { width: "100%", padding: "8px", border: "1px solid #ddd", borderRadius: "5px" }]
                        ],
                        events: {
                          change: [() => filterEvents()]
                        },
                        children: [
                          { tag: "option", attributes: [["value", ""]], children: ["Tous"] },
                          { tag: "option", attributes: [["value", "free"]], children: ["Gratuit"] },
                          { tag: "option", attributes: [["value", "paid"]], children: ["Payant"] }
                        ]
                      }
                    ]
                  },
                  {
                    tag: "div",
                    children: [
                      {
                        tag: "label",
                        attributes: [["style", { display: "block", marginBottom: "5px", fontWeight: "bold", color: "#333" }]],
                        children: ["Date"]
                      },
                      {
                        tag: "select",
                        attributes: [
                          ["id", "date-filter"],
                          ["style", { width: "100%", padding: "8px", border: "1px solid #ddd", borderRadius: "5px" }]
                        ],
                        events: {
                          change: [() => filterEvents()]
                        },
                        children: [
                          { tag: "option", attributes: [["value", ""]], children: ["Toutes les dates"] },
                          { tag: "option", attributes: [["value", "today"]], children: ["Aujourd'hui"] },
                          { tag: "option", attributes: [["value", "week"]], children: ["Cette semaine"] },
                          { tag: "option", attributes: [["value", "month"]], children: ["Ce mois"] }
                        ]
                      }
                    ]
                  }
                ]
              }
            ]
          },

          // Liste des événements
          {
            tag: "div",
            attributes: [["id", "events-container"], ["style", { minHeight: "400px" }]],
            children: [
              {
                tag: "div",
                attributes: [["style", { textAlign: "center", padding: "50px", color: "#666" }]],
                children: ["Chargement des événements..."]
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
                title: "🎉 Événements",
                style: "text-decoration: none; font-weight: bold; color: #28a745; font-size: 16px;"
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
      <span style="color: #28a745; font-weight: bold;">👋 ${displayName}</span>
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

// === GESTION DES ÉVÉNEMENTS ===

let allEvents = [];
let currentUser = null;

async function loadPublicEvents() {
  try {
    // Récupérer l'utilisateur actuel
    const { data: { user } } = await auth.getCurrentUser();
    currentUser = user;
    
    // Récupérer tous les événements publics
    const { data: events, error } = await database.getEvents();
    
    if (error) {
      showMessage(`Erreur lors du chargement des événements : ${error.message}`, 'error');
      return;
    }
    
    // Filtrer seulement les événements publics
    allEvents = (events || []).filter(event => event.is_public);
    
    await displayEvents(allEvents);
    
  } catch (error) {
    showMessage(`Erreur inattendue : ${error.message}`, 'error');
  }
}

async function displayEvents(events) {
  const container = document.getElementById('events-container');
  
  if (!container) return;
  
  if (events.length === 0) {
    container.innerHTML = `
      <div style="text-align: center; padding: 50px; color: #666;">
        <h3>😔 Aucun événement trouvé</h3>
        <p>Il n'y a pas d'événements publics pour le moment.</p>
      </div>
    `;
    return;
  }
  
  // Récupérer les statuts d'inscription pour l'utilisateur actuel
  const eventsWithStatus = await Promise.all(
    events.map(async (event) => {
      try {
        let isRegistered = false;
        let participantCount = 0;
        
        if (currentUser) {
          const { data: registrationStatus } = await database.isRegisteredToEvent(currentUser.id, event.id);
          isRegistered = registrationStatus;
        }
        
        const { data: participants } = await database.getEventParticipants(event.id);
        participantCount = participants?.length || 0;
        
        return { ...event, isRegistered, participantCount };
      } catch (error) {
        return { ...event, isRegistered: false, participantCount: 0 };
      }
    })
  );
  
  container.innerHTML = `
    <div style="display: grid; gap: 25px;">
      ${eventsWithStatus.map(event => createEventCard(event)).join('')}
    </div>
  `;
}

function createEventCard(event) {
  const eventDate = event.date ? new Date(event.date) : null;
  const isEventPassed = eventDate && eventDate < new Date();
  const canRegister = currentUser && !isEventPassed && !event.isRegistered;
  const isFull = event.max_participants && event.participantCount >= event.max_participants;
  
  return `
    <div style="border: 1px solid #ddd; border-radius: 15px; padding: 25px; background: #fff; box-shadow: 0 4px 6px rgba(0,0,0,0.1); transition: transform 0.2s;">
      <div style="display: flex; justify-content: between; align-items: start; margin-bottom: 20px; flex-wrap: wrap; gap: 20px;">
        <div style="flex: 1; min-width: 300px;">
          <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 10px;">
            <h3 style="margin: 0; color: #333; font-size: 1.5rem;">${event.title}</h3>
            ${isEventPassed ? '<span style="padding: 3px 8px; background: #f8d7da; color: #721c24; border-radius: 12px; font-size: 12px; font-weight: bold;">✅ Terminé</span>' : ''}
            ${isFull ? '<span style="padding: 3px 8px; background: #fff3cd; color: #856404; border-radius: 12px; font-size: 12px; font-weight: bold;">🔒 Complet</span>' : ''}
          </div>
          
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 10px; margin-bottom: 15px;">
            <div style="display: flex; align-items: center; gap: 8px; color: #666;">
              <span>📅</span>
              <span>${eventDate ? eventDate.toLocaleDateString('fr-FR') : 'Date non définie'}</span>
              ${event.time ? `<span style="color: #888;">à ${event.time}</span>` : ''}
            </div>
            <div style="display: flex; align-items: center; gap: 8px; color: #666;">
              <span>📍</span>
              <span>${event.location || 'Lieu non défini'}</span>
            </div>
            <div style="display: flex; align-items: center; gap: 8px; color: #007bff;">
              <span>👥</span>
              <span>${event.participantCount} participant${event.participantCount > 1 ? 's' : ''}${event.max_participants ? ` / ${event.max_participants}` : ''}</span>
            </div>
            <div style="display: flex; align-items: center; gap: 8px; color: ${event.price > 0 ? '#28a745' : '#6c757d'}; font-weight: bold;">
              <span>${event.price > 0 ? '💰' : '🆓'}</span>
              <span>${event.price > 0 ? `${event.price}€` : 'Gratuit'}</span>
            </div>
          </div>
          
          ${event.description ? `<p style="margin: 0; color: #555; font-style: italic; line-height: 1.5;">${event.description}</p>` : ''}
        </div>
        
        <div style="display: flex; flex-direction: column; gap: 10px; min-width: 150px;">
          ${!currentUser ? `
            <a href="/connexion" style="padding: 12px 20px; background: #007bff; color: white; border: none; border-radius: 8px; cursor: pointer; font-weight: bold; text-decoration: none; text-align: center;">
              🔐 Se connecter pour s'inscrire
            </a>
          ` : isEventPassed ? `
            <button disabled style="padding: 12px 20px; background: #6c757d; color: white; border: none; border-radius: 8px; cursor: not-allowed; font-weight: bold;">
              ✅ Événement terminé
            </button>
          ` : event.isRegistered ? `
            <button onclick="unregisterFromEvent('${event.id}')" style="padding: 12px 20px; background: #dc3545; color: white; border: none; border-radius: 8px; cursor: pointer; font-weight: bold;">
              ❌ Se désinscrire
            </button>
          ` : isFull ? `
            <button disabled style="padding: 12px 20px; background: #6c757d; color: white; border: none; border-radius: 8px; cursor: not-allowed; font-weight: bold;">
              🔒 Complet
            </button>
          ` : `
            <button onclick="registerToEvent('${event.id}')" style="padding: 12px 20px; background: #28a745; color: white; border: none; border-radius: 8px; cursor: pointer; font-weight: bold;">
              ✅ S'inscrire
            </button>
          `}
          
          <button onclick="viewEventDetails('${event.id}')" style="padding: 8px 15px; background: #6c757d; color: white; border: none; border-radius: 8px; cursor: pointer; font-size: 14px;">
            👁️ Détails
          </button>
        </div>
      </div>
    </div>
  `;
}

// === ACTIONS ===

async function registerToEvent(eventId) {
  if (!currentUser) {
    showMessage('Vous devez être connecté pour vous inscrire', 'error');
    return;
  }
  
  try {
    const { error } = await database.registerToEvent(currentUser.id, eventId);
    
    if (error) {
      showMessage(`Erreur lors de l'inscription : ${error.message}`, 'error');
    } else {
      showMessage('Inscription réussie ! 🎉', 'success');
      await loadPublicEvents(); // Recharger pour mettre à jour les statuts
    }
  } catch (error) {
    showMessage(`Erreur inattendue : ${error.message}`, 'error');
  }
}

async function unregisterFromEvent(eventId) {
  if (!currentUser) {
    showMessage('Vous devez être connecté', 'error');
    return;
  }
  
  if (!confirm('Êtes-vous sûr de vouloir vous désinscrire de cet événement ?')) {
    return;
  }
  
  try {
    const { error } = await database.unregisterFromEvent(currentUser.id, eventId);
    
    if (error) {
      showMessage(`Erreur lors de la désinscription : ${error.message}`, 'error');
    } else {
      showMessage('Désinscription réussie', 'success');
      await loadPublicEvents(); // Recharger pour mettre à jour les statuts
    }
  } catch (error) {
    showMessage(`Erreur inattendue : ${error.message}`, 'error');
  }
}

function viewEventDetails(eventId) {
  const event = allEvents.find(e => e.id === eventId);
  if (!event) {
    showMessage('Événement non trouvé', 'error');
    return;
  }
  
  showEventDetailsModal(event);
}

// === FILTRES ===

function filterEvents() {
  const searchTerm = document.getElementById('search-input').value.toLowerCase();
  const priceFilter = document.getElementById('price-filter').value;
  const dateFilter = document.getElementById('date-filter').value;
  
  let filteredEvents = [...allEvents];
  
  // Filtre par recherche
  if (searchTerm) {
    filteredEvents = filteredEvents.filter(event =>
      event.title.toLowerCase().includes(searchTerm) ||
      (event.description && event.description.toLowerCase().includes(searchTerm)) ||
      (event.location && event.location.toLowerCase().includes(searchTerm))
    );
  }
  
  // Filtre par prix
  if (priceFilter === 'free') {
    filteredEvents = filteredEvents.filter(event => !event.price || event.price == 0);
  } else if (priceFilter === 'paid') {
    filteredEvents = filteredEvents.filter(event => event.price && event.price > 0);
  }
  
  // Filtre par date
  if (dateFilter) {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const oneWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
    const oneMonth = new Date(today.getFullYear(), today.getMonth() + 1, today.getDate());
    
    filteredEvents = filteredEvents.filter(event => {
      if (!event.date) return false;
      const eventDate = new Date(event.date);
      
      switch (dateFilter) {
        case 'today':
          return eventDate.toDateString() === today.toDateString();
        case 'week':
          return eventDate >= today && eventDate <= oneWeek;
        case 'month':
          return eventDate >= today && eventDate <= oneMonth;
        default:
          return true;
      }
    });
  }
  
  displayEvents(filteredEvents);
}

// === MODALS ===

function showEventDetailsModal(event) {
  const modalId = 'event-details-modal';
  
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
    align-items: center; z-index: 1000;
  `;
  
  const eventDate = event.date ? new Date(event.date) : null;
  
  modal.innerHTML = `
    <div style="background: white; padding: 30px; border-radius: 15px; width: 90%; max-width: 600px; max-height: 80vh; overflow-y: auto;">
      <h2 style="margin: 0 0 20px 0; color: #333; font-size: 1.8rem;">
        📅 ${event.title}
      </h2>
      
      <div style="display: grid; gap: 15px; margin-bottom: 20px;">
        <div style="display: flex; align-items: center; gap: 10px;">
          <span style="font-size: 1.2rem;">📅</span>
          <strong>Date:</strong>
          <span>${eventDate ? eventDate.toLocaleDateString('fr-FR') : 'Date non définie'}</span>
          ${event.time ? `<span style="color: #666;">à ${event.time}</span>` : ''}
        </div>
        
        <div style="display: flex; align-items: center; gap: 10px;">
          <span style="font-size: 1.2rem;">📍</span>
          <strong>Lieu:</strong>
          <span>${event.location || 'Lieu non défini'}</span>
        </div>
        
        <div style="display: flex; align-items: center; gap: 10px;">
          <span style="font-size: 1.2rem;">${event.price > 0 ? '💰' : '🆓'}</span>
          <strong>Prix:</strong>
          <span style="color: ${event.price > 0 ? '#28a745' : '#6c757d'}; font-weight: bold;">
            ${event.price > 0 ? `${event.price}€` : 'Gratuit'}
          </span>
        </div>
        
        ${event.max_participants ? `
          <div style="display: flex; align-items: center; gap: 10px;">
            <span style="font-size: 1.2rem;">👥</span>
            <strong>Places disponibles:</strong>
            <span>${event.max_participants} participants maximum</span>
          </div>
        ` : ''}
      </div>
      
      ${event.description ? `
        <div style="margin-bottom: 20px;">
          <h3 style="color: #333; margin-bottom: 10px;">📝 Description</h3>
          <p style="color: #555; line-height: 1.6; background: #f8f9fa; padding: 15px; border-radius: 8px;">
            ${event.description}
          </p>
        </div>
      ` : ''}
      
      <div style="display: flex; justify-content: flex-end; gap: 10px;">
        <button type="button" onclick="closeEventDetailsModal()" 
                style="padding: 10px 20px; background: #6c757d; color: white; border: none; border-radius: 8px; cursor: pointer;">
          Fermer
        </button>
      </div>
    </div>
  `;
  
  document.body.appendChild(modal);
  
  // Fermer le modal en cliquant à l'extérieur
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      closeEventDetailsModal();
    }
  });
}

function closeEventDetailsModal() {
  const modal = document.getElementById('event-details-modal');
  if (modal) {
    modal.remove();
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
window.viewEventDetails = viewEventDetails;
window.closeEventDetailsModal = closeEventDetailsModal; 