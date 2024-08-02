import { authenticatedFetch } from "./auth.js";

/******************************************************************************/
/*                                                                            */
/*                                  Profile                                   */
/*                                                                            */
/******************************************************************************/

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

/******************************************************************************/
/*                                                                            */
/*                              Tournaments                                   */
/*                                                                            */
/******************************************************************************/

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

/******************************************************************************/
/*                                                                            */
/*                              Game history                                  */
/*                                                                            */
/******************************************************************************/

async function getGameHistory() {
  try {
    const response = await authenticatedFetch(
      "/api/users/profile/game-history"
    );
    if (!response.ok) {
      throw new Error("Failed to fetch game history");
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching game history:", error);
    throw error;
  }
}

/******************************************************************************/
/*                                                                            */
/*                                Friends                                     */
/*                                                                            */
/******************************************************************************/

async function getFriendsList() {
  try {
    const response = await authenticatedFetch("/api/users/profile/friends/");
    if (!response.ok) {
      throw new Error("Failed to fetch friends list");
    }
    const data = await response.json();
    return data.map((friendship) => ({
      id: friendship.friend.id,
      display_name: friendship.friend.display_name,
      avatar: friendship.friend.avatar,
    }));
  } catch (error) {
    console.error("Error fetching friends list:", error);
    throw error;
  }
}

async function getPendingFriendsInvitations() {
  try {
    const response = await authenticatedFetch(
      "/api/users/profile/pending-friend-invitations/"
    );
    if (!response.ok) {
      throw new Error("Failed to fetch pending friend invitations");
    }
    const data = await response.json();
    return data.map((invitation) => ({
      id: invitation.id,
      sender: {
        id: invitation.sender.id,
        display_name: invitation.sender.display_name,
        avatar: invitation.sender.avatar,
      },
      status: invitation.status,
    }));
  } catch (error) {
    console.error("Error fetching pending friend invitations:", error);
    throw error;
  }
}

async function getBlockedList() {
  try {
    const response = await authenticatedFetch(
      "/api/users/profile/blocked-users/"
    );
    if (!response.ok) {
      throw new Error("Failed to fetch blocked users list");
    }
    const data = await response.json();
    return data.map((blockedItem) => ({
      id: blockedItem.id,
      blockedUser: {
        id: blockedItem.blocked.id,
        display_name: blockedItem.blocked.display_name,
        avatar: blockedItem.blocked.avatar,
      },
    }));
  } catch (error) {
    console.error("Error fetching blocked users list:", error);
    throw error;
  }
}

export {
  getProfileById,
  getCreatedTournaments,
  getJoinedTournaments,
  getGameHistory,
  getPendingInvitations,
  getFriendsList,
  getPendingFriendsInvitations,
  getBlockedList,
};
