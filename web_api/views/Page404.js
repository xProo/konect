import { BrowserLink as Link } from "../components/BrowserRouter.js";

const Page404 = function () {
  return {
    tag: "div",
    attributes: [
      ["class", "page-404"],
      ["style", "min-height: 100vh; display: flex; flex-direction: column; align-items: center; justify-content: center; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; text-align: center; padding: 20px;"]
    ],
    children: [
      {
        tag: "div",
        attributes: [
          ["style", "background: rgba(255, 255, 255, 0.1); backdrop-filter: blur(10px); border-radius: 20px; padding: 60px 40px; box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1); border: 1px solid rgba(255, 255, 255, 0.2); max-width: 600px; width: 100%;"]
        ],
        children: [
          {
            tag: "div",
            attributes: [
              ["style", "font-size: 8rem; font-weight: bold; margin-bottom: 20px; background: linear-gradient(45deg, #ff6b6b, #feca57); -webkit-background-clip: text; -webkit-text-fill-color: transparent; text-shadow: 2px 2px 4px rgba(0,0,0,0.3);"]
            ],
            children: ["404"]
          },
          {
            tag: "h1",
            attributes: [
              ["style", "font-size: 2.5rem; margin-bottom: 15px; font-weight: 600;"]
            ],
            children: ["Page introuvable"]
          },
          {
            tag: "p",
            attributes: [
              ["style", "font-size: 1.2rem; margin-bottom: 40px; opacity: 0.9; line-height: 1.6;"]
            ],
            children: ["Oops ! La page que vous recherchez semble avoir disparu dans l'espace numérique. Ne vous inquiétez pas, nous allons vous ramener en sécurité."]
          },
          {
            tag: "div",
            attributes: [
              ["style", "display: flex; gap: 20px; justify-content: center; flex-wrap: wrap;"]
            ],
            children: [
              {
                tag: Link,
                attributes: [
                  ["link", "/home"],
                  ["title", "Retour à l'accueil"],
                  ["style", "background: linear-gradient(45deg, #ff6b6b, #ee5a52); color: white; padding: 15px 30px; border-radius: 50px; text-decoration: none; font-weight: 600; transition: all 0.3s ease; box-shadow: 0 4px 15px rgba(255, 107, 107, 0.4); border: none; cursor: pointer; font-size: 1rem;"]
                ],
              }
            ]
          },
          {
            tag: "div",
            attributes: [
              ["style", "margin-top: 40px; padding-top: 30px; border-top: 1px solid rgba(255, 255, 255, 0.2);"]
            ],
            children: [
              {
                tag: "p",
                attributes: [
                  ["style", "font-size: 0.9rem; opacity: 0.7; margin: 0;"]
                ],
                children: ["Code d'erreur: 404 • Page non trouvée"]
              }
            ]
          }
        ]
      }
    ],
  };
};

Page404.show = function () { };

export default Page404;
