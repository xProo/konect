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
import CommunityDetailPage from "../views/CommunityDetailPage.js";
import CommunitiesPage from "../views/CommunitiesPage.js";
import EventsPage from "../views/EventsPage.js";
import EventDetailPage from "../views/EventDetailPage.js";
import EventManagePage from "../views/EventManagePage.js";
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
    tag: CommunitiesPage,
  },
  "/community-manage": {
    tag: CommunityManagePage,
  },
  "/community-dashboard": {
    tag: CommunityDashboardPage,
  },
  "/community-detail": {
    tag: CommunityDetailPage,
  },
  "/events": {
    tag: EventsPage,
  },
  "/event-detail": {
    tag: EventDetailPage,
  },
  "/event-manage": {
    tag: EventManagePage,
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
