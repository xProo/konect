import { auth } from "../lib/supabase.js";
import { BrowserLink } from "../components/BrowserRouter.js";

export default function ConnexionPage() {
  // Initialiser après le rendu
  setTimeout(async () => {
    await checkAuthStatus();
    // Écouter les changements d'authentification
    auth.onAuthStateChange((event, session) => {
      checkAuthStatus();
    });
  }, 100);

  return {
    tag: "div",
    attributes: [["style", { padding: "20px", maxWidth: "450px", margin: "0 auto" }]],
    children: [
      // Navigation
      {
        tag: "nav",
        attributes: [["style", { marginBottom: "30px", padding: "15px", backgroundColor: "#f8f9fa", borderRadius: "5px", textAlign: "center" }]],
        children: [
          BrowserLink({ link: "/", title: "Accueil" }),
          " | ",
          BrowserLink({ link: "/inscription", title: "Inscription" }),
          " | ",
          BrowserLink({ link: "/connexion", title: "Connexion" })
        ]
      },

      // Titre
      {
        tag: "div",
        attributes: [["style", { textAlign: "center", marginBottom: "40px" }]],
        children: [
          {
            tag: "h1",
            attributes: [["style", { color: "#333", marginBottom: "10px", fontSize: "28px" }]],
            children: ["🔐 Connexion"]
          },
          {
            tag: "p",
            attributes: [["style", { color: "#666", margin: "0", fontSize: "16px" }]],
            children: ["Connectez-vous à votre compte KONECT"]
          }
        ]
      },

      // Messages
      {
        tag: "div",
        attributes: [["id", "message"], ["style", { marginBottom: "20px", padding: "12px", borderRadius: "8px", display: "none" }]],
        children: []
      },

      // Formulaire de connexion
      {
        tag: "div",
        attributes: [["id", "login-form"], ["style", { border: "1px solid #e0e0e0", padding: "30px", borderRadius: "12px", backgroundColor: "#fff", boxShadow: "0 4px 20px rgba(0,0,0,0.1)" }]],
        children: [
          {
            tag: "form",
            events: {
              submit: [
                async (event) => {
                  event.preventDefault();
                  await handleSignIn();
                }
              ]
            },
            children: [
              // Email
              {
                tag: "div",
                attributes: [["style", { marginBottom: "20px" }]],
                children: [
                  {
                    tag: "label",
                    attributes: [["for", "signin-email"], ["style", { display: "block", fontWeight: "600", marginBottom: "8px", color: "#333" }]],
                    children: ["Adresse email"]
                  },
                  {
                    tag: "input",
                    attributes: [
                      ["type", "email"],
                      ["id", "signin-email"],
                      ["required", ""],
                      ["placeholder", "votre@email.com"],
                      ["style", { 
                        width: "100%", 
                        padding: "14px", 
                        border: "2px solid #e0e0e0", 
                        borderRadius: "8px", 
                        fontSize: "16px",
                        transition: "border-color 0.3s ease"
                      }]
                    ]
                  }
                ]
              },

              // Mot de passe
              {
                tag: "div",
                attributes: [["style", { marginBottom: "25px" }]],
                children: [
                  {
                    tag: "label",
                    attributes: [["for", "signin-password"], ["style", { display: "block", fontWeight: "600", marginBottom: "8px", color: "#333" }]],
                    children: ["Mot de passe"]
                  },
                  {
                    tag: "input",
                    attributes: [
                      ["type", "password"],
                      ["id", "signin-password"],
                      ["required", ""],
                      ["placeholder", "Votre mot de passe"],
                      ["style", { 
                        width: "100%", 
                        padding: "14px", 
                        border: "2px solid #e0e0e0", 
                        borderRadius: "8px", 
                        fontSize: "16px",
                        transition: "border-color 0.3s ease"
                      }]
                    ]
                  }
                ]
              },

              // Bouton connexion
              {
                tag: "button",
                attributes: [
                  ["type", "submit"],
                  ["style", { 
                    width: "100%", 
                    padding: "15px", 
                    backgroundColor: "#007bff", 
                    color: "white", 
                    border: "none", 
                    borderRadius: "8px", 
                    cursor: "pointer", 
                    fontSize: "17px", 
                    fontWeight: "bold",
                    transition: "background-color 0.3s ease"
                  }]
                ],
                children: ["🚀 Se connecter"]
              }
            ]
          }
        ]
      },

      // Informations utilisateur (quand connecté)
      {
        tag: "div",
        attributes: [["id", "user-info"], ["style", { display: "none", marginTop: "25px", padding: "20px", backgroundColor: "#d4edda", borderRadius: "8px", border: "1px solid #c3e6cb" }]],
        children: []
      },

      // Bouton déconnexion (quand connecté)
      {
        tag: "div",
        attributes: [["id", "logout-section"], ["style", { display: "none", marginTop: "20px", textAlign: "center" }]],
        children: [
          {
            tag: "button",
            attributes: [
              ["onclick", "handleSignOut()"],
              ["style", { 
                padding: "12px 25px", 
                backgroundColor: "#dc3545", 
                color: "white", 
                border: "none", 
                borderRadius: "8px", 
                cursor: "pointer", 
                fontSize: "16px", 
                fontWeight: "bold"
              }]
            ],
            children: ["🚪 Se déconnecter"]
          }
        ]
      },

      // Lien vers inscription
      {
        tag: "div",
        attributes: [["style", { textAlign: "center", marginTop: "25px", padding: "20px", backgroundColor: "#f8f9fa", borderRadius: "8px" }]],
        children: [
          {
            tag: "p",
            attributes: [["style", { margin: "0 0 10px 0", color: "#666" }]],
            children: ["Vous n'avez pas encore de compte ?"]
          },
          BrowserLink({ 
            link: "/inscription", 
            title: {
              tag: "span",
              attributes: [["style", { color: "#007bff", fontWeight: "600", textDecoration: "none" }]],
              children: ["✨ Créer un compte gratuit"]
            }
          })
        ]
      }
    ]
  };
}

