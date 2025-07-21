import { auth } from "../lib/supabase.js";
import { BrowserLink } from "../components/BrowserRouter.js";

export default function AuthPage() {
  return {
    tag: "div",
    attributes: [["style", { padding: "20px", maxWidth: "500px", margin: "0 auto" }]],
    children: [
      // Navigation
      {
        tag: "nav",
        attributes: [["style", { marginBottom: "20px", padding: "10px", backgroundColor: "#f8f9fa", borderRadius: "5px" }]],
        children: [
          HashLink({ link: "/auth", title: "Authentification" }),
          " | ",
          HashLink({ link: "/home", title: "Accueil" }),
          " | ",
          HashLink({ link: "/gallery", title: "Galerie" })
        ]
      },
      
      {
        tag: "h1",
        children: ["Test Authentification KONECT"]
      },
      {
        tag: "div",
        attributes: [["id", "auth-status"], ["style", { marginBottom: "20px", padding: "10px", backgroundColor: "#f0f0f0", borderRadius: "5px" }]],
        children: ["Statut : Non connecté"]
      },
      
  
      {
        tag: "div",
        attributes: [["style", { marginBottom: "30px", border: "1px solid #ddd", padding: "15px", borderRadius: "5px" }]],
        children: [
          {
            tag: "h3",
            children: ["Inscription"]
          },
          {
            tag: "input",
            attributes: [
              ["type", "email"],
              ["id", "signup-email"],
              ["placeholder", "Email"],
              ["style", { width: "100%", padding: "8px", marginBottom: "10px", border: "1px solid #ccc", borderRadius: "3px" }]
            ]
          },
          {
            tag: "input",
            attributes: [
              ["type", "password"],
              ["id", "signup-password"],
              ["placeholder", "Mot de passe"],
              ["style", { width: "100%", padding: "8px", marginBottom: "10px", border: "1px solid #ccc", borderRadius: "3px" }]
            ]
          },
          {
            tag: "button",
            attributes: [
              ["id", "signup-btn"],
              ["style", { width: "100%", padding: "10px", backgroundColor: "#4CAF50", color: "white", border: "none", borderRadius: "3px", cursor: "pointer" }]
            ],
            events: {
              click: [handleSignUp]
            },
            children: ["S'inscrire"]
          }
        ]
      },

      // Formulaire de connexion
      {
        tag: "div",
        attributes: [["style", { marginBottom: "30px", border: "1px solid #ddd", padding: "15px", borderRadius: "5px" }]],
        children: [
          {
            tag: "h3",
            children: ["Connexion"]
          },
          {
            tag: "input",
            attributes: [
              ["type", "email"],
              ["id", "signin-email"],
              ["placeholder", "Email"],
              ["style", { width: "100%", padding: "8px", marginBottom: "10px", border: "1px solid #ccc", borderRadius: "3px" }]
            ]
          },
          {
            tag: "input",
            attributes: [
              ["type", "password"],
              ["id", "signin-password"],
              ["placeholder", "Mot de passe"],
              ["style", { width: "100%", padding: "8px", marginBottom: "10px", border: "1px solid #ccc", borderRadius: "3px" }]
            ]
          },
          {
            tag: "button",
            attributes: [
              ["id", "signin-btn"],
              ["style", { width: "100%", padding: "10px", backgroundColor: "#2196F3", color: "white", border: "none", borderRadius: "3px", cursor: "pointer" }]
            ],
            events: {
              click: [handleSignIn]
            },
            children: ["Se connecter"]
          }
        ]
      },

      // Bouton de déconnexion
      {
        tag: "button",
        attributes: [
          ["id", "signout-btn"],
          ["style", { width: "100%", padding: "10px", backgroundColor: "#f44336", color: "white", border: "none", borderRadius: "3px", cursor: "pointer", display: "none" }]
        ],
        events: {
          click: [handleSignOut]
        },
        children: ["Se déconnecter"]
      },

      // Zone d'affichage des messages
      {
        tag: "div",
        attributes: [["id", "message"], ["style", { marginTop: "20px", padding: "10px", borderRadius: "5px" }]],
        children: [""]
      }
    ]
  };
}

// Fonctions de gestion des événements
async function handleSignUp() {
  const email = document.getElementById('signup-email').value;
  const password = document.getElementById('signup-password').value;
  
  if (!email || !password) {
    showMessage('Veuillez remplir tous les champs', 'error');
    return;
  }

  try {
    const { data, error } = await auth.signUp(email, password);
    
    if (error) {
      showMessage(`Erreur d'inscription: ${error.message}`, 'error');
    } else {
      showMessage('Inscription réussie ! Vérifiez votre email.', 'success');
      document.getElementById('signup-email').value = '';
      document.getElementById('signup-password').value = '';
    }
  } catch (err) {
    showMessage(`Erreur: ${err.message}`, 'error');
  }
}

async function handleSignIn() {
  const email = document.getElementById('signin-email').value;
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
      showMessage('Connexion réussie !', 'success');
      updateAuthStatus(data.user);
      document.getElementById('signin-email').value = '';
      document.getElementById('signin-password').value = '';
    }
  } catch (err) {
    showMessage(`Erreur: ${err.message}`, 'error');
  }
}

async function handleSignOut() {
  try {
    const { error } = await auth.signOut();
    
    if (error) {
      showMessage(`Erreur de déconnexion: ${error.message}`, 'error');
    } else {
      showMessage('Déconnexion réussie !', 'success');
      updateAuthStatus(null);
    }
  } catch (err) {
    showMessage(`Erreur: ${err.message}`, 'error');
  }
}

function showMessage(message, type) {
  const messageDiv = document.getElementById('message');
  messageDiv.textContent = message;
  
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
    messageDiv.textContent = '';
    messageDiv.style.backgroundColor = '';
    messageDiv.style.color = '';
    messageDiv.style.border = '';
  }, 5000);
}

function updateAuthStatus(user) {
  const statusDiv = document.getElementById('auth-status');
  const signoutBtn = document.getElementById('signout-btn');
  
  if (user) {
    statusDiv.textContent = `Connecté en tant que: ${user.email}`;
    statusDiv.style.backgroundColor = '#d4edda';
    statusDiv.style.color = '#155724';
    signoutBtn.style.display = 'block';
  } else {
    statusDiv.textContent = 'Statut : Non connecté';
    statusDiv.style.backgroundColor = '#f0f0f0';
    statusDiv.style.color = '#333';
    signoutBtn.style.display = 'none';
  }
} 