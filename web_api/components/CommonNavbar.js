import { BrowserLink } from "./BrowserRouter.js";
import { auth, admin } from "../lib/supabase.js";

export function createCommonNavbar() {
  return {
    tag: "nav",
    attributes: [["style", {
      width: "100%",
      backgroundColor: "#ffffff",
      borderBottom: "1px solid #e5e7eb",
      position: "sticky",
      top: "0",
      zIndex: "1000",
      boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)"
    }]],
    children: [
      {
        tag: "div",
        attributes: [["style", {
          maxWidth: "1200px",
          margin: "0 auto",
          padding: "0 20px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          height: "64px"
        }]],
        children: [
          // Logo section
          {
            tag: "div",
            attributes: [["style", {
              display: "flex",
              alignItems: "center",
              gap: "8px",
              cursor: "pointer"
            }]],
            events: {
              click: [function () {
                window.location = "/";
              }]
            },
            children: [
              {
                tag: "img",
                attributes: [
                  ["src", "images/logo.svg"],
                  ["alt", "Qonect Logo"],
                  ["style", {
                    width: "32px",
                    height: "32px"
                  }]
                ]
              },
              {
                tag: "span",
                attributes: [["style", {
                  fontSize: "20px",
                  fontWeight: "600",
                  color: "#1f2937"
                }]],
                children: ["Qonect"]
              }
            ]
          },

          // Navigation links
          {
            tag: "div",
            attributes: [["style", {
              display: "flex",
              alignItems: "center",
              gap: "32px"
            }]],
            children: [
              // Location dropdown
              {
                tag: "div",
                attributes: [["style", {
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  cursor: "pointer",
                  padding: "8px 12px",
                  borderRadius: "6px",
                  transition: "background-color 0.2s"
                }]],
                children: [
                  {
                    tag: "span",
                    attributes: [["style", { fontSize: "18px" }]],
                  },
                  {
                    tag: "span",
                    attributes: [["style", {
                      color: "#6b7280",
                      fontSize: "14px",
                      fontWeight: "500"
                    }]],
                    children: ["Paris"]
                  },
                  {
                    tag: "span",
                    attributes: [["style", {
                      color: "#9ca3af",
                      fontSize: "12px",
                      transform: "rotate(90deg)"
                    }]],
                    children: ["❯"]
                  }
                ]
              },

              // Events dropdown
              createNavDropdown("Événement", "/events"),

              // Communities dropdown  
              createNavDropdown("Communauté", "/communities"),

              // Billeterie link
              {
                tag: "a",
                attributes: [
                  ["href", "/billeterie"],
                  ["style", {
                    color: "#6b7280",
                    fontSize: "14px",
                    fontWeight: "500",
                    textDecoration: "none",
                    padding: "8px 12px",
                    borderRadius: "6px",
                    transition: "all 0.2s"
                  }]
                ],
                children: ["Billeterie"]
              },

              // Help center dropdown
              createNavDropdown("Centre d'aide", "/help")
            ]
          },

          // User section
          {
            tag: "div",
            attributes: [["id", "user-display"], ["style", {
              display: "flex",
              alignItems: "center"
            }]],
            children: [
              {
                tag: "span",
                attributes: [["style", {
                  color: "#9ca3af",
                  fontSize: "14px",
                  fontWeight: "500"
                }]],
                children: ["Chargement..."]
              }
            ]
          }
        ]
      }
    ]
  };
}

