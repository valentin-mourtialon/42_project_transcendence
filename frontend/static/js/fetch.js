import { authenticatedFetch } from "./auth.js";

async function getProfileById(userId) {
  try {
    const response = await authenticatedFetch(`/api/users/profile/${userId}/`);
    if (!response.ok) {
      throw new Error("Failed to fetch profile");
    }
    const data = await response.json();
    return {
      username: data.user.username,
      avatar: data.avatar,
      display_name: data.display_name,
      games_played: data.games_played,
      wins: data.wins,
      losses: data.losses,
      ratio: data.ratio,
    };
  } catch (error) {
    console.error("Error fetching profile:", error);
    throw error;
  }
}

export { getProfileById };
