import { auth, database } from "../lib/supabase.js";
import { createCommonNavbar, updateCommonUserDisplay } from "../components/CommonNavbar.js";
import { BrowserLink } from "../components/BrowserRouter.js";

export default function ProfileUser() {
  setTimeout(async () => {
    await updateCommonUserDisplay();
    await loadUserProfile();

    auth.onAuthStateChange((event, session) => {
      updateCommonUserDisplay();
      if (session) {
        loadUserProfile();
      } else {
        window.location = "/connexion";
      }
    });
  }, 100);

  return {
    tag: "div",
    children: [
      createCommonNavbar(),
      createProfileContent()
    ]
  };
}

function createProfileContent() {
  return {
    tag: "div",
    attributes: [["class", "profile-container"], ["style", {
      maxWidth: "800px",
      margin: "0 auto",
      padding: "20px",
      fontFamily: "Arial, sans-serif"
    }]],
    children: [
      // En-tête
      {
        tag: "div",
        attributes: [["class", "profile-header"], ["style", {
          textAlign: "center",
          marginBottom: "30px",
          padding: "20px",
          backgroundColor: "#f8f9fa",
          borderRadius: "10px"
        }]],
        children: [
          {
            tag: "h1",
            attributes: [["style", {
              color: "#333",
              marginBottom: "10px",
              fontSize: "2.5em"
            }]],
            children: ["Mon Profil"]
          },
          {
            tag: "p",
            attributes: [["style", {
              color: "#666",
              fontSize: "1.1em"
            }]],
            children: ["Consultez et modifiez vos informations personnelles"]
          }
        ]
      },

      {
        tag: "div",
        attributes: [["id", "profile-messages"], ["style", { marginBottom: "20px" }]],
        children: []
      },

      {
        tag: "div",
        attributes: [["class", "profile-form"], ["style", {
          backgroundColor: "white",
          padding: "30px",
          borderRadius: "10px",
          boxShadow: "0 2px 10px rgba(0,0,0,0.1)"
        }]],
        children: [
          {
            tag: "h2",
            attributes: [["style", {
              marginBottom: "20px",
              color: "#333",
              borderBottom: "2px solid #007bff",
              paddingBottom: "10px"
            }]],
            children: ["Informations personnelles"]
          },

          // Email (lecture seule)
          createFormGroup("Email", {
            tag: "input",
            attributes: [
              ["type", "email"],
              ["id", "profile-email"],
              ["readonly", "true"],
              ["style", {
                width: "100%",
                padding: "12px",
                border: "1px solid #ddd",
                borderRadius: "5px",
                backgroundColor: "#f8f9fa",
                fontSize: "16px"
              }]
            ]
          }, "Votre email ne peut pas être modifié"),

          createFormGroup("Prénom", {
            tag: "input",
            attributes: [
              ["type", "text"],
              ["id", "profile-prenom"],
              ["placeholder", "Votre prénom"],
              ["style", {
                width: "100%",
                padding: "12px",
                border: "1px solid #ddd",
                borderRadius: "5px",
                fontSize: "16px"
              }]
            ]
          }),

          createFormGroup("Nom", {
            tag: "input",
            attributes: [
              ["type", "text"],
              ["id", "profile-nom"],
              ["placeholder", "Votre nom"],
              ["style", {
                width: "100%",
                padding: "12px",
                border: "1px solid #ddd",
                borderRadius: "5px",
                fontSize: "16px"
              }]
            ]
          }),

          {
            tag: "div",
            attributes: [["class", "profile-actions"], ["style", {
              display: "flex",
              gap: "10px",
              marginTop: "30px",
              justifyContent: "space-between"
            }]],
            children: [
              {
                tag: "button",
                attributes: [
                  ["id", "save-profile-btn"],
                  ["style", {
                    flex: "1",
                    padding: "12px 20px",
                    backgroundColor: "#28a745",
                    color: "white",
                    border: "none",
                    borderRadius: "5px",
                    cursor: "pointer",
                    fontSize: "16px",
                    fontWeight: "bold"
                  }]
                ],
                events: {
                  click: [handleSaveProfile]
                },
                children: ["💾 Sauvegarder"]
              }
            ]
          }
        ]
      },

      {
        tag: "div",
        attributes: [["class", "password-section"], ["style", {
          backgroundColor: "white",
          padding: "30px",
          borderRadius: "10px",
          boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
          marginTop: "20px"
        }]],
        children: [
          {
            tag: "h2",
            attributes: [["style", {
              marginBottom: "20px",
              color: "#333",
              borderBottom: "2px solid #dc3545",
              paddingBottom: "10px"
            }]],
            children: ["Sécurité"]
          },

          createFormGroup("Nouveau mot de passe", {
            tag: "input",
            attributes: [
              ["type", "password"],
              ["id", "new-password"],
              ["placeholder", "Entrez votre nouveau mot de passe"],
              ["style", {
                width: "100%",
                padding: "12px",
                border: "1px solid #ddd",
                borderRadius: "5px",
                fontSize: "16px"
              }]
            ]
          }),

          createFormGroup("Confirmer le mot de passe", {
            tag: "input",
            attributes: [
              ["type", "password"],
              ["id", "confirm-password"],
              ["placeholder", "Confirmez votre nouveau mot de passe"],
              ["style", {
                width: "100%",
                padding: "12px",
                border: "1px solid #ddd",
                borderRadius: "5px",
                fontSize: "16px"
              }]
            ]
          }),

          {
            tag: "button",
            attributes: [
              ["id", "change-password-btn"],
              ["style", {
                width: "100%",
                padding: "12px 20px",
                backgroundColor: "#dc3545",
                color: "white",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
                fontSize: "16px",
                fontWeight: "bold",
                marginTop: "15px"
              }]
            ],
            events: {
              click: [handleChangePassword]
            },
            children: ["🔒 Changer le mot de passe"]
          }
        ]
      }
    ]
  };
}

