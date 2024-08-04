import {
  loadHomePage,
  initTournamentsComponent,
  initFriendsComponent,
} from "./views/userHomeView.js";
import { setupLoginForm, setupRegisterForm } from "./auth.js";
import { isAuthenticated, clearTokens } from "./sessionManager.js";

/**
 * Main router function that handles navigation and renders the appropriate view.
 */
const router = async () => {
  const routes = [
    { path: "/", templateId: "template-index", requiresAuth: false },
    { path: "/login", templateId: "template-login", requiresAuth: false },
    { path: "/register", templateId: "template-register", requiresAuth: false },
    { path: "/home", templateId: "template-user-home", requiresAuth: true },
  ];

  if (location.pathname === "/") {
    if (isAuthenticated()) {
      navigateTo(`/home`);
      return;
    } else {
      navigateTo("/login");
      return;
    }
  }

  // Test each route for potential match
  const potentialMatches = routes.map((route) => {
    return {
      route,
      isMatch: location.pathname === route.path,
    };
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

  if (match.route.path === "/home") {
    await loadHomePage();
    initTournamentsComponent();
    initFriendsComponent();
  } else if (match.route.path === "/login") {
    setupLoginForm();
  } else if (match.route.path === "/register") {
    setupRegisterForm();
  }
};

/**
 * Navigates to the specified URL and triggers the router.
 * @param {string} url - The URL to navigate to.
 */
const navigateTo = (url) => {
  history.pushState(null, null, url);
  router();
};

/**
 * Navigates to the user's home page.
 */
function navigateToUserPage() {
  navigateTo(`/home`);
}

function logout() {
  clearTokens();
  navigateTo("/login");
}

export { router, navigateTo, navigateToUserPage };
