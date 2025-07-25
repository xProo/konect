import { auth, database } from "../lib/supabase.js";
import { BrowserLink } from "../components/BrowserRouter.js";
import {
  createCommonNavbar,
  updateCommonUserDisplay,
} from "../components/CommonNavbar.js";

export default function CommunityDetailPage() {
  // Initialiser la page après le rendu
  setTimeout(async () => {
    await updateCommonUserDisplay();
    await loadCommunityDetails();

    // Écouter les changements d'authentification
    auth.onAuthStateChange((event, session) => {
      updateCommonUserDisplay();
      loadCommunityDetails();
    });
  }, 100);

  return {
    tag: "div",
    attributes: [
      ["class", "min-h-screen bg-gradient-to-br from-slate-50 to-blue-50"],
    ],
    children: [createCommonNavbar(), createCommunityDetailContent()],
  };
}

function createCommunityDetailContent() {
  return {
    tag: "div",
    attributes: [
      ["class", "py-8"],
      ["id", "community-detail-container"],
    ],
    children: [createLoadingState()],
  };
}

function createLoadingState() {
  return {
    tag: "div",
    attributes: [["class", "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"]],
    children: [
      {
        tag: "div",
        attributes: [["class", "animate-pulse"]],
        children: [
          // Header skeleton
          {
            tag: "div",
            attributes: [
              ["class", "relative h-96 bg-gray-200 rounded-2xl mb-8"],
            ],
            children: [],
          },
          // Content skeleton
          {
            tag: "div",
            attributes: [["class", "grid grid-cols-1 lg:grid-cols-3 gap-8"]],
            children: [
              {
                tag: "div",
                attributes: [["class", "lg:col-span-2 space-y-4"]],
                children: [
                  {
                    tag: "div",
                    attributes: [["class", "h-8 bg-gray-200 rounded"]],
                    children: [],
                  },
                  {
                    tag: "div",
                    attributes: [["class", "h-4 bg-gray-200 rounded w-3/4"]],
                    children: [],
                  },
                  {
                    tag: "div",
                    attributes: [["class", "h-4 bg-gray-200 rounded w-1/2"]],
                    children: [],
                  },
                ],
              },
              {
                tag: "div",
                attributes: [["class", "space-y-4"]],
                children: [
                  {
                    tag: "div",
                    attributes: [["class", "h-32 bg-gray-200 rounded-lg"]],
                    children: [],
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
  };
}

let currentCommunity = null;

async function loadCommunityDetails() {
  const urlParams = new URLSearchParams(window.location.search);
  const communityId = urlParams.get("id");

  if (!communityId) {
    showError("ID de communauté manquant");
    return;
  }

  try {
    const result = await database.getCommunityById(communityId);
    if (result.data && result.data.length > 0) {
      currentCommunity = result.data[0];
      updateCommunityDisplay(currentCommunity);
      await loadCommunityEvents(communityId);
    } else {
      showError("Communauté non trouvée");
    }
  } catch (error) {
    console.error("Erreur lors du chargement de la communauté:", error);
    showError("Erreur lors du chargement de la communauté");
  }
}

function updateCommunityDisplay(community) {
  const container = document.getElementById("community-detail-container");
  if (!container) return;

  const memberCount = Math.floor(Math.random() * 100) + 10; // Simulation du nombre de membres
  const imageUrl = community.image_url || "images/event_1.jpg";

  container.innerHTML = `
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Hero Section -->
      <div class="relative h-96 rounded-2xl overflow-hidden mb-8">
        <img 
          class="w-full h-full object-cover" 
          src="${imageUrl}"
          alt="${community.name}"
          onerror="this.src='images/event_1.jpg'"
        />
        <div class="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>
        <div class="absolute bottom-0 left-0 right-0 p-8">
          <div class="flex items-center mb-4">
            <span class="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-4 py-2 rounded-full text-sm font-bold mr-4">
              ${community.category || "Général"}
            </span>
            <span class="text-white/80 text-sm">
              <svg class="w-4 h-4 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
              </svg>
              ${community.location || "Lieu non spécifié"}
            </span>
          </div>
          <h1 class="text-4xl md:text-5xl font-bold text-white mb-4">${
            community.name
          }</h1>
          <p class="text-xl text-white/90 max-w-3xl">${
            community.description || "Aucune description disponible"
          }</p>
        </div>
      </div>

      <!-- Content Grid -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Main Content -->
        <div class="lg:col-span-2">
          <!-- Description détaillée -->
          <div class="bg-white rounded-2xl shadow-lg p-8 mb-8">
            <h2 class="text-2xl font-bold text-gray-900 mb-6">À propos de la communauté</h2>
            <div class="prose prose-lg text-gray-600">
              <p>${
                community.description ||
                "Cette communauté n'a pas encore ajouté de description détaillée."
              }</p>
            </div>
          </div>

          <!-- Événements récents -->
          <div class="bg-white rounded-2xl shadow-lg p-8">
            <div class="flex items-center justify-between mb-6">
              <h2 class="text-2xl font-bold text-gray-900">Événements récents</h2>
              <button 
                onclick="window.location.href='/events?community=${
                  community.id
                }'"
                class="text-blue-600 hover:text-blue-700 font-medium text-sm flex items-center"
              >
                Voir tous les événements
                <svg class="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
                </svg>
              </button>
            </div>
            <div id="community-events-container">
              <div class="text-center py-8 text-gray-500">
                Chargement des événements...
              </div>
            </div>
          </div>
        </div>

        <!-- Sidebar -->
        <div class="space-y-6">
          <!-- Statistiques de la communauté -->
          <div class="bg-white rounded-2xl shadow-lg p-6">
            <h3 class="text-lg font-bold text-gray-900 mb-4">Statistiques</h3>
            <div class="space-y-4">
              <div class="flex items-center justify-between">
                <span class="text-gray-600">Membres</span>
                <span class="font-bold text-blue-600">${memberCount}</span>
              </div>
              <div class="flex items-center justify-between">
                <span class="text-gray-600">Événements organisés</span>
                <span class="font-bold text-green-600" id="events-count">-</span>
              </div>
              <div class="flex items-center justify-between">
                <span class="text-gray-600">Créée le</span>
                <span class="text-gray-800">${formatDate(
                  community.created_at
                )}</span>
              </div>
            </div>
          </div>

          <!-- Actions -->
          <div class="bg-white rounded-2xl shadow-lg p-6">
            <div class="space-y-3">
              <button 
                onclick="joinCommunity('${community.id}')"
                class="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold py-3 px-6 rounded-xl transition-all duration-300"
              >
                Rejoindre la communauté
              </button>
              <button 
                onclick="window.location.href='/community-dashboard?id=${
                  community.id
                }'"
                class="w-full border-2 border-gray-200 hover:border-blue-300 text-gray-700 hover:text-blue-600 font-medium py-3 px-6 rounded-xl transition-all duration-300"
              >
                Accéder au dashboard
              </button>
              <button 
                onclick="shareCommunity('${community.id}')"
                class="w-full border-2 border-gray-200 hover:border-green-300 text-gray-700 hover:text-green-600 font-medium py-3 px-6 rounded-xl transition-all duration-300"
              >
                Partager
              </button>
            </div>
          </div>

          <!-- Contact -->
          <div class="bg-white rounded-2xl shadow-lg p-6">
            <h3 class="text-lg font-bold text-gray-900 mb-4">Contact</h3>
            <div class="space-y-3">
              <div class="flex items-center text-sm text-gray-600">
                <svg class="w-4 h-4 mr-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                </svg>
                <span>${community.contact_email || "Non spécifié"}</span>
              </div>
              <div class="flex items-center text-sm text-gray-600">
                <svg class="w-4 h-4 mr-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>
                </svg>
                <span>${community.contact_phone || "Non spécifié"}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
}

async function loadCommunityEvents(communityId) {
  try {
    const result = await database.getEventsByCommunity(communityId);
    const events = result.data || [];

    // Mettre à jour le compteur d'événements
    const eventsCountElement = document.getElementById("events-count");
    if (eventsCountElement) {
      eventsCountElement.textContent = events.length;
    }

    updateEventsDisplay(events);
  } catch (error) {
    console.error("Erreur lors du chargement des événements:", error);
    const container = document.getElementById("community-events-container");
    if (container) {
      container.innerHTML = `
        <div class="text-center py-8 text-red-500">
          Erreur lors du chargement des événements
        </div>
      `;
    }
  }
}

function updateEventsDisplay(events) {
  const container = document.getElementById("community-events-container");
  if (!container) return;

  if (events.length === 0) {
    container.innerHTML = `
      <div class="text-center py-8 text-gray-500">
        <div class="text-4xl mb-4">📅</div>
        <p>Aucun événement organisé pour le moment</p>
      </div>
    `;
    return;
  }

  const eventsHTML = events
    .slice(0, 3)
    .map(
      (event) => `
    <div class="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer" onclick="window.location.href='/event-detail?id=${
      event.id
    }'">
      <div class="flex items-start space-x-4">
        <div class="flex-shrink-0">
          <img 
            class="w-16 h-16 rounded-lg object-cover" 
            src="${event.image_url || "images/event_1.jpg"}"
            alt="${event.title}"
            onerror="this.src='images/event_1.jpg'"
          />
        </div>
        <div class="flex-1 min-w-0">
          <h4 class="text-lg font-semibold text-gray-900 line-clamp-1">${
            event.title
          }</h4>
          <p class="text-sm text-gray-600 line-clamp-2 mb-2">${
            event.description || ""
          }</p>
          <div class="flex items-center text-sm text-gray-500">
            <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
            </svg>
            <span>${formatDate(event.event_date)}</span>
          </div>
        </div>
      </div>
    </div>
  `
    )
    .join("");

  container.innerHTML = eventsHTML;
}

function showError(message) {
  const container = document.getElementById("community-detail-container");
  if (container) {
    container.innerHTML = `
      <div class="max-w-2xl mx-auto text-center py-16">
        <div class="text-red-400 text-6xl mb-4">⚠️</div>
        <h2 class="text-2xl font-bold text-gray-900 mb-4">Erreur</h2>
        <p class="text-gray-600 mb-8">${message}</p>
        <button 
          onclick="window.location.href='/communities'"
          class="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-xl transition-colors"
        >
          Retour aux communautés
        </button>
      </div>
    `;
  }
}

function formatDate(dateString) {
  if (!dateString) return "Non spécifié";
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString("fr-FR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  } catch {
    return "Date invalide";
  }
}

function joinCommunity(communityId) {
  // TODO: Implémenter la fonctionnalité pour rejoindre une communauté
  console.log("Rejoindre la communauté:", communityId);
  alert("Fonctionnalité en cours de développement");
}

function shareCommunity(communityId) {
  if (navigator.share) {
    navigator.share({
      title: currentCommunity?.name || "Communauté Konect",
      text:
        currentCommunity?.description ||
        "Découvrez cette communauté sur Konect",
      url: window.location.href,
    });
  } else {
    // Fallback pour les navigateurs qui ne supportent pas l'API Web Share
    navigator.clipboard
      .writeText(window.location.href)
      .then(() => {
        alert("Lien copié dans le presse-papiers !");
      })
      .catch(() => {
        alert("Impossible de copier le lien");
      });
  }
}

// Exports globaux
window.loadCommunityDetails = loadCommunityDetails;
window.joinCommunity = joinCommunity;
window.shareCommunity = shareCommunity;
