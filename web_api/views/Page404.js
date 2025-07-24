import { BrowserLink as Link } from "../components/BrowserRouter.js";

const Page404 = function () {
  return {
    tag: "div",
    attributes: [["class", "min-h-screen bg-white flex items-center justify-center p-8"]],
    children: [
      {
        tag: "div",
        attributes: [["class", "text-center max-w-md mx-auto"]],
        children: [
          // Simple 404 number
          {
            tag: "h1",
            attributes: [["class", "text-8xl font-light text-gray-900 mb-8"]],
            children: ["404"]
          },

          // Simple heading
          {
            tag: "h2",
            attributes: [["class", "text-2xl font-light text-gray-700 mb-6"]],
            children: ["Page introuvable"]
          },

          // Simple description
          {
            tag: "p",
            attributes: [["class", "text-gray-500 mb-8 leading-relaxed"]],
            children: ["La page que vous recherchez n'existe pas ou a été déplacée."]
          },

          // Simple buttons
          {
            tag: "div",
            attributes: [["class", "space-y-4"]],
            children: [
              {
                tag: "button",
                attributes: [
                  ["class", "w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium"],
                  ["onclick", "window.location.href = '/'"]
                ],
                children: ["Retour à l'accueil"]
              },
              {
                tag: "button",
                attributes: [
                  ["class", "w-full border border-gray-300 text-gray-700 py-3 px-6 rounded-lg hover:bg-gray-50 transition-colors duration-200"],
                  ["onclick", "window.location.href = '/events'"]
                ],
                children: ["Voir les événements"]
              }
            ]
          },

          // Simple footer
          {
            tag: "div",
            attributes: [["class", "mt-12 pt-8 border-t border-gray-200"]],
            children: [
              {
                tag: "p",
                attributes: [["class", "text-xs text-gray-400"]],
                children: ["Erreur 404 • Konect"]
              }
            ]
          }
        ]
      }
    ]
  };
};

Page404.show = function () { };

export default Page404;