// Fonction pour vérifier le statut d'authentification
async function checkAuthStatus() {
  try {
    const { data: { user } } = await auth.getCurrentUser();
    
    const loginForm = document.getElementById('login-form');
    const userInfo = document.getElementById('user-info');
    const logoutSection = document.getElementById('logout-section');
    
    if (user) {
      // Utilisateur connecté
      loginForm.style.display = 'none';
      userInfo.style.display = 'block';
      logoutSection.style.display = 'block';
      
      // Afficher les informations utilisateur
      let displayName = user.email;
      if (user.user_metadata && user.user_metadata.full_name) {
        displayName = user.user_metadata.full_name;
      } else if (user.user_metadata && user.user_metadata.prenom && user.user_metadata.nom) {
        displayName = `${user.user_metadata.prenom} ${user.user_metadata.nom}`;
      }
      
      userInfo.innerHTML = `
        <div style="text-align: center;">
          <h3 style="margin: 0 0 10px 0; color: #155724;">✅ Vous êtes connecté !</h3>
          <p style="margin: 0; font-weight: 600; color: #155724;">${displayName}</p>
          <p style="margin: 5px 0 0 0; color: #155724; font-size: 14px;">${user.email}</p>
        </div>
      `;
    } else {
      // Utilisateur non connecté
      loginForm.style.display = 'block';
      userInfo.style.display = 'none';
      logoutSection.style.display = 'none';
    }
  } catch (error) {
    console.error('Erreur lors de la vérification du statut:', error);
  }
}

// Fonction pour gérer la connexion
async function handleSignIn() {
  const email = document.getElementById('signin-email').value.trim();
  const password = document.getElementById('signin-password').value;
  
  if (!email || !password) {
    showMessage('Veuillez remplir tous les champs', 'error');
    return;
  }

  try {
    const { data, error } = await auth.signIn(email, password);
    
    if (error) {
      showMessage(`Erreur de connexion: ${error.message}`, 'error');
    } else {
      showMessage('🎉 Connexion réussie ! Bienvenue !', 'success');
      
      // Vider les champs
      document.getElementById('signin-email').value = '';
      document.getElementById('signin-password').value = '';
      
      // Rediriger vers l'accueil après 1,5 secondes
      setTimeout(() => {
        window.history.pushState({}, '', '/');
        const popStateEvent = new PopStateEvent('popstate', { state: {} });
        window.dispatchEvent(popStateEvent);
      }, 1500);
    }
  } catch (err) {
    showMessage(`Erreur: ${err.message}`, 'error');
  }
}

// Fonction pour gérer la déconnexion
async function handleSignOut() {
  try {
    const { error } = await auth.signOut();
    
    if (error) {
      showMessage(`Erreur de déconnexion: ${error.message}`, 'error');
    } else {
      showMessage(' Déconnexion réussie ! À bientôt !', 'success');
      await checkAuthStatus();
    }
  } catch (err) {
    showMessage(`Erreur: ${err.message}`, 'error');
  }
}

// Fonction pour afficher les messages
function showMessage(message, type) {
  const messageDiv = document.getElementById('message');
  messageDiv.textContent = message;
  messageDiv.style.display = 'block';
  
  if (type === 'success') {
    messageDiv.style.backgroundColor = '#d4edda';
    messageDiv.style.color = '#155724';
    messageDiv.style.border = '1px solid #c3e6cb';
  } else {
    messageDiv.style.backgroundColor = '#f8d7da';
    messageDiv.style.color = '#721c24';
    messageDiv.style.border = '1px solid #f5c6cb';
  }
  
  // Effacer le message après 5 secondes
  setTimeout(() => {
    messageDiv.style.display = 'none';
  }, 5000);
}

// Rendre les fonctions disponibles globalement
window.handleSignOut = handleSignOut; 