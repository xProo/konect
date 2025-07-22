import { auth, database } from "../lib/supabase.js";
import { BrowserLink } from "../components/BrowserRouter.js";
import { createCommonNavbar, updateCommonUserDisplay, handleCommonLogout } from "../components/CommonNavbar.js";

export default function EventsPage() {
  // Initialiser la page après le rendu
  setTimeout(async () => {
    await loadPublicEvents();
    await updateCommonUserDisplay();
    
    // Écouter les changements d'authentification
    auth.onAuthStateChange((event, session) => {
      updateCommonUserDisplay();
      loadPublicEvents(); // Recharger pour mettre à jour les statuts d'inscription
    });
  }, 100);

  return {
    tag: "div",
    children: [
      createCommonNavbar(),
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
                attributes: [["style", { textAlign: "center", padding: "50px", color: "#666",  }]],
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
// Fonctions déplacées vers CommonNavbar.js

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
        <h3>Aucun événement trouvé</h3>
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
  
  // Ajouter le CSS pour les effets hover
  if (!document.getElementById('event-card-styles')) {
    const style = document.createElement('style');
    style.id = 'event-card-styles';
    style.textContent = `
      .event-card {
        transition: transform 0.3s ease, box-shadow 0.3s ease !important;
      }
      .event-card:hover {
        transform: translateY(-5px) !important;
        box-shadow: 0 10px 30px rgba(0,0,0,0.15) !important;
      }
    `;
    document.head.appendChild(style);
  }

  container.innerHTML = `
    <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(350px, 1fr)); gap: 30px;">
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
      <div class="event-card" style="border: 1px solid #ddd; border-radius: 20px; background: #fff; box-shadow: 0 6px 20px rgba(0,0,0,0.1); overflow: hidden; cursor: pointer;" onclick="goToEventDetail('${event.id}')">
      <!-- Image de l'événement -->
      <div style="height: 200px; ${event.image_url ? `background-image: url('${event.image_url}'); background-size: cover; background-position: center;` : 'background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);'} position: relative; display: flex; align-items: center; justify-content: center; color: white;">
        <div style="position: absolute; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.4);"></div>
        <div style="position: relative; text-align: center; z-index: 1;">
          <div style="font-size: 24px; font-weight: bold; padding: 0 20px; text-shadow: 1px 1px 2px rgba(0,0,0,0.7);">${event.title}</div>
        </div>
        
        <!-- Tags d'état -->
        <div style="position: absolute; top: 15px; right: 15px; display: flex; gap: 8px;">
          ${isEventPassed ? '<span style="padding: 4px 8px; background: rgba(248, 215, 218, 0.9); color: #721c24; border-radius: 15px; font-size: 11px; font-weight: bold;">✅ Terminé</span>' : ''}
          ${isFull ? '<span style="padding: 4px 8px; background: rgba(255, 243, 205, 0.9); color: #856404; border-radius: 15px; font-size: 11px; font-weight: bold;">🔒 Complet</span>' : ''}
          ${event.isRegistered ? '<span style="padding: 4px 8px; background: rgba(212, 237, 218, 0.9); color: #155724; border-radius: 15px; font-size: 11px; font-weight: bold;">✅ Inscrit</span>' : ''}
        </div>
      </div>
      
      <!-- Contenu de la carte -->
      <div style="padding: 25px;">
        <!-- Informations principales -->
        <div style="margin-bottom: 20px;">
          <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 8px; color: #666;">
            <span style="font-size: 16px;">📅</span>
            <span style="font-weight: 500;">${eventDate ? eventDate.toLocaleDateString('fr-FR', { weekday: 'short', day: 'numeric', month: 'short' }) : 'Date non définie'}</span>
          </div>
          
          <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 8px; color: #666;">
            <span style="font-size: 16px;">📍</span>
            <span style="font-weight: 500;">${event.location || 'Lieu non défini'}</span>
          </div>
          
          <div style="display: flex; align-items: center; gap: 8px; color: #007bff;">
            <span style="font-size: 16px;">👥</span>
            <span style="font-weight: 500;">${event.participantCount} participant${event.participantCount > 1 ? 's' : ''}</span>
          </div>
        </div>
        
        <!-- Description (tronquée) -->
        ${event.description ? `
          <p style="margin: 0 0 20px 0; color: #555; line-height: 1.5; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;">
            ${event.description}
          </p>
        ` : ''}
        
        <!-- Prix et action -->
        <div style="display: flex; justify-content: space-between; align-items: center; margin-top: auto;">
          <div style="display: flex; align-items: center; gap: 8px;">
            <span style="font-size: 18px; color: ${event.price > 0 ? '#28a745' : '#6c757d'};">${event.price > 0 ? '💰' : '🆓'}</span>
            <span style="font-weight: bold; color: ${event.price > 0 ? '#28a745' : '#6c757d'}; font-size: 18px;">
              ${event.price > 0 ? `${event.price}€` : 'Gratuit'}
            </span>
          </div>
          
          <div style="display: flex; gap: 10px;" onclick="event.stopPropagation();">
            ${!currentUser ? `
              <a href="/connexion" style="padding: 8px 16px; background: #007bff; color: white; border: none; border-radius: 20px; font-weight: bold; text-decoration: none; font-size: 14px;">
                🔐 Connexion
              </a>
            ` : isEventPassed ? `
              <button disabled style="padding: 8px 16px; background: #6c757d; color: white; border: none; border-radius: 20px; cursor: not-allowed; font-weight: bold; font-size: 14px;">
                ✅ Terminé
              </button>
            ` : event.isRegistered ? `
              <button onclick="unregisterFromEvent('${event.id}')" style="padding: 8px 16px; background: #dc3545; color: white; border: none; border-radius: 20px; cursor: pointer; font-weight: bold; font-size: 14px;">
                ❌ Se désinscrire
              </button>
            ` : isFull ? `
              <button disabled style="padding: 8px 16px; background: #6c757d; color: white; border: none; border-radius: 20px; cursor: not-allowed; font-weight: bold; font-size: 14px;">
                🔒 Complet
              </button>
            ` : `
              <button onclick="registerToEvent('${event.id}')" style="padding: 8px 16px; background: #28a745; color: white; border: none; border-radius: 20px; cursor: pointer; font-weight: bold; font-size: 14px;">
                ✅ S'inscrire
              </button>
            `}
          </div>
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

function goToEventDetail(eventId) {
  if (!eventId) {
    showMessage('ID d\'événement manquant', 'error');
    return;
  }
  
  // Rediriger vers la page de détail avec l'ID en paramètre
  window.history.pushState({}, '', `/event-detail?id=${eventId}`);
  const popStateEvent = new PopStateEvent('popstate', { state: {} });
  window.dispatchEvent(popStateEvent);
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
window.handleLogout = handleCommonLogout;
window.registerToEvent = registerToEvent;
window.unregisterFromEvent = unregisterFromEvent;
window.goToEventDetail = goToEventDetail;
window.closeEventDetailsModal = closeEventDetailsModal; 