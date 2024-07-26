import { mockFetch, userId } from "./mockFetch.js";
import TournamentsComponent from "./components/Tournaments.js";

function initTournamentsComponent() {
  const tournamentsContainer = document.querySelector(".tournaments-container");
  if (tournamentsContainer) {
    new TournamentsComponent(userId);
  } else {
    console.error("Tournaments container not found in the DOM");
  }
}

/* ************************************************************************** */
/*                                                                            */
/*                               USER HOME VIEW                               */
/*                                                                            */
/* ************************************************************************** */

async function loadHomePage() {
  try {
    const profile = await mockFetch(`/api/profile/${userId}`);
    if (profile) {
      updateWelcomeMessage(profile);
      updateUserStats(profile);
      updateUserAvatar(profile);
    } else {
      console.error("Profile not found");
    }
  } catch (error) {
    console.error("Error loading profile:", error);
  }
}

function updateWelcomeMessage(profile) {
  const welcomeUsername = document.getElementById("user-welcome-message");
  const userNickname = document.getElementById("user-welcome-nickname");
  if (welcomeUsername && userNickname) {
    welcomeUsername.textContent = `Welcome back, ${profile.username}!`;
    userNickname.textContent = `${profile.alias}`;
  }
}

function updateUserStats(profile) {
  const ratioElement = document.getElementById("user-ratio");
  const winsElement = document.getElementById("user-wins");
  const lossesElement = document.getElementById("user-losses");

  if (ratioElement && winsElement && lossesElement) {
    const ratio = profile.wins / profile.losses || 0;

    ratioElement.textContent = `${ratio.toFixed(2)}`;
    winsElement.textContent = `${profile.wins}`;
    lossesElement.textContent = `${profile.losses}`;
  }
}

function updateUserAvatar(profile) {
  const avatarElement = document.getElementById("user-avatar");
  if (avatarElement) {
    avatarElement.src = `/static/images/avatars/${profile.avatar}`;
    avatarElement.alt = `${profile.username}'s avatar`;
  }
}

/* ************************************************************************** */
/*                                                                            */
/*                                  ROUTER                                    */
/*                                                                            */
/* ************************************************************************** */

const navigateTo = (url) => {
  history.pushState(null, null, url);
  router();
};

const router = async () => {
  const routes = [
    { path: "/", templateId: "template-index" },
    { path: "/login", templateId: "template-login" },
    { path: "/register", templateId: "template-register" },
    { path: "/user", templateId: "template-user-home" },
  ];

  // Test each route for potential match
  const potentialMatches = routes.map((route) => {
    return {
      route: route,
      isMatch: location.pathname === route.path,
    };
  });

  let match = potentialMatches.find((potentialMatch) => potentialMatch.isMatch);

  if (!match) {
    match = {
      route: { path: "/404notfound", templateId: "template-404-not-found" },
      isMatch: true,
    };
  }

  const templateId = match.route.templateId;
  const app = document.getElementById("app");
  app.innerHTML = "";
  app.append(document.getElementById(templateId).content.cloneNode(true));

  if (match.route.path === "/user") {
    await loadHomePage();
    initTournamentsComponent();
  }
  // [TODO]
  // if (match.route.path === "/login") {
  //   setupLoginForm();
  // } else if (match.route.path === "/register") {
  //   setupRegisterForm();
  // }
};

/*
  "popstate" is triggered when the user clicks on "->" or "<-"
  "router" function here updates the view subsequently.
*/
window.addEventListener("popstate", router);

document.addEventListener("DOMContentLoaded", () => {
  document.body.addEventListener("click", (e) => {
    // At this point e.target is the link that has been clicked
    if (e.target.matches("[data-link]")) {
      e.preventDefault(); // Prevents from reload the page
      navigateTo(e.target.href);
    }
  });
  router();
});
