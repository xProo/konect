import { auth } from "../lib/supabase.js";
import { BrowserLink } from "../components/BrowserRouter.js";

export default function InscriptionPage() {
  return {
    tag: "div",
    attributes: [["style", { padding: "20px", maxWidth: "500px", margin: "0 auto" }]],
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
            children: ["✨ Inscription"]
          },
          {
            tag: "p",
            attributes: [["style", { color: "#666", margin: "0", fontSize: "16px" }]],
            children: ["Rejoignez la communauté KONECT dès maintenant"]
          }
        ]
      },

      // Messages
      {
        tag: "div",
        attributes: [["id", "message"], ["style", { padding: "12px", marginBottom: "20px", borderRadius: "8px", display: "none" }]],
        children: []
      },

      // Formulaire d'inscription
      {
        tag: "div",
        attributes: [["style", { border: "1px solid #e0e0e0", padding: "35px", borderRadius: "12px", backgroundColor: "#fff", boxShadow: "0 4px 20px rgba(0,0,0,0.1)" }]],
        children: [
          {
            tag: "form",
            attributes: [["id", "signupForm"]],
            events: {
              submit: [
                async (event) => {
                  event.preventDefault();
                  await handleSignUp();
                }
              ]
            },
            children: [
              // Prénom et Nom sur la même ligne
              {
                tag: "div",
                attributes: [["style", { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15px", marginBottom: "20px" }]],
                children: [
                  // Prénom
                  {
                    tag: "div",
                    children: [
                      {
                        tag: "label",
                        attributes: [["for", "prenom"], ["style", { display: "block", fontWeight: "600", marginBottom: "8px", color: "#333" }]],
                        children: ["Prénom *"]
                      },
                      {
                        tag: "input",
                        attributes: [
                          ["type", "text"],
                          ["id", "prenom"],
                          ["name", "prenom"],
                          ["required", ""],
                          ["placeholder", "Votre prénom"],
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

                  // Nom
                  {
                    tag: "div",
                    children: [
                      {
                        tag: "label",
                        attributes: [["for", "nom"], ["style", { display: "block", fontWeight: "600", marginBottom: "8px", color: "#333" }]],
                        children: ["Nom *"]
                      },
                      {
                        tag: "input",
                        attributes: [
                          ["type", "text"],
                          ["id", "nom"],
                          ["name", "nom"],
                          ["required", ""],
                          ["placeholder", "Votre nom"],
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
                  }
                ]
              },

              // Email
              {
                tag: "div",
                attributes: [["style", { marginBottom: "20px" }]],
                children: [
                  {
                    tag: "label",
                    attributes: [["for", "email"], ["style", { display: "block", fontWeight: "600", marginBottom: "8px", color: "#333" }]],
                    children: ["Adresse email *"]
                  },
                  {
                    tag: "input",
                    attributes: [
                      ["type", "email"],
                      ["id", "email"],
                      ["name", "email"],
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
                attributes: [["style", { marginBottom: "20px" }]],
                children: [
                  {
                    tag: "label",
                    attributes: [["for", "password"], ["style", { display: "block", fontWeight: "600", marginBottom: "8px", color: "#333" }]],
                    children: ["Mot de passe *"]
                  },
                  {
                    tag: "input",
                    attributes: [
                      ["type", "password"],
                      ["id", "password"],
                      ["name", "password"],
                      ["required", ""],
                      ["minlength", "6"],
                      ["placeholder", "Minimum 6 caractères"],
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

              // Confirmation mot de passe
              {
                tag: "div",
                attributes: [["style", { marginBottom: "25px" }]],
                children: [
                  {
                    tag: "label",
                    attributes: [["for", "confirmPassword"], ["style", { display: "block", fontWeight: "600", marginBottom: "8px", color: "#333" }]],
                    children: ["Confirmer le mot de passe *"]
                  },
                  {
                    tag: "input",
                    attributes: [
                      ["type", "password"],
                      ["id", "confirmPassword"],
                      ["name", "confirmPassword"],
                      ["required", ""],
                      ["minlength", "6"],
                      ["placeholder", "Répétez votre mot de passe"],
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

              // Note sur les champs obligatoires
              {
                tag: "div",
                attributes: [["style", { marginBottom: "25px", padding: "12px", backgroundColor: "#e3f2fd", borderRadius: "8px", border: "1px solid #bbdefb" }]],
                children: [
                  {
                    tag: "p",
                    attributes: [["style", { margin: "0", fontSize: "14px", color: "#1565c0" }]],
                    children: ["ℹ️ Les champs marqués d'un * sont obligatoires"]
                  }
                ]
              },

              // Bouton inscription
              {
                tag: "button",
                attributes: [
                  ["type", "submit"],
                  ["style", { 
                    width: "100%", 
                    padding: "15px", 
                    backgroundColor: "#28a745", 
                    color: "white", 
                    border: "none", 
                    borderRadius: "8px", 
                    cursor: "pointer", 
                    fontSize: "17px", 
                    fontWeight: "bold",
                    transition: "background-color 0.3s ease"
                  }]
                ],
                children: ["🚀 Créer mon compte"]
              }
            ]
          }
        ]
      },

      // Lien vers connexion
      {
        tag: "div",
        attributes: [["style", { textAlign: "center", marginTop: "25px", padding: "20px", backgroundColor: "#f8f9fa", borderRadius: "8px" }]],
        children: [
          {
            tag: "p",
            attributes: [["style", { margin: "0 0 10px 0", color: "#666" }]],
            children: ["Vous avez déjà un compte ?"]
          },
          BrowserLink({ 
            link: "/connexion", 
            title: {
              tag: "span",
              attributes: [["style", { color: "#007bff", fontWeight: "600", textDecoration: "none" }]],
              children: ["🔐 Se connecter"]
            }
          })
        ]
      }
    ]
  };
}

async function handleSignUp() {
  const prenom = document.getElementById('prenom').value.trim();
  const nom = document.getElementById('nom').value.trim();
  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value;
  const confirmPassword = document.getElementById('confirmPassword').value;
  
  // Validations
  if (!prenom || !nom || !email || !password || !confirmPassword) {
    showMessage('Veuillez remplir tous les champs obligatoires', 'error');
    return;
  }
  
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
      showMessage('🎉 Inscription réussie ! Vérifiez votre email pour confirmer votre compte.', 'success');
      
      // Réinitialiser le formulaire
      document.getElementById('signupForm').reset();
      
      // Redirection vers connexion après 3 secondes
      setTimeout(() => {
        window.history.pushState({}, '', '/connexion');
        const popStateEvent = new PopStateEvent('popstate', { state: {} });
        window.dispatchEvent(popStateEvent);
      }, 3000);
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
  
  // Effacer le message après 5 secondes
  setTimeout(() => {
    messageDiv.style.display = 'none';
  }, 5000);
} 