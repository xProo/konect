import { auth } from "../lib/supabase.js";
import { BrowserLink } from "../components/BrowserRouter.js";

export default function ConnexionPage() {
  return {
    tag: "div",
    attributes: [["style", { padding: "20px", maxWidth: "400px", margin: "0 auto" }]],
    children: [
    
      {
        tag: "nav",
        attributes: [["style", { marginBottom: "20px", padding: "10px", backgroundColor: "#f8f9fa", borderRadius: "5px", textAlign: "center" }]],
        children: [
          BrowserLink({ link: "/", title: "Accueil" }),
          " | ",
          BrowserLink({ link: "/inscription", title: "Inscription" }),
          " | ",
          BrowserLink({ link: "/connexion", title: "Connexion" })
        ]
      },
      
      {
        tag: "h1",
        attributes: [["style", { textAlign: "center", color: "#333", marginBottom: "30px" }]],
        children: ["Connexion KONECT"]
      },

     
      {
        tag: "div",
        attributes: [["id", "auth-status"], ["style", { marginBottom: "20px", padding: "10px", backgroundColor: "#f0f0f0", borderRadius: "5px", textAlign: "center" }]],
        children: ["Statut : Non connecté"]
      },

  
      {
        tag: "div",
        attributes: [["style", { border: "1px solid #ddd", padding: "20px", borderRadius: "10px", backgroundColor: "#fff", boxShadow: "0 2px 10px rgba(0,0,0,0.1)" }]],
        children: [
          {
            tag: "input",
            attributes: [
              ["type", "email"],
              ["id", "signin-email"],
              ["placeholder", "Adresse email"],
              ["style", { width: "100%", padding: "12px", marginBottom: "15px", border: "1px solid #ccc", borderRadius: "5px", fontSize: "16px" }]
            ]
          },
          {
            tag: "input",
            attributes: [
              ["type", "password"],
              ["id", "signin-password"],
              ["placeholder", "Mot de passe"],
              ["style", { width: "100%", padding: "12px", marginBottom: "20px", border: "1px solid #ccc", borderRadius: "5px", fontSize: "16px" }]
            ]
          },
          {
            tag: "button",
            attributes: [
              ["id", "signin-btn"],
              ["style", { width: "100%", padding: "12px", backgroundColor: "#007bff", color: "white", border: "none", borderRadius: "5px", cursor: "pointer", fontSize: "16px", fontWeight: "bold" }]
            ],
            events: {
              click: [handleSignIn]
            },
            children: ["Se connecter"]
          }
        ]
      },

     
      {
        tag: "button",
        attributes: [
          ["id", "signout-btn"],
          ["style", { width: "100%", padding: "12px", backgroundColor: "#dc3545", color: "white", border: "none", borderRadius: "5px", cursor: "pointer", fontSize: "16px", fontWeight: "bold", display: "none", marginTop: "15px" }]
        ],
        events: {
          click: [handleSignOut]
        },
        children: ["Se déconnecter"]
      },

 
      {
        tag: "div",
        attributes: [["style", { textAlign: "center", marginTop: "20px" }]],
        children: [
          "Pas encore de compte ? ",
          BrowserLink({ link: "/inscription", title: "S'inscrire" })
        ]
      },

     
      {
        tag: "div",
        attributes: [["id", "message"], ["style", { marginTop: "20px", padding: "10px", borderRadius: "5px" }]],
        children: [""]
      }
    ]
  };
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
      showMessage('Connexion réussie ! Bienvenue !', 'success');
      updateAuthStatus(data.user);
 
      document.getElementById('signin-email').value = '';
      document.getElementById('signin-password').value = '';
      
    
      setTimeout(() => {
        window.history.pushState({}, '', '/');
        const popStateEvent = new PopStateEvent('popstate', { state: {} });
        window.dispatchEvent(popStateEvent);
      }, 1000);
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