import { getProfileById } from "../fetch.js";
import TournamentsComponent from "../components/Tournaments.js";

function initTournamentsComponent(userId) {
  const tournamentsContainer = document.querySelector(".tournaments-container");
  if (tournamentsContainer) {
    new TournamentsComponent(userId);
  } else {
    console.error("Tournaments container not found in the DOM");
  }
}

// [TODO]: Use authenticatedFetch
async function loadHomePage(userId) {
  try {
    const profile = await getProfileById(userId);
    console.log(`/api/profile/${userId}`);
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
    userNickname.textContent = `«${profile.display_name}»`;
  }
}

function updateUserStats(profile) {
  const ratioElement = document.getElementById("user-ratio");
  const winsElement = document.getElementById("user-wins");
  const lossesElement = document.getElementById("user-losses");

  if (ratioElement && winsElement && lossesElement) {
    const ratio = profile.ratio;
    ratioElement.textContent = `${ratio.toFixed(2)}`;
    winsElement.textContent = `${profile.wins}`;
    lossesElement.textContent = `${profile.losses}`;
  }
}

function updateUserAvatar(profile) {
  const avatarElement = document.getElementById("user-avatar");
  if (avatarElement) {
    avatarElement.src = profile.avatar;
    avatarElement.alt = `${profile.username}'s avatar`;
  }
}

export { loadHomePage, initTournamentsComponent };
