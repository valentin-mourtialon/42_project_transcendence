import { authenticatedFetch } from "./auth.js";

/******************************************************************************/
/*                                                                            */
/*                                  Profile                                   */
/*                                                                            */
/******************************************************************************/

async function getUserProfile() {
  try {
    const response = await authenticatedFetch(
      `/api/users/profile/get-profile/`
    );
    if (!response.ok) {
      throw new Error("Failed to fetch profile");
    }
    const data = await response.json();
    return {
      username: data.username,
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

async function getCreatedTournaments() {
  try {
    const response = await authenticatedFetch(
      `/api/users/profile/created-tournaments/`
    );
    if (!response.ok) {
      throw new Error("Failed to fetch created tournaments");
    }
    const data = await response.json();
    return data.map((tournament) => ({
      ...tournament,
      creatorProfile: { id: tournament.created_by },
      participantCount: 0, // [VMOURTIA] This information is not provided in the new API
      tournamentType: "created",
    }));
  } catch (error) {
    console.error("Error fetching created tournaments:", error);
    throw error;
  }
}

async function getJoinedTournaments() {
  try {
    const response = await authenticatedFetch(
      `/api/users/profile/accepted-tournament-invitations/`
    );
    if (!response.ok) {
      throw new Error("Failed to fetch joined tournaments");
    }
    const data = await response.json();
    return data.map((invitation) => ({
      ...invitation.tournament,
      creatorProfile: { id: invitation.tournament.created_by },
      participantCount: 0, // [VMOURTIA] This information is not provided in the new API
      tournamentType: "joined",
    }));
  } catch (error) {
    console.error("Error fetching joined tournaments:", error);
    throw error;
  }
}

async function getPendingInvitations() {
  try {
    const response = await authenticatedFetch(
      `/api/users/profile/received-tournament-invitations/`
    );
    if (!response.ok) {
      throw new Error("Failed to fetch pending invitations");
    }
    const data = await response.json();
    return data.map((invitation) => ({
      ...invitation.tournament,
      invitationStatus: invitation.status,
      creatorProfile: { id: invitation.tournament.created_by },
      participantCount: 0, // [VMOURTIA] This information is not provided in the new API
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
      "/api/users/profile/game-history/"
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
      username: friendship.friend.username,
    }));
  } catch (error) {
    console.error("Error fetching friends list:", error);
    throw error;
  }
}

async function getPendingFriendsInvitations() {
  try {
    const response = await authenticatedFetch(
      "/api/users/profile/received-friend-invitations/"
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
        username: invitation.sender.username,
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
      "/api/users/profile/blocked/list/"
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
        username: blockedItem.blocked.username,
      },
    }));
  } catch (error) {
    console.error("Error fetching blocked users list:", error);
    throw error;
  }
}

async function acceptFriendInvitation(invitationId) {
  try {
    const response = await authenticatedFetch(
      `/api/users/profile/friend-invitation/${invitationId}/accept/`,
      { method: "PATCH" }
    );
    if (!response.ok) {
      throw new Error("Failed to accept friend invitation");
    }
    return await response.json();
  } catch (error) {
    console.error("Error accepting friend invitation:", error);
    throw error;
  }
}

async function declineFriendInvitation(invitationId) {
  try {
    const response = await authenticatedFetch(
      `/api/users/profile/friend-invitation/${invitationId}/decline/`,
      { method: "DELETE" }
    );
    if (!response.ok) {
      throw new Error("Failed to decline friend invitation");
    }
    // return await response.json();
    return;
  } catch (error) {
    console.error("Error declining friend invitation:", error);
    throw error;
  }
}

export {
  getUserProfile,
  getCreatedTournaments,
  getJoinedTournaments,
  getGameHistory,
  getPendingInvitations,
  getFriendsList,
  getPendingFriendsInvitations,
  getBlockedList,
  acceptFriendInvitation,
  declineFriendInvitation,
};
