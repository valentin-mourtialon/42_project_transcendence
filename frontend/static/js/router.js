import {
  loadHomePage,
  initTournamentsComponent,
} from "./views/userHomeView.js";
import { setupLoginForm, setupRegisterForm } from "./auth.js";

function getUserIdFromLocalStorage() {
  const token = localStorage.getItem("access");
  if (!token) return null;
  return localStorage.getItem("userId");
}

const isAuthenticated = () => {
  return !!localStorage.getItem("access");
};

const router = async () => {
  const routes = [
    { path: "/", templateId: "template-index", requiresAuth: false },
    { path: "/login", templateId: "template-login", requiresAuth: false },
    { path: "/register", templateId: "template-register", requiresAuth: false },
    { path: "/user/:id", templateId: "template-user-home", requiresAuth: true },
  ];

  if (location.pathname === "/") {
    if (isAuthenticated()) {
      const userId = getUserIdFromLocalStorage();
      if (userId) {
        navigateTo(`/user/${userId}`);
        return;
      }
    } else {
      navigateTo("/login");
      return;
    }
  }

  // Test each route for potential match
  const potentialMatches = routes.map((route) => {
    const pathSegments = route.path
      .split("/")
      .filter((segment) => segment !== "");
    const urlSegments = location.pathname
      .split("/")
      .filter((segment) => segment !== "");

    if (pathSegments.length !== urlSegments.length) {
      return { route, isMatch: false, params: {} };
    }

    const params = {};
    const isMatch = pathSegments.every((segment, index) => {
      if (segment.startsWith(":")) {
        params[segment.slice(1)] = urlSegments[index];
        return true;
      }
      return segment === urlSegments[index];
    });

    return { route, isMatch, params };
  });

  let match = potentialMatches.find((potentialMatch) => potentialMatch.isMatch);

  if (!match) {
    match = {
      route: {
        path: "/404notfound",
        templateId: "template-404-not-found",
        requiresAuth: false,
      },
      isMatch: true,
    };
  }

  // Check if the route requires authentication
  if (match.route.requiresAuth && !isAuthenticated()) {
    navigateTo("/login");
    return;
  }

  const templateId = match.route.templateId;
  const app = document.getElementById("app");
  app.innerHTML = "";
  app.append(document.getElementById(templateId).content.cloneNode(true));

  if (match.route.path === "/user/:id") {
    const userId = match.params.id;
    await loadHomePage(userId);
    initTournamentsComponent();
  } else if (match.route.path === "/login") {
    setupLoginForm();
  } else if (match.route.path === "/register") {
    setupRegisterForm();
  }
};

const navigateTo = (url) => {
  history.pushState(null, null, url);
  router();
};

function navigateToUserPage(userId) {
  navigateTo(`/user/${userId}`);
}

export { router, navigateTo, navigateToUserPage };
