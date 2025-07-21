import { auth, database } from "../lib/supabase.js";
import { BrowserLink } from "../components/BrowserRouter.js";
import { createCommonNavbar, updateCommonUserDisplay, handleCommonLogout } from "../components/CommonNavbar.js";

export default function CommunityManagePage() {
  // Initialiser la page après le rendu
  setTimeout(async () => {
    await loadUserCommunities();
    await updateCommonUserDisplay();
    
    // Écouter les changements d'authentification
    auth.onAuthStateChange((event, session) => {
      if (session) {
        loadUserCommunities();
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
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)", 
          padding: "80px 20px", 
          color: "white", 
          textAlign: "center" 
        }]],
        children: [
          {
            tag: "div",
            attributes: [["style", { maxWidth: "1200px", margin: "0 auto" }]],
            children: [
              {
                tag: "h1",
                attributes: [["style", { 
                  fontSize: "3rem", 
                  fontWeight: "300", 
                  margin: "0 0 20px 0",
                  letterSpacing: "-1px"
                }]],
                children: ["Mes Communautés"]
              },
              {
                tag: "p",
                attributes: [["style", { 
                  fontSize: "1.2rem", 
                  margin: "0", 
                  opacity: "0.9",
                  fontWeight: "300"
                }]],
                children: ["Créez et gérez vos communautés en toute simplicité"]
              }
            ]
          }
        ]
      },

      // Main Content
      {
        tag: "div",
        attributes: [["style", { 
          maxWidth: "1200px", 
          margin: "0 auto", 
          padding: "60px 20px",
          backgroundColor: "#f8f9fa",
          minHeight: "100vh"
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

          // Quick Actions
          {
            tag: "div",
            attributes: [["style", { marginBottom: "50px" }]],
            children: [
              {
                tag: "div",
                attributes: [["style", { 
                  display: "flex", 
                  justifyContent: "space-between", 
                  alignItems: "center", 
                  marginBottom: "30px" 
                }]],
                children: [
                  {
                    tag: "h2",
                    attributes: [["style", { 
                      fontSize: "1.8rem", 
                      fontWeight: "600", 
                      color: "#2c3e50", 
                      margin: "0" 
                    }]],
                    children: ["Actions rapides"]
                  }
                ]
              },
              
              {
                tag: "div",
                attributes: [["style", { 
                  display: "grid", 
                  gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", 
                  gap: "20px" 
                }]],
                children: [
                  // Créer une communauté
                  {
                    tag: "div",
                    attributes: [["style", { 
                      backgroundColor: "white", 
                      padding: "30px", 
                      borderRadius: "12px", 
                      boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
                      border: "1px solid #e9ecef",
                      transition: "transform 0.2s ease, box-shadow 0.2s ease",
                      cursor: "pointer"
                    }]],
                    events: {
                      click: [() => showCreateCommunityForm()]
                    },
                    children: [
                      {
                        tag: "div",
                        attributes: [["style", { 
                          width: "60px", 
                          height: "60px", 
                          borderRadius: "50%", 
                          backgroundColor: "#667eea", 
                          display: "flex", 
                          alignItems: "center", 
                          justifyContent: "center", 
                          marginBottom: "20px" 
                        }]],
                        children: [
                          {
                            tag: "svg",
                            attributes: [
                              ["width", "24"],
                              ["height", "24"],
                              ["fill", "white"],
                              ["viewBox", "0 0 24 24"]
                            ],
                            children: [
                              {
                                tag: "path",
                                attributes: [["d", "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm5 11h-4v4h-2v-4H7v-2h4V7h2v4h4v2z"]]
                              }
                            ]
                          }
                        ]
                      },
                      {
                        tag: "h3",
                        attributes: [["style", { 
                          fontSize: "1.3rem", 
                          fontWeight: "600", 
                          color: "#2c3e50", 
                          marginBottom: "10px" 
                        }]],
                        children: ["Créer une communauté"]
                      },
                      {
                        tag: "p",
                        attributes: [["style", { 
                          color: "#6c757d", 
                          margin: "0", 
                          lineHeight: "1.5" 
                        }]],
                        children: ["Lancez votre propre communauté et rassemblez des personnes partageant vos intérêts"]
                      }
                    ]
                  },

                  // Statistiques
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
                          width: "60px", 
                          height: "60px", 
                          borderRadius: "50%", 
                          backgroundColor: "#28a745", 
                          display: "flex", 
                          alignItems: "center", 
                          justifyContent: "center", 
                          marginBottom: "20px" 
                        }]],
                        children: [
                          {
                            tag: "svg",
                            attributes: [
                              ["width", "24"],
                              ["height", "24"],
                              ["fill", "white"],
                              ["viewBox", "0 0 24 24"]
                            ],
                            children: [
                              {
                                tag: "path",
                                attributes: [["d", "M16 6l2.29 2.29-4.88 4.88-4-4L2 16.59 3.41 18l6-6 4 4 6.3-6.29L22 12V6z"]]
                              }
                            ]
                          }
                        ]
                      },
                      {
                        tag: "h3",
                        attributes: [["style", { 
                          fontSize: "1.3rem", 
                          fontWeight: "600", 
                          color: "#2c3e50", 
                          marginBottom: "10px" 
                        }]],
                        children: ["Mes statistiques"]
                      },
                      {
                        tag: "div",
                        attributes: [["id", "stats-display"], ["style", { color: "#6c757d" }]],
                        children: ["Chargement..."]
                      }
                    ]
                  }
                ]
              }
            ]
          },

          // Liste des communautés
          {
            tag: "div",
            children: [
              {
                tag: "h2",
                attributes: [["style", { 
                  fontSize: "1.8rem", 
                  fontWeight: "600", 
                  color: "#2c3e50", 
                  marginBottom: "30px" 
                }]],
                children: ["Mes communautés"]
              },
              
              {
                tag: "div",
                attributes: [["id", "communities-container"], ["style", { minHeight: "300px" }]],
                children: [
                  {
                    tag: "div",
                    attributes: [["style", { 
                      display: "flex", 
                      justifyContent: "center", 
                      alignItems: "center", 
                      minHeight: "200px", 
                      color: "#6c757d" 
                    }]],
                    children: ["Chargement de vos communautés..."]
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

// === FONCTIONS DE GESTION ===

async function loadUserCommunities() {
  try {
    const { data: { user } } = await auth.getCurrentUser();
    
    if (!user) {
      window.history.pushState({}, '', '/connexion');
      const popStateEvent = new PopStateEvent('popstate', { state: {} });
      window.dispatchEvent(popStateEvent);
      return;
    }

    const { data: communities, error } = await database.getUserCommunities(user.id);
    
    if (error) {
      showMessage(`Erreur lors du chargement : ${error.message}`, 'error');
      return;
    }

    displayCommunities(communities || []);
    updateStats(communities || []);

  } catch (error) {
    showMessage(`Erreur inattendue : ${error.message}`, 'error');
  }
}

function displayCommunities(communities) {
  const container = document.getElementById('communities-container');
  if (!container) return;

  if (communities.length === 0) {
    container.innerHTML = `
      <div style="text-align: center; padding: 60px 20px; background: white; border-radius: 12px; border: 1px solid #e9ecef;">
        <div style="width: 80px; height: 80px; margin: 0 auto 20px; background: #f8f9fa; border-radius: 50%; display: flex; align-items: center; justify-content: center;">
          <svg width="32" height="32" fill="#6c757d" viewBox="0 0 24 24">
            <path d="M16 4c0-1.11.89-2 2-2s2 .89 2 2-.89 2-2 2-2-.89-2-2zM4 18v-4h3v4h2v-7.5c0-.83-.67-1.5-1.5-1.5S6 9.67 6 10.5V11H4c-.83 0-1.5.67-1.5 1.5v5c0 .83.67 1.5 1.5 1.5z"/>
          </svg>
        </div>
        <h3 style="color: #2c3e50; margin-bottom: 10px; font-weight: 600;">Aucune communauté créée</h3>
        <p style="color: #6c757d; margin-bottom: 25px;">Créez votre première communauté pour commencer à rassembler des personnes</p>
        <button onclick="showCreateCommunityForm()" style="padding: 12px 24px; background: #667eea; color: white; border: none; border-radius: 8px; font-weight: 500; cursor: pointer;">
          Créer ma première communauté
        </button>
      </div>
    `;
    return;
  }

  container.innerHTML = `
    <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(350px, 1fr)); gap: 25px;">
      ${communities.map(community => createCommunityCard(community)).join('')}
    </div>
  `;
}

function createCommunityCard(community) {
  return `
    <div style="background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1); border: 1px solid #e9ecef; transition: transform 0.2s ease, box-shadow 0.2s ease;">
      <div style="height: 150px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); position: relative; display: flex; align-items: center; justify-content: center; color: white;">
        <div style="position: absolute; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.3);"></div>
        <div style="position: relative; text-align: center; z-index: 1;">
          <div style="font-size: 2rem; margin-bottom: 10px;">
            <svg width="40" height="40" fill="white" viewBox="0 0 24 24">
              <path d="M16 4c0-1.11.89-2 2-2s2 .89 2 2-.89 2-2 2-2-.89-2-2zM4 18v-4h3v4h2v-7.5c0-.83-.67-1.5-1.5-1.5S6 9.67 6 10.5V11H4c-.83 0-1.5.67-1.5 1.5v5c0 .83.67 1.5 1.5 1.5z"/>
            </svg>
          </div>
        </div>
        
        <div style="position: absolute; top: 15px; right: 15px;">
          <span style="padding: 4px 8px; background: rgba(255,255,255,0.2); border-radius: 12px; font-size: 12px; font-weight: 500; backdrop-filter: blur(10px);">
            ${community.category || 'Général'}
          </span>
        </div>
      </div>
      
      <div style="padding: 25px;">
        <h3 style="font-size: 1.4rem; font-weight: 600; color: #2c3e50; margin: 0 0 10px 0; line-height: 1.3;">
          ${community.name}
        </h3>
        
        <p style="color: #6c757d; margin: 0 0 20px 0; line-height: 1.5; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;">
          ${community.description || 'Aucune description disponible'}
        </p>
        
        <div style="display: flex; align-items: center; gap: 15px; margin-bottom: 20px; color: #6c757d; font-size: 14px;">
          <div style="display: flex; align-items: center; gap: 5px;">
            <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
            </svg>
            <span>Créée le ${new Date(community.created_at).toLocaleDateString('fr-FR')}</span>
          </div>
          
          <div style="display: flex; align-items: center; gap: 5px;">
            <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
            </svg>
            <span>${community.location || 'Non spécifié'}</span>
          </div>
        </div>
        
        <div style="display: flex; gap: 10px;">
          <button onclick="viewDashboard('${community.id}')" style="flex: 1; padding: 10px 16px; background: #667eea; color: white; border: none; border-radius: 8px; font-weight: 500; cursor: pointer; font-size: 14px;">
            Tableau de bord
          </button>
          
          <div style="display: flex; gap: 8px;">
            <button onclick="editCommunity('${community.id}')" style="padding: 10px 12px; background: #f8f9fa; color: #6c757d; border: 1px solid #dee2e6; border-radius: 8px; cursor: pointer;">
              <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
                <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/>
              </svg>
            </button>
            
            <button onclick="deleteCommunity('${community.id}')" style="padding: 10px 12px; background: #f8f9fa; color: #dc3545; border: 1px solid #dee2e6; border-radius: 8px; cursor: pointer;">
              <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
                <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  `;
}

function updateStats(communities) {
  const statsDisplay = document.getElementById('stats-display');
  if (!statsDisplay) return;

  const totalCommunities = communities.length;
  
  statsDisplay.innerHTML = `
    <div style="display: grid; gap: 15px;">
      <div style="display: flex; justify-content: space-between; align-items: center;">
        <span>Communautés créées</span>
        <span style="font-weight: 600; color: #2c3e50;">${totalCommunities}</span>
      </div>
      <div style="display: flex; justify-content: space-between; align-items: center;">
        <span>Statut</span>
        <span style="color: #28a745; font-weight: 600;">Actif</span>
      </div>
    </div>
  `;
}

// === ACTIONS ===

function showCreateCommunityForm() {
  const modalId = 'create-community-modal';
  
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
    <div style="background: white; padding: 40px; border-radius: 12px; width: 90%; max-width: 500px; max-height: 90vh; overflow-y: auto;">
      <h2 style="margin: 0 0 25px 0; color: #2c3e50; font-size: 1.8rem; font-weight: 600;">
        Créer une nouvelle communauté
      </h2>
      
      <form id="community-form">
        <div style="margin-bottom: 20px;">
          <label style="display: block; margin-bottom: 8px; font-weight: 500; color: #2c3e50;">Nom de la communauté *</label>
          <input type="text" id="community-name" required 
                 style="width: 100%; padding: 12px; border: 1px solid #dee2e6; border-radius: 8px; box-sizing: border-box; font-size: 14px;"
                 placeholder="Ex: Club de Photographie de Paris">
        </div>
        
        <div style="margin-bottom: 20px;">
          <label style="display: block; margin-bottom: 8px; font-weight: 500; color: #2c3e50;">Description</label>
          <textarea id="community-description" rows="4"
                    style="width: 100%; padding: 12px; border: 1px solid #dee2e6; border-radius: 8px; box-sizing: border-box; resize: vertical; font-size: 14px;"
                    placeholder="Décrivez votre communauté et ses objectifs..."></textarea>
        </div>
        
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 20px;">
          <div>
            <label style="display: block; margin-bottom: 8px; font-weight: 500; color: #2c3e50;">Catégorie</label>
            <select id="community-category"
                    style="width: 100%; padding: 12px; border: 1px solid #dee2e6; border-radius: 8px; box-sizing: border-box; font-size: 14px;">
              <option value="">Sélectionnez une catégorie</option>
              <option value="Sport">Sport</option>
              <option value="Culture">Culture</option>
              <option value="Technologie">Technologie</option>
              <option value="Art">Art</option>
              <option value="Musique">Musique</option>
              <option value="Cuisine">Cuisine</option>
              <option value="Voyage">Voyage</option>
              <option value="Autre">Autre</option>
            </select>
          </div>
          
          <div>
            <label style="display: block; margin-bottom: 8px; font-weight: 500; color: #2c3e50;">Localisation</label>
            <input type="text" id="community-location"
                   style="width: 100%; padding: 12px; border: 1px solid #dee2e6; border-radius: 8px; box-sizing: border-box; font-size: 14px;"
                   placeholder="Ex: Paris, France">
          </div>
        </div>
        
        <div style="display: flex; gap: 12px; justify-content: flex-end; margin-top: 30px;">
          <button type="button" onclick="closeCreateCommunityModal()" 
                  style="padding: 12px 24px; background: #f8f9fa; color: #6c757d; border: 1px solid #dee2e6; border-radius: 8px; cursor: pointer; font-weight: 500;">
            Annuler
          </button>
          <button type="submit"
                  style="padding: 12px 24px; background: #667eea; color: white; border: none; border-radius: 8px; cursor: pointer; font-weight: 500;">
            Créer la communauté
          </button>
        </div>
      </form>
    </div>
  `;
  
  document.body.appendChild(modal);
  
  // Gérer la soumission du formulaire
  document.getElementById('community-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    await handleCreateCommunity();
  });
  
  // Fermer le modal en cliquant à l'extérieur
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      closeCreateCommunityModal();
    }
  });
}

function closeCreateCommunityModal() {
  const modal = document.getElementById('create-community-modal');
  if (modal) {
    modal.remove();
  }
}

async function handleCreateCommunity() {
  const communityData = {
    name: document.getElementById('community-name').value.trim(),
    description: document.getElementById('community-description').value.trim(),
    category: document.getElementById('community-category').value,
    location: document.getElementById('community-location').value.trim()
  };
  
  if (!communityData.name) {
    showMessage('Le nom de la communauté est obligatoire', 'error');
    return;
  }
  
  try {
    const { data: { user } } = await auth.getCurrentUser();
    if (!user) {
      showMessage('Vous devez être connecté pour créer une communauté', 'error');
      return;
    }
    
    communityData.referent_id = user.id;
    
    const { error } = await database.createCommunity(communityData);
    
    if (error) {
      showMessage(`Erreur lors de la création : ${error.message}`, 'error');
    } else {
      showMessage('Communauté créée avec succès !', 'success');
      closeCreateCommunityModal();
      await loadUserCommunities();
    }
  } catch (error) {
    showMessage(`Erreur inattendue : ${error.message}`, 'error');
  }
}

async function deleteCommunity(communityId) {
  if (!confirm('Êtes-vous sûr de vouloir supprimer cette communauté ? Cette action est irréversible.')) {
    return;
  }

  try {
    const { error } = await database.deleteCommunity(communityId);
    
    if (error) {
      showMessage(`Erreur lors de la suppression : ${error.message}`, 'error');
    } else {
      showMessage('Communauté supprimée avec succès', 'success');
      await loadUserCommunities();
    }
  } catch (error) {
    showMessage(`Erreur inattendue : ${error.message}`, 'error');
  }
}

function editCommunity(communityId) {
  showMessage('Fonctionnalité de modification à venir...', 'info');
}

function viewDashboard(communityId) {
  window.history.pushState({}, '', `/community-dashboard?id=${communityId}`);
  const popStateEvent = new PopStateEvent('popstate', { state: {} });
  window.dispatchEvent(popStateEvent);
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
window.showCreateCommunityForm = showCreateCommunityForm;
window.closeCreateCommunityModal = closeCreateCommunityModal;
window.editCommunity = editCommunity;
window.viewDashboard = viewDashboard;
window.deleteCommunity = deleteCommunity;
window.handleLogout = handleCommonLogout; 