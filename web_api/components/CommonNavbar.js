import { BrowserLink } from "./BrowserRouter.js";
import { auth, admin } from "../lib/supabase.js";

export function createCommonNavbar() {
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
              BrowserLink({
                link: "/events",
                title: {
                  tag: "div",
                  attributes: [["class", "nav-link"]],
                  children: [
                    {
                      tag: "div",
                      attributes: [["class", "label"]],
                      children: ["Événements"]
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
                attributes: [["id", "admin-nav-link"], ["style", { display: "none" }]],
                children: [
                  BrowserLink({
                    link: "/admin",
                    title: {
                      tag: "div",
                      attributes: [["class", "nav-link"], ["style", { color: "#dc3545", fontWeight: "600" }]],
                      children: [
                        {
                          tag: "div",
                          attributes: [["class", "label"]],
                          children: ["Admin"]
                        }
                      ]
                    }
                  })
                ]
              },
              //   {
              //     tag: "div",
              //     attributes: [["class", "nav-link"]],
              //     children: [
              //       {
              //         tag: "div",
              //         attributes: [["class", "label"]],
              //         children: ["Billeterie"]
              //       }
              //     ]
              //   },
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
                attributes: [["id", "user-display"], ["class", "user-section"]],
                children: [
                  {
                    tag: "span",
                    attributes: [["style", { color: "#666" }]],
                    children: ["Chargement..."]
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

export async function updateCommonUserDisplay() {
  const { data: { user } } = await auth.getCurrentUser();
  const userDisplay = document.getElementById('user-display');

  if (!userDisplay) return;

  await updateAdminNavLink(user);

  if (user) {
    let displayName = user.email;
    if (user.user_metadata && user.user_metadata.full_name) {
      displayName = user.user_metadata.full_name;
    } else if (user.user_metadata && user.user_metadata.prenom && user.user_metadata.nom) {
      displayName = `${user.user_metadata.prenom} ${user.user_metadata.nom}`;
    }

    userDisplay.innerHTML = `
      <div style="display: flex; align-items: center; gap: 15px;">
        <span style="color: #28a745; font-weight: bold;"> ${displayName}</span>
        <a href="/profile" style="text-decoration: none; padding: 8px 15px; background: #6c757d; color: white; border-radius: 5px; cursor: pointer; font-size: 14px;">
          👤 Profil
        </a>
        <button onclick="handleLogout()" style="padding: 8px 15px; background: #dc3545; color: white; border: none; border-radius: 5px; cursor: pointer; font-size: 14px;">
          🚪 Déconnexion
        </button>
      </div>
    `;
  } else {
    userDisplay.innerHTML = `
      <div style="display: flex; align-items: center; gap: 10px;">
        <a href="#/connexion" style="text-decoration: none; padding: 8px 15px; background: #007bff; color: white; border-radius: 5px; font-weight: bold;">
          🔐 Se connecter
        </a>
        <a href="#/inscription" style="text-decoration: none; padding: 8px 15px; background: #28a745; color: white; border-radius: 5px; font-weight: bold;">
          ✍️ S'inscrire
        </a>
      </div>
    `;
  }
}

export async function handleCommonLogout() {
  const { error } = await auth.signOut();
  if (error) {
    console.error('Erreur lors de la déconnexion:', error);
  } else {
    // Recharger la page pour mettre à jour l'état
    window.location.reload();
  }
}

async function updateAdminNavLink(user) {
  const adminNavLink = document.getElementById('admin-nav-link');

  if (!adminNavLink) return;

  if (user) {
    try {
      const isAdminUser = await admin.isAdmin();
      adminNavLink.style.display = isAdminUser ? 'block' : 'none';
    } catch (error) {
      console.error('Erreur lors de la vérification admin:', error);
      adminNavLink.style.display = 'none';
    }
  } else {
    adminNavLink.style.display = 'none';
  }
} 