# Qonect – Plateforme de gestion de communautés et événements

Qonect est une plateforme web permettant aux utilisateurs de rejoindre des communautés, de s’inscrire à des événements, et aux administrateurs/référents de gérer l’ensemble des activités.

---

## Démarrage rapide

1. Ouvrez un terminal dans le dossier du projet.
2. Lancez le serveur local avec la commande :
   ```bash
   php -S localhost:8000

3. Ouvrez votre navigateur sur http://localhost:8000.




---

Prérequis

PHP installé (≥ 8.0).

Navigateur moderne (Chrome, Firefox, Edge).

Compte Supabase (si vous voulez connecter l’API).



---

Structure principale

Le projet fonctionne en mode statique (pas de backend classique).

Les fichiers principaux se trouvent dans le dossier web_api/.

Organisation des dossiers :


web_api/
├── assets/            # Images et icônes
├── css/               # Feuilles de style
├── js/                # Scripts JavaScript (composants, router)
├── index.html         # Page d'accueil
└── events.html        # Page événements


---

Liens utiles

Site en production : https://konect-two.vercel.app/

Prototype Figma : Qonect – Figma



---

Fonctionnalités principales

Utilisateur :

Inscription / connexion.

Accès aux communautés et événements.

Profil utilisateur avec historique d’événements.


Référent :

CRUD (création, modification, suppression) d’événements.

Gestion des membres de communauté.


Administrateur :

Gestion globale (communautés, événements, utilisateurs).

Tableau de bord centralisé.




---

Stack technique

Front-end : HTML, CSS, JavaScript Vanilla.

UI : Tailwind CSS pour un design rapide et responsive.

Routing : Router maison (BrowserRouter, generateStructure, Component.js).

Back-end / BaaS : Supabase (PostgreSQL, Auth).

Hébergement : Vercel.

Design : Figma.



---

Tests et recettage

CRUD communautés et événements validé.

Authentification utilisateur/référent/admin testée.

UI responsive (mobile et desktop).
