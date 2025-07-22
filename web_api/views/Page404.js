import { BrowserLink as Link } from "../components/BrowserRouter.js";

const Page404 = function () {
  return {
    tag: "div",
    attributes: [
      ["class", "page-404"],
      ["style", {
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        color: "white",
        textAlign: "center",
        padding: "20px"
      }]
    ],
    children: [
      {
        tag: "div",
        attributes: [
          ["style", {
            background: "rgba(255, 255, 255, 0.1)",
            backdropFilter: "blur(10px)",
            borderRadius: "20px",
            padding: "60px 40px",
            boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
            border: "1px solid rgba(255, 255, 255, 0.2)",
            maxWidth: "600px",
            width: "100%"
          }]
        ],
        children: [
          {
            tag: "div",
            attributes: [
              ["style", {
                fontSize: "8rem",
                fontWeight: "bold",
                marginBottom: "20px",
                background: "linear-gradient(45deg, #ff6b6b, #feca57)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                textShadow: "2px 2px 4px rgba(0,0,0,0.3)"
              }]
            ],
            children: ["404"]
          },
          {
            tag: "h1",
            attributes: [
              ["style", { fontSize: "2.5rem", marginBottom: "15px", fontWeight: "600" }]
            ],
            children: ["Page introuvable"]
          },
          {
            tag: "p",
            attributes: [
              ["style", { fontSize: "1.2rem", marginBottom: "40px", opacity: "0.9", lineHeight: "1.6" }]
            ],
            children: ["Oops ! La page que vous recherchez semble avoir disparu dans l'espace numérique. Ne vous inquiétez pas, nous allons vous ramener en sécurité."]
          },
          {
            tag: "div",
            attributes: [
              ["style", { display: "flex", gap: "20px", justifyContent: "center", flexWrap: "wrap" }]
            ],
            children: [
              {
                tag: Link,
                attributes: [
                  ["link", "/home"],
                  ["title", "Retour à l'accueil"],
                  ["style", {
                    background: "linear-gradient(45deg, #ff6b6b, #ee5a52)",
                    color: "white",
                    padding: "15px 30px",
                    borderRadius: "50px",
                    textDecoration: "none",
                    fontWeight: "600",
                    transition: "all 0.3s ease",
                    boxShadow: "0 4px 15px rgba(255, 107, 107, 0.4)",
                    border: "none",
                    cursor: "pointer",
                    fontSize: "1rem"
                  }]
                ],
              },
              {
                tag: Link,
                attributes: [
                  ["link", "/events"],
                  ["title", "Voir les evénements"],
                  ["style", {
                    background: "rgba(255, 255, 255, 0.2)",
                    color: "white",
                    padding: "15px 30px",
                    borderRadius: "50px",
                    textDecoration: "none",
                    fontWeight: "600",
                    transition: "all 0.3s ease",
                    border: "2px solid rgba(255, 255, 255, 0.3)",
                    cursor: "pointer",
                    fontSize: "1rem"
                  }]
                ],
              }
            ]
          },
          {
            tag: "div",
            attributes: [
              ["style", {
                marginTop: "40px",
                paddingTop: "30px",
                borderTop: "1px solid rgba(255, 255, 255, 0.2)"
              }]
            ],
            children: [
              {
                tag: "p",
                attributes: [
                  ["style", { fontSize: "0.9rem", opacity: "0.7", margin: "0" }]
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