function createFormGroup(label, inputElement, helpText = null) {
  const children = [
    {
      tag: "label",
      attributes: [["style", {
        display: "block",
        marginBottom: "8px",
        fontWeight: "bold",
        color: "#333",
        fontSize: "14px"
      }]],
      children: [label]
    },
    inputElement
  ];

  if (helpText) {
    children.push({
      tag: "small",
      attributes: [["style", {
        color: "#6c757d",
        fontSize: "12px",
        marginTop: "5px",
        display: "block"
      }]],
      children: [helpText]
    });
  }

  return {
    tag: "div",
    attributes: [["class", "form-group"], ["style", { marginBottom: "20px" }]],
    children: children
  };
}

async function loadUserProfile() {
  try {
    const { data: { user } } = await auth.getCurrentUser();
    if (!user) {
      showMessage("Vous devez être connecté pour accéder à cette page", "error");
      window.location.hash = "/connexion";
      return;
    }

    const profile = await database.getUserProfile(user.id);

    if (profile) {
      const emailField = document.getElementById('profile-email');
      const prenomField = document.getElementById('profile-prenom');
      const nomField = document.getElementById('profile-nom');

      if (emailField) emailField.value = profile.email || user.email || '';
      if (prenomField) prenomField.value = profile.prenom || '';
      if (nomField) nomField.value = profile.nom || '';
    } else {
      await database.createUserProfile({
        id: user.id,
        email: user.email,
        prenom: '',
        nom: '',
        full_name: user.email
      });

      await loadUserProfile();
    }
  } catch (error) {
    console.error('Erreur lors du chargement du profil:', error);
    showMessage("Erreur lors du chargement du profil", "error");
  }
}
async function handleSaveProfile() {
  try {
    const { data: { user } } = await auth.getCurrentUser();
    if (!user) {
      showMessage("Vous devez être connecté", "error");
      return;
    }

    const prenom = document.getElementById('profile-prenom').value.trim();
    const nom = document.getElementById('profile-nom').value.trim();

    if (!prenom || !nom) {
      showMessage("Veuillez remplir tous les champs", "error");
      return;
    }

    const success = await database.updateUserProfile(user.id, {
      prenom: prenom,
      nom: nom,
      full_name: `${prenom} ${nom}`
    });

    if (success) {
      showMessage("Profil mis à jour avec succès !", "success");
    } else {
      showMessage("Erreur lors de la mise à jour du profil", "error");
    }
  } catch (error) {
    console.error('Erreur lors de la sauvegarde:', error);
    showMessage("Erreur lors de la sauvegarde", "error");
  }
}

async function handleCancelEdit() {
  await loadUserProfile(); // Recharger les données originales
  showMessage("Modifications annulées", "info");
}

async function handleChangePassword() {
  try {
    const newPassword = document.getElementById('new-password').value;
    const confirmPassword = document.getElementById('confirm-password').value;

    if (!newPassword || !confirmPassword) {
      showMessage("Veuillez remplir tous les champs de mot de passe", "error");
      return;
    }

    if (newPassword !== confirmPassword) {
      showMessage("Les mots de passe ne correspondent pas", "error");
      return;
    }

    if (newPassword.length < 6) {
      showMessage("Le mot de passe doit contenir au moins 6 caractères", "error");
      return;
    }

    const success = await auth.updatePassword(newPassword);

    if (success) {
      showMessage("Mot de passe changé avec succès !", "success");
      document.getElementById('new-password').value = '';
      document.getElementById('confirm-password').value = '';
    } else {
      showMessage("Erreur lors du changement de mot de passe", "error");
    }
  } catch (error) {
    console.error('Erreur lors du changement de mot de passe:', error);
    showMessage("Erreur lors du changement de mot de passe", "error");
  }
}

function showMessage(message, type = "info") {
  const messagesContainer = document.getElementById('profile-messages');
  if (!messagesContainer) return;

  const colors = {
    success: "#d4edda",
    error: "#f8d7da",
    info: "#d1ecf1"
  };

  const textColors = {
    success: "#155724",
    error: "#721c24",
    info: "#0c5460"
  };

  const messageElement = {
    tag: "div",
    attributes: [["style", {
      padding: "12px",
      borderRadius: "5px",
      marginBottom: "10px",
      backgroundColor: colors[type] || colors.info,
      color: textColors[type] || textColors.info,
      border: `1px solid ${colors[type] || colors.info}`
    }]],
    children: [message]
  };

  messagesContainer.innerHTML = '';

  const msgElement = document.createElement('div');
  msgElement.style.padding = "12px";
  msgElement.style.borderRadius = "5px";
  msgElement.style.marginBottom = "10px";
  msgElement.style.backgroundColor = colors[type] || colors.info;
  msgElement.style.color = textColors[type] || textColors.info;
  msgElement.style.border = `1px solid ${colors[type] || colors.info}`;
  msgElement.textContent = message;

  messagesContainer.appendChild(msgElement);

  setTimeout(() => {
    if (msgElement.parentNode) {
      msgElement.parentNode.removeChild(msgElement);
    }
  }, 5000);
}
