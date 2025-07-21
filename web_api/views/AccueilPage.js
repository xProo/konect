import { BrowserLink } from "../components/BrowserRouter.js";

export default function AccueilPage() {
  return {
    tag: "div",
    attributes: [["style", { padding: "20px", maxWidth: "600px", margin: "0 auto" }]],
    children: [
  
      {
        tag: "nav",
        attributes: [["style", { marginBottom: "30px", padding: "15px", backgroundColor: "#f8f9fa", borderRadius: "5px", textAlign: "center" }]],
        children: [
          BrowserLink({ link: "/", title: "Accueil" }),
          " | ",
          BrowserLink({ link: "/inscription", title: "Inscription" }),
          " | ",
          BrowserLink({ link: "/connexion", title: "Connexion" }),
          " | ",
          BrowserLink({ link: "/home", title: "Tableau" }),
          " | ",
          BrowserLink({ link: "/gallery", title: "Galerie" })
        ]
      },
      
   
      {
        tag: "header",
        attributes: [["style", { textAlign: "center", marginBottom: "40px" }]],
        children: [
          {
            tag: "h1",
            attributes: [["style", { color: "#333", fontSize: "3em", marginBottom: "10px" }]],
            children: ["🎯 KONECT"]
          },
          {
            tag: "p",
            attributes: [["style", { color: "#666", fontSize: "1.2em" }]],
            children: ["Connectez-vous aux événements et communautés qui vous passionnent"]
          }
        ]
      },


      {
        tag: "div",
        attributes: [["style", { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginBottom: "40px" }]],
        children: [
          
          {
            tag: "div",
            attributes: [["style", { border: "1px solid #ddd", padding: "25px", borderRadius: "10px", backgroundColor: "#fff", boxShadow: "0 2px 10px rgba(0,0,0,0.1)", textAlign: "center" }]],
            children: [
              {
                tag: "h3",
                attributes: [["style", { color: "#28a745", marginBottom: "15px" }]],
                children: ["📝 Nouveau sur KONECT ?"]
              },
              {
                tag: "p",
                attributes: [["style", { marginBottom: "20px", color: "#666" }]],
                children: ["Créez votre compte pour découvrir des événements et rejoindre des communautés."]
              },
              {
                tag: "div",
                children: [
                  BrowserLink({ 
                    link: "/inscription", 
                    title: "S'inscrire maintenant"
                  })
                ],
                attributes: [["style", { padding: "10px 20px", backgroundColor: "#28a745", color: "white", border: "none", borderRadius: "5px", cursor: "pointer", fontSize: "16px", display: "inline-block", textDecoration: "none" }]]
              }
            ]
          },
          
         
          {
            tag: "div",
            attributes: [["style", { border: "1px solid #ddd", padding: "25px", borderRadius: "10px", backgroundColor: "#fff", boxShadow: "0 2px 10px rgba(0,0,0,0.1)", textAlign: "center" }]],
            children: [
              {
                tag: "h3",
                attributes: [["style", { color: "#007bff", marginBottom: "15px" }]],
                children: ["🔑 Déjà membre ?"]
              },
              {
                tag: "p",
                attributes: [["style", { marginBottom: "20px", color: "#666" }]],
                children: ["Connectez-vous pour accéder à votre tableau de bord."]
              },
              {
                tag: "div",
                children: [
                  BrowserLink({ 
                    link: "/connexion", 
                    title: "Se connecter"
                  })
                ],
                attributes: [["style", { padding: "10px 20px", backgroundColor: "#007bff", color: "white", border: "none", borderRadius: "5px", cursor: "pointer", fontSize: "16px", display: "inline-block", textDecoration: "none" }]]
              }
            ]
          }
        ]
      },

    
      {
        tag: "div",
        attributes: [["style", { backgroundColor: "#f8f9fa", padding: "30px", borderRadius: "10px", textAlign: "center" }]],
        children: [
          {
            tag: "h2",
            attributes: [["style", { color: "#333", marginBottom: "20px" }]],
            children: ["✨ Fonctionnalités"]
          },
          {
            tag: "div",
            attributes: [["style", { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "20px" }]],
            children: [
              {
                tag: "div",
                children: [
                  {
                    tag: "h4",
                    attributes: [["style", { color: "#007bff" }]],
                    children: ["🎪 Événements"]
                  },
                  {
                    tag: "p",
                    attributes: [["style", { color: "#666" }]],
                    children: ["Découvrez et participez aux événements près de chez vous"]
                  }
                ]
              },
              {
                tag: "div",
                children: [
                  {
                    tag: "h4",
                    attributes: [["style", { color: "#28a745" }]],
                    children: ["👥 Communautés"]
                  },
                  {
                    tag: "p",
                    attributes: [["style", { color: "#666" }]],
                    children: ["Rejoignez des communautés qui partagent vos passions"]
                  }
                ]
              },
              {
                tag: "div",
                children: [
                  {
                    tag: "h4",
                    attributes: [["style", { color: "#ffc107" }]],
                    children: ["🔍 Recherche"]
                  },
                  {
                    tag: "p",
                    attributes: [["style", { color: "#666" }]],
                    children: ["Trouvez exactement ce que vous recherchez"]
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