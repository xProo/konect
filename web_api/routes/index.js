import Gallery from "../views/GalleryPage.js";
import Page404 from "../views/Page404.js";
import TablePage from "../views/TablePage.js";
import AuthPage from "../views/AuthPage.js";
import InscriptionPage from "../views/InscriptionPage.js";
import ConnexionPage from "../views/ConnexionPage.js";
import AccueilPage from "../views/AccueilPage.js";
import HomePage from "../views/HomePage.js";

export default {
  "/": {
    tag: HomePage,
  },
  "/accueil": {
    tag: AccueilPage,
  },
  "/inscription": {
    tag: InscriptionPage,
  },
  "/connexion": {
    tag: ConnexionPage,
  },
  "/auth": {
    tag: AuthPage,
  },
  "/home": {
    tag: HomePage,
  },
  "/table": {
    tag: TablePage,
  },
  "/gallery": {
    tag: Gallery,
  },
  "*": {
    tag: Page404,
  },
};
