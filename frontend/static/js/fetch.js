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

async function getCreatedTournaments(userId) {
  try {
    const response = await authenticatedFetch(
      `/api/tournaments/?created_by=${userId}`
    );
    if (!response.ok) {
      throw new Error("Failed to fetch created tournaments");
    }
    const data = await response.json();
    return data.map((tournament) => ({
      ...tournament,
      creatorProfile: tournament.creator_profile,
      participantCount: tournament.participant_count,
      tournamentType: "created",
    }));
  } catch (error) {
    console.error("Error fetching created tournaments:", error);
    throw error;
  }
}

async function getJoinedTournaments(userId) {
  try {
    const response = await authenticatedFetch(
      `/api/tournaments/?participant=${userId}`
    );
    if (!response.ok) {
      throw new Error("Failed to fetch joined tournaments");
    }
    const data = await response.json();
    return data.map((tournament) => ({
      ...tournament,
      creatorProfile: tournament.creator_profile,
      participantCount: tournament.participant_count,
      tournamentType: "joined",
    }));
  } catch (error) {
    console.error("Error fetching joined tournaments:", error);
    throw error;
  }
}

async function getPendingInvitations(userId) {
  try {
    const response = await authenticatedFetch(
      `/api/tournament-invitations/?invited_user=${userId}&status=pending`
    );
    if (!response.ok) {
      throw new Error("Failed to fetch pending invitations");
    }
    const data = await response.json();
    return data.map((invitation) => ({
      ...invitation.tournament,
      invitationStatus: "Pending",
      creatorProfile: invitation.tournament.creator_profile,
      participantCount: invitation.tournament.participant_count,
      tournamentType: "pending",
    }));
  } catch (error) {
    console.error("Error fetching pending invitations:", error);
    throw error;
  }
}

export {
  getProfileById,
  getCreatedTournaments,
  getJoinedTournaments,
  getPendingInvitations,
};
