import { auth, database } from "../lib/supabase.js";
import { BrowserLink } from "../components/BrowserRouter.js";
import {
  createCommonNavbar,
  updateCommonUserDisplay,
} from "../components/CommonNavbar.js";

export default function CommunitiesPage() {
  // Initialiser la page après le rendu
  setTimeout(async () => {
    await updateCommonUserDisplay();
    await loadAllCommunities();

    // Écouter les changements d'authentification
    auth.onAuthStateChange((event, session) => {
      updateCommonUserDisplay();
      loadAllCommunities();
    });
  }, 100);

  return {
    tag: "div",
    attributes: [
      ["class", "min-h-screen bg-gradient-to-br from-slate-50 to-blue-50"],
    ],
    children: [
      createCommonNavbar(),
      createHeroSection(),
      createCommunitiesSection(),
      createCtaSection(),
    ],
  };
}

// Hero Section
function createHeroSection() {
  return {
    tag: "section",
    attributes: [
      ["class", "bg-gradient-to-r from-blue-600 to-purple-600 py-20"],
    ],
    children: [
      {
        tag: "div",
        attributes: [
          ["class", "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center"],
        ],
        children: [
          {
            tag: "h1",
            attributes: [
              ["class", "text-4xl md:text-6xl font-bold text-white mb-6"],
            ],
            children: ["Découvrez nos communautés"],
          },
          {
            tag: "p",
            attributes: [
              ["class", "text-xl text-blue-100 max-w-3xl mx-auto mb-8"],
            ],
            children: [
              "Rejoignez des communautés passionnées et connectez-vous avec des personnes qui partagent vos centres d'intérêt.",
            ],
          },
          {
            tag: "div",
            attributes: [
              ["class", "flex flex-col sm:flex-row gap-4 justify-center"],
            ],
            children: [
              {
                tag: "button",
                attributes: [
                  [
                    "class",
                    "bg-white text-blue-600 font-bold py-3 px-8 rounded-xl hover:bg-blue-50 transition-colors duration-300",
                  ],
                  ["onclick", "scrollToCommunities()"],
                ],
                children: ["Explorer les communautés"],
              },
              {
                tag: "button",
                attributes: [
                  [
                    "class",
                    "border-2 border-white text-white font-semibold py-3 px-8 rounded-xl hover:bg-white hover:text-blue-600 transition-all duration-300",
                  ],
                  ["onclick", "window.location.href = '/community-manage'"],
                ],
                children: ["Créer une communauté"],
              },
            ],
          },
        ],
      },
    ],
  };
}

// Section des communautés
function createCommunitiesSection() {
  return {
    tag: "section",
    attributes: [
      ["class", "py-20"],
      ["id", "communities-list"],
    ],
    children: [
      {
        tag: "div",
        attributes: [["class", "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"]],
        children: [
          {
            tag: "div",
            attributes: [["class", "text-center mb-16"]],
            children: [
              {
                tag: "h2",
                attributes: [
                  [
                    "class",
                    "text-3xl md:text-4xl font-bold text-gray-900 mb-6",
                  ],
                ],
                children: ["Toutes les communautés"],
              },
              {
                tag: "p",
                attributes: [["class", "text-xl text-gray-600"]],
                children: ["Trouvez la communauté qui vous correspond"],
              },
            ],
          },
          {
            tag: "div",
            attributes: [
              ["class", "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"],
              ["id", "communities-container"],
            ],
            children: [
              createLoadingPlaceholder(),
              createLoadingPlaceholder(),
              createLoadingPlaceholder(),
            ],
          },
        ],
      },
    ],
  };
}

function createLoadingPlaceholder() {
  return {
    tag: "div",
    attributes: [
      ["class", "bg-white rounded-2xl shadow-lg overflow-hidden animate-pulse"],
    ],
    children: [
      {
        tag: "div",
        attributes: [["class", "h-48 bg-gray-200"]],
        children: [],
      },
      {
        tag: "div",
        attributes: [["class", "p-6"]],
        children: [
          {
            tag: "div",
            attributes: [["class", "h-6 bg-gray-200 rounded mb-4"]],
            children: [],
          },
          {
            tag: "div",
            attributes: [["class", "h-4 bg-gray-200 rounded mb-2"]],
            children: [],
          },
          {
            tag: "div",
            attributes: [["class", "h-4 bg-gray-200 rounded w-2/3"]],
            children: [],
          },
        ],
      },
    ],
  };
}

