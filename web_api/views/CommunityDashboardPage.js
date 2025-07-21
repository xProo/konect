import { auth, database } from "../lib/supabase.js";
import { BrowserLink } from "../components/BrowserRouter.js";

export default function CommunityDashboardPage() {
  // Récupérer l'ID de la communauté depuis les paramètres de l'URL
  const urlParams = new URLSearchParams(window.location.search);
  const communityId = urlParams.get('id');

  // Initialiser la page après le rendu
  setTimeout(async () => {
    await loadDashboard(communityId);
    // Écouter les changements d'authentification
    auth.onAuthStateChange((event, session) => {
      if (session) {
        loadDashboard(communityId);
      } else {
        // Rediriger vers connexion si non connecté
        window.history.pushState({}, '', '/connexion');
        const popStateEvent = new PopStateEvent('popstate', { state: {} });
        window.dispatchEvent(popStateEvent);
      }
    });
  }, 100);

  return {
    tag: "div",
    attributes: [["style", { padding: "20px", maxWidth: "1200px", margin: "0 auto" }]],
    children: [
      // Navigation
      {
        tag: "nav",
        attributes: [["style", { marginBottom: "30px", padding: "15px", backgroundColor: "#f8f9fa", borderRadius: "5px", textAlign: "center" }]],
        children: [
          BrowserLink({ link: "/", title: "Accueil" }),
          " | ",
          BrowserLink({ link: "/communities", title: "Mes Communautés" }),
          " | ",
          BrowserLink({ link: "/connexion", title: "Connexion" })
        ]
      },

      // Titre et informations de base
      {
        tag: "div",
        attributes: [["id", "community-header"], ["style", { marginBottom: "30px", textAlign: "center" }]],
        children: [
          {
            tag: "h1",
            attributes: [["style", { color: "#333", marginBottom: "10px" }]],
            children: ["📊 Dashboard Communauté"]
          },
          {
            tag: "div",
            attributes: [["style", { color: "#666", fontSize: "14px" }]],
            children: ["Chargement des informations..."]
          }
        ]
      },

      // Messages
      {
        tag: "div",
        attributes: [["id", "message"], ["style", { padding: "10px", marginBottom: "20px", borderRadius: "5px", display: "none" }]],
        children: []
      },

      // Statistiques principales
      {
        tag: "div",
        attributes: [["style", { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "20px", marginBottom: "40px" }]],
        children: [
          // Carte Membres
          {
            tag: "div",
            attributes: [["style", { padding: "25px", backgroundColor: "#e8f5e8", border: "1px solid #28a745", borderRadius: "10px", textAlign: "center", boxShadow: "0 2px 10px rgba(0,0,0,0.1)" }]],
            children: [
              {
                tag: "div",
                attributes: [["style", { fontSize: "48px", marginBottom: "10px" }]],
                children: ["👥"]
              },
              {
                tag: "h3",
                attributes: [["style", { margin: "0 0 10px 0", color: "#28a745" }]],
                children: ["Membres"]
              },
              {
                tag: "div",
                attributes: [["id", "members-count"], ["style", { fontSize: "32px", fontWeight: "bold", color: "#333" }]],
                children: ["..."]
              }
            ]
          },

          // Carte Événements
          {
            tag: "div",
            attributes: [["style", { padding: "25px", backgroundColor: "#e3f2fd", border: "1px solid #007bff", borderRadius: "10px", textAlign: "center", boxShadow: "0 2px 10px rgba(0,0,0,0.1)" }]],
            children: [
              {
                tag: "div",
                attributes: [["style", { fontSize: "48px", marginBottom: "10px" }]],
                children: ["📅"]
              },
              {
                tag: "h3",
                attributes: [["style", { margin: "0 0 10px 0", color: "#007bff" }]],
                children: ["Événements"]
              },
              {
                tag: "div",
                attributes: [["id", "events-count"], ["style", { fontSize: "32px", fontWeight: "bold", color: "#333" }]],
                children: ["..."]
              }
            ]
          },

          // Carte Statut
          {
            tag: "div",
            attributes: [["style", { padding: "25px", backgroundColor: "#fff3cd", border: "1px solid #ffc107", borderRadius: "10px", textAlign: "center", boxShadow: "0 2px 10px rgba(0,0,0,0.1)" }]],
            children: [
              {
                tag: "div",
                attributes: [["style", { fontSize: "48px", marginBottom: "10px" }]],
                children: ["✨"]
              },
              {
                tag: "h3",
                attributes: [["style", { margin: "0 0 10px 0", color: "#856404" }]],
                children: ["Statut"]
              },
              {
                tag: "div",
                attributes: [["style", { fontSize: "18px", fontWeight: "bold", color: "#333" }]],
                children: ["Active"]
              }
            ]
          }
        ]
      },

      // Section Actions rapides
      {
        tag: "div",
        attributes: [["style", { marginBottom: "40px", padding: "25px", backgroundColor: "#fff", border: "1px solid #ddd", borderRadius: "10px", boxShadow: "0 2px 10px rgba(0,0,0,0.1)" }]],
        children: [
          {
            tag: "h2",
            attributes: [["style", { color: "#333", marginBottom: "20px", borderBottom: "2px solid #007bff", paddingBottom: "10px" }]],
            children: ["🚀 Actions rapides"]
          },
          
          {
            tag: "div",
            attributes: [["style", { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "15px" }]],
            children: [
              {
                tag: "button",
                attributes: [
                  ["onclick", "createCommunityEvent()"],
                  ["style", { 
                    padding: "15px", 
                    backgroundColor: "#28a745", 
                    color: "white", 
                    border: "none", 
                    borderRadius: "8px", 
                    cursor: "pointer",
                    fontWeight: "bold",
                    fontSize: "16px"
                  }]
                ],
                children: ["📅 Créer un événement"]
              },
              {
                tag: "button",
                attributes: [
                  ["onclick", "inviteMembers()"],
                  ["style", { 
                    padding: "15px", 
                    backgroundColor: "#007bff", 
                    color: "white", 
                    border: "none", 
                    borderRadius: "8px", 
                    cursor: "pointer",
                    fontWeight: "bold",
                    fontSize: "16px"
                  }]
                ],
                children: ["👥 Inviter des membres"]
              },
              {
                tag: "button",
                attributes: [
                  ["onclick", "editCommunity()"],
                  ["style", { 
                    padding: "15px", 
                    backgroundColor: "#ffc107", 
                    color: "#333", 
                    border: "none", 
                    borderRadius: "8px", 
                    cursor: "pointer",
                    fontWeight: "bold",
                    fontSize: "16px"
                  }]
                ],
                children: ["✏️ Modifier la communauté"]
              },
              {
                tag: "button",
                attributes: [
                  ["onclick", "viewPublicPage()"],
                  ["style", { 
                    padding: "15px", 
                    backgroundColor: "#6c757d", 
                    color: "white", 
                    border: "none", 
                    borderRadius: "8px", 
                    cursor: "pointer",
                    fontWeight: "bold",
                    fontSize: "16px"
                  }]
                ],
                children: ["🌐 Voir page publique"]
              }
            ]
          }
        ]
      },

      // Section Membres
      {
        tag: "div",
        attributes: [["style", { marginBottom: "40px", padding: "25px", backgroundColor: "#fff", border: "1px solid #ddd", borderRadius: "10px", boxShadow: "0 2px 10px rgba(0,0,0,0.1)" }]],
        children: [
          {
            tag: "h2",
            attributes: [["style", { color: "#28a745", marginBottom: "20px", borderBottom: "2px solid #28a745", paddingBottom: "10px" }]],
            children: ["👥 Gestion des membres"]
          },

          {
            tag: "div",
            attributes: [["id", "members-list"], ["style", { minHeight: "200px" }]],
            children: [
              {
                tag: "div",
                attributes: [["style", { textAlign: "center", padding: "50px", color: "#666" }]],
                children: ["Chargement des membres..."]
              }
            ]
          }
        ]
      },

      // Section Événements
      {
        tag: "div",
        attributes: [["style", { padding: "25px", backgroundColor: "#fff", border: "1px solid #ddd", borderRadius: "10px", boxShadow: "0 2px 10px rgba(0,0,0,0.1)" }]],
        children: [
          {
            tag: "h2",
            attributes: [["style", { color: "#007bff", marginBottom: "20px", borderBottom: "2px solid #007bff", paddingBottom: "10px" }]],
            children: ["📅 Événements de la communauté"]
          },

          {
            tag: "div",
            attributes: [["id", "events-list"], ["style", { minHeight: "200px" }]],
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
    <h1 style="color: #333; margin-bottom: 10px;">📊 Dashboard - ${community.name}</h1>
    <div style="color: #666; font-size: 16px; margin-bottom: 10px;">
      <span style="background: #e9ecef; padding: 5px 10px; border-radius: 15px; margin-right: 10px;">
        ${community.category}
      </span>
      📍 ${community.location}
    </div>
    <p style="color: #555; font-style: italic; margin: 0;">${community.description}</p>
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
      <div style="text-align: center; padding: 50px; color: #666;">
        <p>👥 Aucun membre pour le moment.</p>
        <p>Invitez des personnes à rejoindre votre communauté !</p>
      </div>
    `;
    return;
  }

  container.innerHTML = `
    <div style="display: grid; gap: 15px;">
      ${members.map(member => `
        <div style="display: flex; justify-content: space-between; align-items: center; padding: 15px; border: 1px solid #ddd; border-radius: 8px; background: #f9f9f9;">
          <div>
            <strong style="color: #333;">${member.user_profiles?.full_name || member.user_profiles?.email || 'Utilisateur'}</strong>
            <div style="color: #666; font-size: 14px;">
              ${member.user_profiles?.email || 'Email non disponible'}
              ${member.user_profiles?.prenom && member.user_profiles?.nom ? 
                ` (${member.user_profiles.prenom} ${member.user_profiles.nom})` : ''}
            </div>
            <div style="color: #888; font-size: 12px;">Membre depuis : ${new Date(member.joined_at).toLocaleDateString('fr-FR')}</div>
          </div>
          <div style="display: flex; gap: 10px;">
            <button onclick="removeMember('${member.user_id}')" style="padding: 8px 15px; background: #dc3545; color: white; border: none; border-radius: 5px; cursor: pointer; font-size: 14px;">
              🗑️ Retirer
            </button>
          </div>
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
      <div style="text-align: center; padding: 50px; color: #666;">
        <p>📅 Aucun événement créé pour le moment.</p>
        <p>Commencez par créer votre premier événement !</p>
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
        <div style="border: 1px solid #ddd; border-radius: 10px; padding: 20px; background: #f9f9f9;">
          <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 15px;">
            <div style="flex: 1;">
              <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 10px;">
                <h3 style="margin: 0; color: #333;">${event.title || 'Événement sans titre'}</h3>
              </div>
              <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 10px; margin-bottom: 10px;">
                <p style="margin: 0; color: #666;">📅 ${event.date ? new Date(event.date).toLocaleDateString('fr-FR') : 'Date non définie'}</p>
                <p style="margin: 0; color: #888;">📍 ${event.location || 'Lieu non défini'}</p>
                <p style="margin: 0; color: #007bff;">👥 ${event.participantCount} participant${event.participantCount > 1 ? 's' : ''}</p>
              </div>
            </div>
            <div style="display: flex; flex-direction: column; gap: 10px;">
              <div style="display: flex; gap: 10px;">
                <button onclick="editEvent('${event.id}')" style="padding: 8px 15px; background: #ffc107; color: #333; border: none; border-radius: 5px; cursor: pointer; font-weight: bold;">
                  ✏️ Modifier
                </button>
                <button onclick="deleteEvent('${event.id}')" style="padding: 8px 15px; background: #dc3545; color: white; border: none; border-radius: 5px; cursor: pointer; font-weight: bold;">
                  🗑️ Supprimer
                </button>
              </div>
              <button onclick="viewEventParticipants('${event.id}')" style="padding: 8px 15px; background: #007bff; color: white; border: none; border-radius: 5px; cursor: pointer; font-weight: bold; font-size: 14px;">
                👥 Voir participants
              </button>
            </div>
          </div>
          <p style="margin: 0; color: #555; font-style: italic;">${event.description || 'Aucune description'}</p>
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
    align-items: center; z-index: 1000;
  `;
  
  modal.innerHTML = `
    <div style="background: white; padding: 30px; border-radius: 10px; width: 90%; max-width: 600px; max-height: 90vh; overflow-y: auto;">
      <h2 style="margin: 0 0 20px 0; color: #333;">
        ${isEdit ? '✏️ Modifier l\'événement' : '📅 Créer un nouvel événement'}
      </h2>
      
      <form id="event-form">
        <div style="margin-bottom: 15px;">
          <label style="display: block; margin-bottom: 5px; font-weight: bold; color: #333;">Titre *</label>
          <input type="text" id="event-title" required 
                 style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 5px; box-sizing: border-box;"
                 value="${eventToEdit?.title || ''}" placeholder="Nom de l'événement">
        </div>
        
        <div style="margin-bottom: 15px;">
          <label style="display: block; margin-bottom: 5px; font-weight: bold; color: #333;">Description</label>
          <textarea id="event-description" rows="3"
                    style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 5px; box-sizing: border-box; resize: vertical;"
                    placeholder="Description de l'événement">${eventToEdit?.description || ''}</textarea>
        </div>
        
        <div style="margin-bottom: 15px;">
          <label style="display: block; margin-bottom: 5px; font-weight: bold; color: #333;">Date *</label>
          <input type="date" id="event-date" required
                 style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 5px; box-sizing: border-box;"
                 value="${eventToEdit?.date ? eventToEdit.date.split('T')[0] : ''}">
        </div>
        
        <div style="margin-bottom: 15px;">
          <label style="display: block; margin-bottom: 5px; font-weight: bold; color: #333;">Lieu *</label>
          <input type="text" id="event-location" required
                 style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 5px; box-sizing: border-box;"
                 value="${eventToEdit?.location || ''}" placeholder="Adresse ou lieu de l'événement">
        </div>
        

        
        <div style="display: flex; gap: 10px; justify-content: flex-end;">
          <button type="button" onclick="closeEventModal()" 
                  style="padding: 10px 20px; background: #6c757d; color: white; border: none; border-radius: 5px; cursor: pointer;">
            Annuler
          </button>
          <button type="submit"
                  style="padding: 10px 20px; background: #007bff; color: white; border: none; border-radius: 5px; cursor: pointer; font-weight: bold;">
            ${isEdit ? '✏️ Mettre à jour' : '📅 Créer l\'événement'}
          </button>
        </div>
      </form>
    </div>
  `;
  
  document.body.appendChild(modal);
  
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
  
  const eventData = {
    title: document.getElementById('event-title').value.trim(),
    description: document.getElementById('event-description').value.trim(),
    date: document.getElementById('event-date').value,
    location: document.getElementById('event-location').value.trim(),
    community_id: communityId
  };
  
  // Validation
  if (!eventData.title || !eventData.date || !eventData.location) {
    showMessage('Veuillez remplir tous les champs obligatoires', 'error');
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
    } else {
      showMessage(`Événement ${isEdit ? 'modifié' : 'créé'} avec succès !`, 'success');
      closeEventModal();
      // Recharger les événements
      await loadEvents(communityId);
      await loadStatistics(communityId);
    }
  } catch (error) {
    showMessage(`Erreur inattendue : ${error.message}`, 'error');
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
    align-items: center; z-index: 1000;
  `;
  
  modal.innerHTML = `
    <div style="background: white; padding: 30px; border-radius: 10px; width: 90%; max-width: 600px; max-height: 80vh; overflow-y: auto;">
      <h2 style="margin: 0 0 20px 0; color: #333;">
        👥 Participants à l'événement (${participants.length})
      </h2>
      
      ${participants.length === 0 ? `
        <div style="text-align: center; padding: 40px; color: #666;">
          <p>Aucun participant pour le moment</p>
        </div>
      ` : `
        <div style="display: grid; gap: 15px; margin-bottom: 20px;">
          ${participants.map(participant => `
            <div style="display: flex; justify-content: space-between; align-items: center; padding: 15px; border: 1px solid #ddd; border-radius: 8px; background: #f9f9f9;">
              <div>
                <strong style="color: #333;">${participant.user_profiles?.full_name || participant.user_profiles?.email || 'Utilisateur'}</strong>
                <div style="color: #666; font-size: 14px;">${participant.user_profiles?.email || 'Email non disponible'}</div>
                <div style="color: #888; font-size: 12px;">Inscrit le : ${new Date(participant.registered_at).toLocaleDateString('fr-FR')}</div>
              </div>
            </div>
          `).join('')}
        </div>
      `}
      
      <div style="display: flex; justify-content: flex-end;">
        <button type="button" onclick="closeParticipantsModal()" 
                style="padding: 10px 20px; background: #6c757d; color: white; border: none; border-radius: 5px; cursor: pointer;">
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