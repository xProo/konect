import { auth, database } from "../lib/supabase.js";
import { BrowserLink } from "../components/BrowserRouter.js";

export default function CommunityManagePage() {
  // Initialiser la page après le rendu
  setTimeout(async () => {
    await loadUserCommunities();
    await updateUserDisplay(); // Mettre à jour l'affichage utilisateur dans la navbar
    // Écouter les changements d'authentification
    auth.onAuthStateChange((event, session) => {
      if (session) {
        loadUserCommunities();
      } else {
        // Rediriger vers connexion si non connecté
        window.history.pushState({}, '', '/connexion');
        const popStateEvent = new PopStateEvent('popstate', { state: {} });
        window.dispatchEvent(popStateEvent);
      }
      updateUserDisplay(); // Mettre à jour l'affichage utilisateur
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

      // Titre principal
      {
        tag: "h1",
        attributes: [["style", { textAlign: "center", color: "#333", marginBottom: "40px" }]],
        children: ["Gestion des Communautés"]
      },

      // Messages
      {
        tag: "div",
        attributes: [["id", "message"], ["style", { padding: "10px", marginBottom: "20px", borderRadius: "5px", display: "none" }]],
        children: []
      },

      // Section : Créer une nouvelle communauté
      {
        tag: "div",
        attributes: [["style", { marginBottom: "50px", padding: "25px", backgroundColor: "#fff", border: "1px solid #ddd", borderRadius: "10px", boxShadow: "0 2px 10px rgba(0,0,0,0.1)" }]],
        children: [
          {
            tag: "h2",
            attributes: [["style", { color: "#28a745", marginBottom: "20px", borderBottom: "2px solid #28a745", paddingBottom: "10px" }]],
            children: ["➕ Créer une nouvelle communauté"]
          },

          {
            tag: "form",
            attributes: [["id", "createCommunityForm"], ["style", { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }]],
            events: {
              submit: [
                async (event) => {
                  event.preventDefault();
                  await handleCreateCommunity();
                }
              ]
            },
            children: [
              // Nom
              {
                tag: "div",
                children: [
                  {
                    tag: "label",
                    attributes: [["for", "name"], ["style", { fontWeight: "bold", marginBottom: "5px", display: "block" }]],
                    children: ["Nom de la communauté :"]
                  },
                  {
                    tag: "input",
                    attributes: [
                      ["type", "text"],
                      ["id", "name"],
                      ["required", ""],
                      ["style", { width: "100%", padding: "12px", border: "1px solid #ddd", borderRadius: "5px" }]
                    ]
                  }
                ]
              },

              // Catégorie
              {
                tag: "div",
                children: [
                  {
                    tag: "label",
                    attributes: [["for", "category"], ["style", { fontWeight: "bold", marginBottom: "5px", display: "block" }]],
                    children: ["Catégorie :"]
                  },
                  {
                    tag: "select",
                    attributes: [
                      ["id", "category"],
                      ["required", ""],
                      ["style", { width: "100%", padding: "12px", border: "1px solid #ddd", borderRadius: "5px" }]
                    ],
                    children: [
                      { tag: "option", attributes: [["value", ""]], children: ["Sélectionner une catégorie"] },
                      { tag: "option", attributes: [["value", "sport"]], children: ["Sport"] },
                      { tag: "option", attributes: [["value", "culture"]], children: ["Culture"] },
                      { tag: "option", attributes: [["value", "technologie"]], children: ["Technologie"] },
                      { tag: "option", attributes: [["value", "education"]], children: ["Éducation"] },
                      { tag: "option", attributes: [["value", "loisirs"]], children: ["Loisirs"] },
                      { tag: "option", attributes: [["value", "autre"]], children: ["Autre"] }
                    ]
                  }
                ]
              },

              // Description (2 colonnes)
              {
                tag: "div",
                attributes: [["style", { gridColumn: "1 / -1" }]],
                children: [
                  {
                    tag: "label",
                    attributes: [["for", "description"], ["style", { fontWeight: "bold", marginBottom: "5px", display: "block" }]],
                    children: ["Description :"]
                  },
                  {
                    tag: "textarea",
                    attributes: [
                      ["id", "description"],
                      ["required", ""],
                      ["rows", "4"],
                      ["style", { width: "100%", padding: "12px", border: "1px solid #ddd", borderRadius: "5px", resize: "vertical" }]
                    ]
                  }
                ]
              },

              // Localisation
              {
                tag: "div",
                children: [
                  {
                    tag: "label",
                    attributes: [["for", "location"], ["style", { fontWeight: "bold", marginBottom: "5px", display: "block" }]],
                    children: ["Localisation :"]
                  },
                  {
                    tag: "input",
                    attributes: [
                      ["type", "text"],
                      ["id", "location"],
                      ["required", ""],
                      ["placeholder", "Paris, France"],
                      ["style", { width: "100%", padding: "12px", border: "1px solid #ddd", borderRadius: "5px" }]
                    ]
                  }
                ]
              },

              // Image URL
              {
                tag: "div",
                children: [
                  {
                    tag: "label",
                    attributes: [["for", "image_url"], ["style", { fontWeight: "bold", marginBottom: "5px", display: "block" }]],
                    children: ["URL de l'image (optionnel) :"]
                  },
                  {
                    tag: "input",
                    attributes: [
                      ["type", "url"],
                      ["id", "image_url"],
                      ["placeholder", "https://example.com/image.jpg"],
                      ["style", { width: "100%", padding: "12px", border: "1px solid #ddd", borderRadius: "5px" }]
                    ]
                  }
                ]
              },

              // Bouton créer (2 colonnes)
              {
                tag: "div",
                attributes: [["style", { gridColumn: "1 / -1", textAlign: "center", marginTop: "20px" }]],
                children: [
                  {
                    tag: "button",
                    attributes: [
                      ["type", "submit"],
                      ["style", { 
                        padding: "15px 30px", 
                        backgroundColor: "#28a745", 
                        color: "white", 
                        border: "none", 
                        borderRadius: "5px", 
                        cursor: "pointer",
                        fontWeight: "bold",
                        fontSize: "16px"
                      }]
                    ],
                    children: ["🚀 Créer la communauté"]
                  }
                ]
              }
            ]
          }
        ]
      },

      // Section : Mes communautés
      {
        tag: "div",
        attributes: [["style", { padding: "25px", backgroundColor: "#fff", border: "1px solid #ddd", borderRadius: "10px", boxShadow: "0 2px 10px rgba(0,0,0,0.1)" }]],
        children: [
          {
            tag: "h2",
            attributes: [["style", { color: "#007bff", marginBottom: "20px", borderBottom: "2px solid #007bff", paddingBottom: "10px" }]],
            children: ["🏘️ Mes communautés"]
          },

          {
            tag: "div",
            attributes: [["id", "communities-list"], ["style", { minHeight: "200px" }]],
            children: [
              {
                tag: "div",
                attributes: [["style", { textAlign: "center", padding: "50px", color: "#666" }]],
                children: ["Chargement des communautés..."]
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

// Fonction pour créer la navbar (identique à HomePage)
function createNavbar() {
  return {
    tag: "div",
    attributes: [["class", "navbar-desktop"]],
    children: [
      {
        tag: "div",
        attributes: [["class", "container"]],
        children: [
          // Logo
          {
            tag: "div",
            attributes: [["class", "logo"]],
            children: [
              {
                tag: "img",
                attributes: [["class", "icon"], ["alt", ""], ["src", "images/logo.svg"]]
              },
              {
                tag: "div",
                attributes: [["class", "konect"]],
                children: ["Qonect"]
              }
            ]
          },
          
          // Navigation
          {
            tag: "div",
            attributes: [["class", "navigation"]],
            children: [
              {
                tag: "div",
                attributes: [["class", "dropdown-separated"]],
                children: [
                  {
                    tag: "img",
                    attributes: [["class", "map-pin-icon"], ["alt", ""], ["src", "images/Icon_location.svg"]]
                  },
                  {
                    tag: "div",
                    attributes: [["class", "label"]],
                    children: ["Paris"]
                  },
                  {
                    tag: "img",
                    attributes: [["class", "chevron-icon"], ["alt", ""], ["src", "images/Arrow.svg"]]
                  },
                  {
                    tag: "div",
                    attributes: [["class", "divider"]],
                    children: [
                      {
                        tag: "div",
                        attributes: [["class", "divider1"]],
                        children: []
                      }
                    ]
                  }
                ]
              },
              {
                tag: "div",
                attributes: [["class", "dropdown"]],
                children: [
                  {
                    tag: "div",
                    attributes: [["class", "label"]],
                    children: ["Evenement"]
                  },
                  {
                    tag: "img",
                    attributes: [["class", "chevron-icon"], ["alt", ""], ["src", "images/Arrow.svg"]]
                  }
                ]
              },
              BrowserLink({
                link: "/",
                title: {
                  tag: "div",
                  attributes: [["class", "nav-link"]],
                  children: [
                    {
                      tag: "div",
                      attributes: [["class", "label"]],
                      children: ["Accueil"]
                    }
                  ]
                }
              }),
              BrowserLink({
                link: "/communities",
                title: {
                  tag: "div",
                  attributes: [["class", "nav-link"]],
                  children: [
                    {
                      tag: "div",
                      attributes: [["class", "label"]],
                      children: ["Mes Communautés"]
                    }
                  ]
                }
              }),
              {
                tag: "div",
                attributes: [["class", "nav-link"]],
                children: [
                  {
                    tag: "div",
                    attributes: [["class", "label"]],
                    children: ["Billeterie"]
                  }
                ]
              },
              {
                tag: "div",
                attributes: [["class", "dropdown"]],
                children: [
                  {
                    tag: "div",
                    attributes: [["class", "label"]],
                    children: ["Centre d'aide"]
                  },
                  {
                    tag: "img",
                    attributes: [["class", "chevron-icon"], ["alt", ""], ["src", "images/Arrow.svg"]]
                  }
                ]
              }
            ]
          },
          
          // Buttons
          {
            tag: "div",
            attributes: [["class", "buttons"]],
            children: [
              {
                tag: "div",
                attributes: [["class", "button-group"], ["id", "user-display-area"]],
                children: [
                  BrowserLink({
                    link: "/connexion",
                    title: {
                      tag: "div",
                      attributes: [["class", "dark-button"]],
                      children: [
                        {
                          tag: "img",
                          attributes: [["class", "map-pin-icon"], ["alt", ""], ["src", "images/Icon.svg"]]
                        },
                        {
                          tag: "div",
                          attributes: [["class", "label5"]],
                          children: ["Connexion"]
                        }
                      ]
                    }
                  })
                ]
              }
            ]
          }
        ]
      }
    ]
  };
}

// Fonction pour mettre à jour l'affichage utilisateur dans la navbar
async function updateUserDisplay() {
  const userDisplayArea = document.getElementById('user-display-area');
  if (!userDisplayArea) return;
  
  try {
    const { data: { user } } = await auth.getCurrentUser();
    
    if (user) {
      // Utilisateur connecté - afficher nom/prénom et bouton déconnexion
      let displayName = user.email;
      if (user.user_metadata && user.user_metadata.full_name) {
        displayName = user.user_metadata.full_name;
      } else if (user.user_metadata && user.user_metadata.prenom && user.user_metadata.nom) {
        displayName = `${user.user_metadata.prenom} ${user.user_metadata.nom}`;
      }
      
      userDisplayArea.innerHTML = `
        <div style="display: flex; align-items: center; gap: 12px;">
          <div style="text-align: right;">
            <div style="font-weight: 600; color: #333; font-size: 14px;"> ${displayName}</div>
            <div style="font-size: 12px; color: #666;">${user.email}</div>
          </div>
          <button id="logout-btn" class="dark-button" style="padding: 8px 16px; font-size: 14px;">
            Déconnexion
          </button>
        </div>
      `;
      
      // Ajouter l'événement de déconnexion
      const logoutBtn = document.getElementById('logout-btn');
      if (logoutBtn) {
        logoutBtn.addEventListener('click', async () => {
          await handleLogout();
        });
      }
      
    } else {
      // Utilisateur non connecté - afficher bouton connexion
      userDisplayArea.innerHTML = `
        <div class="dark-button" style="cursor: pointer;" onclick="navigateToLogin()">
          <img class="map-pin-icon" alt="" src="images/Icon.svg" />
          <div class="label5">Connexion</div>
        </div>
      `;
    }
  } catch (error) {
    console.error('Erreur lors de la vérification de l\'utilisateur:', error);
  }
}

async function handleLogout() {
  try {
    const { error } = await auth.signOut();
    if (error) {
      console.error('Erreur de déconnexion:', error);
    } else {
      // Rafraîchir l'affichage
      await updateUserDisplay();
    }
  } catch (error) {
    console.error('Erreur inattendue:', error);
  }
}

function navigateToLogin() {
  window.history.pushState({}, '', '/connexion');
  const popStateEvent = new PopStateEvent('popstate', { state: {} });
  window.dispatchEvent(popStateEvent);
}

// === FONCTIONS ===

async function loadUserCommunities() {
  try {
    const { data: { user } } = await auth.getCurrentUser();
    
    if (!user) {
      const container = document.getElementById('communities-list');
      if (container) {
        container.innerHTML = `
          <div style="text-align: center; padding: 50px; color: #666;">
            <p>Vous devez être connecté pour voir vos communautés.</p>
            <a href="/connexion" style="color: #007bff;">Se connecter</a>
          </div>
        `;
      }
      return;
    }

    const { data: communities, error } = await database.getUserCommunities(user.id);
    
    if (error) {
      showMessage(`Erreur lors du chargement : ${error.message}`, 'error');
      return;
    }

    displayCommunities(communities || []);
  } catch (error) {
    showMessage(`Erreur inattendue : ${error.message}`, 'error');
  }
}

function displayCommunities(communities) {
  const container = document.getElementById('communities-list');
  if (!container) return;
  
  if (communities.length === 0) {
    container.innerHTML = `
      <div style="text-align: center; padding: 50px; color: #666;">
        <p>🏘️ Vous n'avez pas encore créé de communauté.</p>
        <p>Utilisez le formulaire ci-dessus pour créer votre première communauté !</p>
      </div>
    `;
    return;
  }

  container.innerHTML = communities.map(community => `
    <div style="border: 1px solid #ddd; border-radius: 10px; padding: 20px; margin-bottom: 20px; background: #f9f9f9;">
      <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 15px;">
        <div>
          <h3 style="margin: 0 0 10px 0; color: #333;">${community.name}</h3>
          <p style="margin: 0; color: #666; font-style: italic;">${community.category}</p>
          <p style="margin: 5px 0; color: #888;">📍 ${community.location}</p>
        </div>
        <div style="display: flex; gap: 10px;">
          <button onclick="editCommunity('${community.id}')" style="padding: 8px 15px; background: #ffc107; color: #333; border: none; border-radius: 5px; cursor: pointer; font-weight: bold;">
            ✏️ Modifier
          </button>
          <button onclick="viewDashboard('${community.id}')" style="padding: 8px 15px; background: #007bff; color: white; border: none; border-radius: 5px; cursor: pointer; font-weight: bold;">
            📊 Dashboard
          </button>
          <button onclick="deleteCommunity('${community.id}')" style="padding: 8px 15px; background: #dc3545; color: white; border: none; border-radius: 5px; cursor: pointer; font-weight: bold;">
            🗑️ Supprimer
          </button>
        </div>
      </div>
      <p style="margin: 0; color: #555;">${community.description}</p>
      <div style="margin-top: 15px; padding-top: 15px; border-top: 1px solid #ddd; font-size: 14px; color: #666;">
        Créée le : ${new Date(community.created_at).toLocaleDateString('fr-FR')}
      </div>
    </div>
  `).join('');
}

async function handleCreateCommunity() {
  try {
    const { data: { user } } = await auth.getCurrentUser();
    
    if (!user) {
      showMessage('Vous devez être connecté pour créer une communauté', 'error');
      return;
    }

    const communityData = {
      name: document.getElementById('name').value.trim(),
      description: document.getElementById('description').value.trim(),
      category: document.getElementById('category').value,
      location: document.getElementById('location').value.trim(),
      image_url: document.getElementById('image_url').value.trim() || null,
      referent_id: user.id
    };

    if (!communityData.name || !communityData.description || !communityData.category || !communityData.location) {
      showMessage('Veuillez remplir tous les champs obligatoires', 'error');
      return;
    }

    const { data, error } = await database.createCommunity(communityData);
    
    if (error) {
      showMessage(`Erreur lors de la création : ${error.message}`, 'error');
    } else {
      showMessage('Communauté créée avec succès ! 🎉', 'success');
      
      // Réinitialiser le formulaire
      const form = document.getElementById('createCommunityForm');
      if (form) form.reset();
      
      // Recharger la liste
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
  // Rediriger vers une page d'édition (à implémenter)
  showMessage('Fonctionnalité d\'édition à venir...', 'info');
}

function viewDashboard(communityId) {
  // Rediriger vers le dashboard de la communauté
  window.history.pushState({}, '', `/community-dashboard?id=${communityId}`);
  const popStateEvent = new PopStateEvent('popstate', { state: {} });
  window.dispatchEvent(popStateEvent);
}

function showMessage(message, type) {
  const messageDiv = document.getElementById('message');
  if (!messageDiv) return; // Protection contre l'élément non trouvé
  
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
    if (messageDiv) {
      messageDiv.style.display = 'none';
    }
  }, 5000);
}

// Rendre les fonctions disponibles globalement
window.editCommunity = editCommunity;
window.deleteCommunity = deleteCommunity;
window.viewDashboard = viewDashboard;
window.navigateToLogin = navigateToLogin; 