// Section CTA
function createCtaSection() {
  return {
    tag: "section",
    attributes: [["class", "bg-gray-900 py-16"]],
    children: [
      {
        tag: "div",
        attributes: [
          ["class", "max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8"],
        ],
        children: [
          {
            tag: "h2",
            attributes: [
              ["class", "text-3xl md:text-4xl font-bold text-white mb-6"],
            ],
            children: ["Créez votre propre communauté"],
          },
          {
            tag: "p",
            attributes: [["class", "text-xl text-gray-300 mb-8"]],
            children: [
              "Rassemblez des personnes autour de votre passion et organisez des événements inoubliables.",
            ],
          },
          {
            tag: "button",
            attributes: [
              [
                "class",
                "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold py-4 px-8 rounded-xl transition-all duration-300 transform hover:scale-105",
              ],
              ["onclick", "window.location.href = '/community-manage'"],
            ],
            children: ["Créer une communauté"],
          },
        ],
      },
    ],
  };
}

// Fonctions utilitaires
let allCommunities = [];

async function loadAllCommunities() {
  try {
    const result = await database.getCommunities();
    allCommunities = result.data || [];
    updateCommunitiesDisplay(allCommunities);
  } catch (error) {
    console.error("Erreur lors du chargement des communautés:", error);
    showError("Erreur lors du chargement des communautés");
  }
}

function updateCommunitiesDisplay(communities) {
  const container = document.getElementById("communities-container");
  if (!container) return;

  if (communities.length === 0) {
    container.innerHTML = `
      <div class="col-span-full text-center py-12">
        <div class="text-gray-400 text-6xl mb-4">👥</div>
        <h3 class="text-xl font-semibold text-gray-600 mb-2">Aucune communauté trouvée</h3>
        <p class="text-gray-500">Soyez le premier à créer une communauté !</p>
      </div>
    `;
    return;
  }

  const communitiesHTML = communities
    .map((community) => createCommunityCardHTML(community))
    .join("");
  container.innerHTML = communitiesHTML;
}

function createCommunityCardHTML(community) {
  const memberCount = Math.floor(Math.random() * 100) + 10; // Simulation du nombre de membres
  const imageUrl = community.image_url || "images/event_1.jpg";

  return `
    <div class="group cursor-pointer bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 overflow-hidden border border-gray-100" onclick="goToCommunityDetail('${
      community.id
    }')">
      <div class="relative h-48 overflow-hidden">
        <img 
          class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
          src="${imageUrl}"
          alt="${community.name}"
          onerror="this.src='images/event_1.jpg'"
        />
        <div class="absolute top-4 right-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white px-3 py-1 rounded-full text-xs font-bold">
          ${community.category || "Général"}
        </div>
        <div class="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      </div>
      
      <div class="p-6">
        <h3 class="text-xl font-bold text-gray-900 mb-3 line-clamp-1 group-hover:text-blue-600 transition-colors">
          ${community.name}
        </h3>
        
        <p class="text-gray-600 text-sm mb-4 line-clamp-2 leading-relaxed">
          ${community.description || "Aucune description disponible"}
        </p>
        
        <div class="flex items-center justify-between text-sm text-gray-500 mb-4">
          <div class="flex items-center">
            <svg class="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
            </svg>
            <span class="truncate">${
              community.location || "Lieu non spécifié"
            }</span>
          </div>
          <div class="flex items-center">
            <svg class="w-4 h-4 mr-1 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"/>
            </svg>
            <span>${memberCount} membres</span>
          </div>
        </div>
        
        <div class="flex items-center justify-between">
          <button class="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-2 rounded-xl font-medium transition-all duration-300 transform hover:scale-105 text-sm">
            Voir la communauté
          </button>
          <button class="text-gray-400 hover:text-blue-600 transition-colors duration-200" onclick="event.stopPropagation(); toggleFavoriteCommunity('${
            community.id
          }')">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>
            </svg>
          </button>
        </div>
      </div>
    </div>
  `;
}

function showError(message) {
  const container = document.getElementById("communities-container");
  if (container) {
    container.innerHTML = `
      <div class="col-span-full text-center py-12">
        <div class="text-red-400 text-6xl mb-4">⚠️</div>
        <h3 class="text-xl font-semibold text-red-600 mb-2">Erreur</h3>
        <p class="text-gray-500">${message}</p>
      </div>
    `;
  }
}

// Fonctions de navigation
function goToCommunityDetail(communityId) {
  window.location.href = `/community-detail?id=${communityId}`;
}

function goToCommunityDashboard(communityId) {
  window.location.href = `/community-dashboard?id=${communityId}`;
}

function toggleFavoriteCommunity(communityId) {
  // TODO: Implémenter la fonctionnalité de favoris
  console.log("Toggle favorite for community:", communityId);
}

function scrollToCommunities() {
  const section = document.getElementById("communities-list");
  if (section) {
    section.scrollIntoView({ behavior: "smooth" });
  }
}

// Exports globaux
window.loadAllCommunities = loadAllCommunities;
window.goToCommunityDetail = goToCommunityDetail;
window.goToCommunityDashboard = goToCommunityDashboard;
window.toggleFavoriteCommunity = toggleFavoriteCommunity;
window.scrollToCommunities = scrollToCommunities;