function createNavDropdown(label, href) {
  return {
    tag: "div",
    attributes: [["style", {
      display: "flex",
      alignItems: "center",
      gap: "6px",
      cursor: "pointer",
      padding: "8px 12px",
      borderRadius: "6px",
      transition: "background-color 0.2s"
    }]],
    events: {
      mouseenter: [function () {
        this.style.backgroundColor = "#f9fafb";
      }],
      mouseleave: [function () {
        this.style.backgroundColor = "transparent";
      }],
      click: [function () {
        window.location = href;
      }]
    },
    children: [
      {
        tag: "span",
        attributes: [["style", {
          color: "#6b7280",
          fontSize: "14px",
          fontWeight: "500"
        }]],
        children: [label]
      },
      {
        tag: "span",
        attributes: [["style", {
          color: "#9ca3af",
          fontSize: "12px",
          transform: "rotate(90deg)",
          transition: "transform 0.2s"
        }]],
        children: ["❯"]
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

    // Créer un menu dropdown pour l'utilisateur connecté
    userDisplay.innerHTML = `
      <div style="position: relative; display: flex; align-items: center;">
        <div id="user-menu-button" style="
          display: flex; 
          align-items: center; 
          gap: 8px; 
          padding: 8px 12px; 
          border-radius: 8px; 
          cursor: pointer;
          transition: background-color 0.2s;
          border: 1px solid #e5e7eb;
          background: white;
        " onmouseover="this.style.backgroundColor='#f9fafb'" onmouseout="this.style.backgroundColor='white'">
          <div style="
            width: 32px; 
            height: 32px; 
            border-radius: 50%; 
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
            display: flex; 
            align-items: center; 
            justify-content: center; 
            color: white; 
            font-weight: 600;
            font-size: 14px;
          ">
            ${displayName.charAt(0).toUpperCase()}
          </div>
          <span style="
            color: #374151; 
            font-weight: 500; 
            font-size: 14px;
            max-width: 120px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          ">${displayName}</span>
          <span style="
            color: #9ca3af; 
            font-size: 12px; 
            transform: rotate(90deg);
            transition: transform 0.2s;
          ">❯</span>
        </div>
        
        <div id="user-dropdown" style="
          position: absolute;
          top: 100%;
          right: 0;
          margin-top: 8px;
          background: white;
          border: 1px solid #e5e7eb;
          border-radius: 8px;
          box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
          min-width: 200px;
          z-index: 1000;
          display: none;
          overflow: hidden;
        ">
          <div style="padding: 12px 16px; border-bottom: 1px solid #f3f4f6;">
            <div style="font-weight: 600; color: #111827; font-size: 14px;">${displayName}</div>
            <div style="color: #6b7280; font-size: 12px; margin-top: 2px;">${user.email}</div>
          </div>
          
          <div style="padding: 8px 0;">
            <a href="/profile" style="
              display: flex;
              align-items: center;
              gap: 12px;
              padding: 12px 16px;
              color: #374151;
              text-decoration: none;
              font-size: 14px;
              transition: background-color 0.2s;
            " onmouseover="this.style.backgroundColor='#f9fafb'" onmouseout="this.style.backgroundColor='transparent'">
<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><!-- Icon from Material Symbols by Google - https://github.com/google/material-design-icons/blob/master/LICENSE --><path fill="currentColor" d="M12 13q1.45 0 2.475-1.025T15.5 9.5t-1.025-2.475T12 6T9.525 7.025T8.5 9.5t1.025 2.475T12 13m-7 8q-.825 0-1.412-.587T3 19V5q0-.825.588-1.412T5 3h14q.825 0 1.413.588T21 5v14q0 .825-.587 1.413T19 21zm0-2h14v-1.15q-1.35-1.325-3.137-2.087T12 15t-3.863.763T5 17.85z"/></svg>
              <span>Mon Profil</span>
            </a>

            <a href="/admin" style="
              display: flex;
              align-items: center;
              gap: 12px;
              padding: 12px 16px;
              color: #513739ff;
              text-decoration: none;
              font-size: 14px;
              transition: background-color 0.2s;
            " onmouseover="this.style.backgroundColor='#f9fafb'" onmouseout="this.style.backgroundColor='transparent'">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><!-- Icon from Material Symbols by Google - https://github.com/google/material-design-icons/blob/master/LICENSE --><path fill="currentColor" d="M12 22q-3.475-.875-5.738-3.988T4 11.1V5l8-3l8 3v6.1q0 .25-.012.5t-.038.5q-.225-.05-.462-.075T19 12q-2.075 0-3.537 1.45T14 17v4.25q-.475.25-.975.438T12 22m4.85 0q-.35 0-.6-.25t-.25-.6v-3.3q0-.35.25-.6t.6-.25H17v-1q0-.825.588-1.412T19 14t1.413.588T21 16v1h.15q.35 0 .6.25t.25.6v3.3q0 .35-.25.6t-.6.25zM18 17h2v-1q0-.425-.288-.712T19 15t-.712.288T18 16z"/></svg>
              <span>Espace Admin</span>
            </a>
            
            <a href="/event-manage" style="
              display: flex;
              align-items: center;
              gap: 12px;
              padding: 12px 16px;
              color: #374151;
              text-decoration: none;
              font-size: 14px;
              transition: background-color 0.2s;
            " onmouseover="this.style.backgroundColor='#f9fafb'" onmouseout="this.style.backgroundColor='transparent'">
<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><!-- Icon from Material Symbols by Google - https://github.com/google/material-design-icons/blob/master/LICENSE --><path fill="currentColor" d="M17 22v-3h-3v-2h3v-3h2v3h3v2h-3v3zM5 20q-.825 0-1.412-.587T3 18V6q0-.825.588-1.412T5 4h1V2h2v2h6V2h2v2h1q.825 0 1.413.588T19 6v6.1q-.5-.075-1-.075t-1 .075V10H5v8h7q0 .5.075 1t.275 1z"/></svg>
              <span>Mes Événements</span>
            </a>
            
            <a href="/community-manage" style="
              display: flex;
              align-items: center;
              gap: 12px;
              padding: 12px 16px;
              color: #374151;
              text-decoration: none;
              font-size: 14px;
              transition: background-color 0.2s;
            " onmouseover="this.style.backgroundColor='#f9fafb'" onmouseout="this.style.backgroundColor='transparent'">
<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><!-- Icon from Material Symbols by Google - https://github.com/google/material-design-icons/blob/master/LICENSE --><path fill="currentColor" d="M0 18v-1.575q0-1.075 1.1-1.75T4 14q.325 0 .625.013t.575.062q-.35.525-.525 1.1t-.175 1.2V18zm6 0v-1.625q0-.8.438-1.463t1.237-1.162T9.588 13T12 12.75q1.325 0 2.438.25t1.912.75t1.225 1.163t.425 1.462V18zm13.5 0v-1.625q0-.65-.162-1.225t-.488-1.075q.275-.05.563-.062T20 14q1.8 0 2.9.663t1.1 1.762V18zM4 13q-.825 0-1.412-.587T2 11q0-.85.588-1.425T4 9q.85 0 1.425.575T6 11q0 .825-.575 1.413T4 13m16 0q-.825 0-1.412-.587T18 11q0-.85.588-1.425T20 9q.85 0 1.425.575T22 11q0 .825-.575 1.413T20 13m-8-1q-1.25 0-2.125-.875T9 9q0-1.275.875-2.137T12 6q1.275 0 2.138.863T15 9q0 1.25-.862 2.125T12 12"/></svg>
              <span>Mes Communautés</span>
            </a>
          </div>
          
          <div style="border-top: 1px solid #f3f4f6; padding: 8px 0;">
            <button onclick="handleLogout()" style="
              display: flex;
              align-items: center;
              gap: 12px;
              width: 100%;
              padding: 12px 16px;
              background: none;
              border: none;
              color: #dc2626;
              text-align: left;
              font-size: 14px;
              cursor: pointer;
              transition: background-color 0.2s;
            " onmouseover="this.style.backgroundColor='#fef2f2'" onmouseout="this.style.backgroundColor='transparent'">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><!-- Icon from Material Symbols by Google - https://github.com/google/material-design-icons/blob/master/LICENSE --><path fill="currentColor" d="M3 21v-2h2V5q0-.825.588-1.412T7 3h10q.825 0 1.413.588T19 5v14h2v2zm7-8q.425 0 .713-.288T11 12t-.288-.712T10 11t-.712.288T9 12t.288.713T10 13"/></svg>
              <span>Déconnexion</span>
            </button>
          </div>
        </div>
      </div>
    `;

    // Ajouter l'événement pour ouvrir/fermer le dropdown
    const menuButton = document.getElementById('user-menu-button');
    const dropdown = document.getElementById('user-dropdown');

    if (menuButton && dropdown) {
      menuButton.addEventListener('click', function (e) {
        e.stopPropagation();
        const isVisible = dropdown.style.display === 'block';
        dropdown.style.display = isVisible ? 'none' : 'block';

        // Rotation de la flèche
        const arrow = menuButton.querySelector('span:last-child');
        if (arrow) {
          arrow.style.transform = isVisible ? 'rotate(90deg)' : 'rotate(270deg)';
        }
      });

      // Fermer le dropdown quand on clique ailleurs
      document.addEventListener('click', function () {
        dropdown.style.display = 'none';
        const arrow = menuButton.querySelector('span:last-child');
        if (arrow) {
          arrow.style.transform = 'rotate(90deg)';
        }
      });
    }

  } else {
    // Interface pour utilisateur non connecté
    userDisplay.innerHTML = `
      <div style="display: flex; align-items: center; gap: 12px;">
        <a href="/connexion" style="
          color: #6b7280;
          text-decoration: none;
          font-size: 14px;
          font-weight: 500;
          padding: 8px 16px;
          border-radius: 6px;
          transition: all 0.2s;
          border: 1px solid transparent;
        " onmouseover="this.style.color='#374151'; this.style.backgroundColor='#f9fafb'" onmouseout="this.style.color='#6b7280'; this.style.backgroundColor='transparent'">
          Se connecter
        </a>
        
        <a href="/inscription" style="
          background: #ef4444;
          color: white;
          text-decoration: none;
          font-size: 14px;
          font-weight: 500;
          padding: 8px 16px;
          border-radius: 6px;
          transition: all 0.2s;
          border: 1px solid #ef4444;
        " onmouseover="this.style.backgroundColor='#dc2626'; this.style.borderColor='#dc2626'" onmouseout="this.style.backgroundColor='#ef4444'; this.style.borderColor='#ef4444'">
          S'inscrire
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