import { auth } from "../lib/supabase.js";
import { BrowserLink } from "../components/BrowserRouter.js";

export default function InscriptionPage() {
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
        children: ["Inscription KONECT"]
      },

      
      {
        tag: "div",
        attributes: [["id", "message"], ["style", { padding: "10px", marginBottom: "20px", borderRadius: "5px", display: "none" }]],
        children: []
      },

      
      {
        tag: "form",
        attributes: [["id", "signupForm"], ["style", { display: "flex", flexDirection: "column", gap: "15px" }]],
        events: [
          ["submit", async (event) => {
            event.preventDefault();
            await handleSignUp();
          }]
        ],
        children: [
          // Prénom
          {
            tag: "div",
            attributes: [["style", { display: "flex", flexDirection: "column" }]],
            children: [
              {
                tag: "label",
                attributes: [["for", "prenom"], ["style", { fontWeight: "bold", marginBottom: "5px" }]],
                children: ["Prénom :"]
              },
              {
                tag: "input",
                attributes: [
                  ["type", "text"],
                  ["id", "prenom"],
                  ["name", "prenom"],
                  ["required", ""],
                  ["style", { padding: "10px", border: "1px solid #ddd", borderRadius: "5px" }]
                ]
              }
            ]
          },

          // Nom
          {
            tag: "div",
            attributes: [["style", { display: "flex", flexDirection: "column" }]],
            children: [
              {
                tag: "label",
                attributes: [["for", "nom"], ["style", { fontWeight: "bold", marginBottom: "5px" }]],
                children: ["Nom :"]
              },
              {
                tag: "input",
                attributes: [
                  ["type", "text"],
                  ["id", "nom"],
                  ["name", "nom"],
                  ["required", ""],
                  ["style", { padding: "10px", border: "1px solid #ddd", borderRadius: "5px" }]
                ]
              }
            ]
          },

          // Email
          {
            tag: "div",
            attributes: [["style", { display: "flex", flexDirection: "column" }]],
            children: [
              {
                tag: "label",
                attributes: [["for", "email"], ["style", { fontWeight: "bold", marginBottom: "5px" }]],
                children: ["Email :"]
              },
              {
                tag: "input",
                attributes: [
                  ["type", "email"],
                  ["id", "email"],
                  ["name", "email"],
                  ["required", ""],
                  ["style", { padding: "10px", border: "1px solid #ddd", borderRadius: "5px" }]
                ]
              }
            ]
          },
          
          {
            tag: "div",
            attributes: [["style", { display: "flex", flexDirection: "column" }]],
            children: [
              {
                tag: "label",
                attributes: [["for", "password"], ["style", { fontWeight: "bold", marginBottom: "5px" }]],
                children: ["Mot de passe :"]
              },
              {
                tag: "input",
                attributes: [
                  ["type", "password"],
                  ["id", "password"],
                  ["name", "password"],
                  ["required", ""],
                  ["minlength", "6"],
                  ["style", { padding: "10px", border: "1px solid #ddd", borderRadius: "5px" }]
                ]
              }
            ]
          },

          {
            tag: "div",
            attributes: [["style", { display: "flex", flexDirection: "column" }]],
            children: [
              {
                tag: "label",
                attributes: [["for", "confirmPassword"], ["style", { fontWeight: "bold", marginBottom: "5px" }]],
                children: ["Confirmer le mot de passe :"]
              },
              {
                tag: "input",
                attributes: [
                  ["type", "password"],
                  ["id", "confirmPassword"],
                  ["name", "confirmPassword"],
                  ["required", ""],
                  ["minlength", "6"],
                  ["style", { padding: "10px", border: "1px solid #ddd", borderRadius: "5px" }]
                ]
              }
            ]
          },
          
          {
            tag: "button",
            attributes: [
              ["type", "submit"],
              ["style", { 
                padding: "12px", 
                backgroundColor: "#007bff", 
                color: "white", 
                border: "none", 
                borderRadius: "5px", 
                cursor: "pointer",
                fontWeight: "bold"
              }]
            ],
            children: ["S'inscrire"]
          }
        ]
      },
      
      {
        tag: "div",
        attributes: [["style", { textAlign: "center", marginTop: "20px" }]],
        children: [
          "Déjà un compte ? ",
          BrowserLink({ link: "/connexion", title: "Se connecter" })
        ]
      }
    ]
  };
}

async function handleSignUp() {
  const prenom = document.getElementById('prenom').value;
  const nom = document.getElementById('nom').value;
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  const confirmPassword = document.getElementById('confirmPassword').value;
  
  
  if (password !== confirmPassword) {
    showMessage('Les mots de passe ne correspondent pas', 'error');
    return;
  }
  
  if (password.length < 6) {
    showMessage('Le mot de passe doit contenir au moins 6 caractères', 'error');
    return;
  }
  
  try {
    // Inscription avec métadonnées utilisateur
    const { data, error } = await auth.signUp({
      email: email,
      password: password,
      options: {
        data: {
          prenom: prenom,
          nom: nom,
          full_name: `${prenom} ${nom}`
        }
      }
    });
    
    if (error) {
      showMessage(`Erreur lors de l'inscription : ${error.message}`, 'error');
    } else {
      showMessage('Inscription réussie ! Vérifiez votre email pour confirmer votre compte.', 'success');
      
      
      setTimeout(() => {
        window.history.pushState({}, '', '/connexion');
        const popStateEvent = new PopStateEvent('popstate', { state: {} });
        window.dispatchEvent(popStateEvent);
      }, 2000);
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
  } else {
    messageDiv.style.backgroundColor = '#f8d7da';
    messageDiv.style.color = '#721c24';
    messageDiv.style.border = '1px solid #f5c6cb';
  }
  
  
  setTimeout(() => {
    messageDiv.style.display = 'none';
  }, 5000);
} 