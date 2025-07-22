import Gallery from "../views/GalleryPage.js";
import Page404 from "../views/Page404.js";
import TablePage from "../views/TablePage.js";
import AuthPage from "../views/AuthPage.js";
import InscriptionPage from "../views/InscriptionPage.js";
import ConnexionPage from "../views/ConnexionPage.js";
import AccueilPage from "../views/AccueilPage.js";
import HomePage from "../views/HomePage.js";
import CommunityManagePage from "../views/CommunityManagePage.js";
import CommunityDashboardPage from "../views/CommunityDashboardPage.js";
import EventsPage from "../views/EventsPage.js";
import EventDetailPage from "../views/EventDetailPage.js";
import AdminPage from "../views/AdminPage.js";
import ProfileUser from "../views/ProfileUser.js";

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
  "/communities": {
    tag: CommunityManagePage,
  },
  "/community-dashboard": {
    tag: CommunityDashboardPage,
  },
  "/events": {
    tag: EventsPage,
  },
  "/event-detail": {
    tag: EventDetailPage,
  },
  "/admin": {
    tag: AdminPage,
  },
  "/profile": {
    tag: ProfileUser,
  },
  "*": {
    tag: Page404,
  },
};
