import mockData from "./mocks/mockData.js";

const userId = 1; // 3

function getProfileById(userId) {
  return mockData.profiles.find((profile) => profile.userId === userId);
}

function mockFetch(endpoint) {
  return new Promise((resolve) => {
    setTimeout(() => {
      switch (endpoint) {
        case `/api/profile/${userId}`:
          resolve(getProfileById(userId));
          break;

        /**
         *
         * 1. "My tournaments" (those the user created)
         *
         * SELECT *
         * FROM Tournaments as t
         * WHERE t.created_by == ${userID}
         *
         * The rest of the query retrieves the invitations status
         *
         * Frontend: 1st tab "My tournaments"
         *
         */
        case `/api/user/${userId}/created-tournaments`:
          const creatorProfile = getProfileById(userId);
          const createdTournaments = mockData.tournaments
            .filter((tournament) => tournament.createdBy === userId)
            .map((tournament) => {
              const invitations = mockData.tournamentInvitations.filter(
                (invite) => invite.tournamentId === tournament.id
              );
              return {
                ...tournament,
                declinedPlayers: invitations
                  .filter((invite) => invite.status === "Declined")
                  .map((invite) => invite.invitedUserId),
                creatorProfile: creatorProfile,
                participantCount: tournament.participants.length,
                tournamentType: "created",
              };
            });
          resolve(createdTournaments);
          break;

        /**
         *
         * 2. Joined tournaments (those the user accepted)
         *
         * SELECT *
         * FROM TournamentInvitations as ti
         * INNER JOIN Tournaments as t ON ti.tournament_id = t.tournament_id
         * WHERE invited_user_id == ${userID} AND status == "accepted";
         *
         * Frontend: 2nd tab "Joined tournaments"
         *
         */
        case `/api/user/${userId}/joined-tournaments`:
          const joinedTournaments = mockData.tournaments
            .filter(
              (tournament) =>
                tournament.participants.includes(userId) &&
                tournament.createdBy !== userId
            )
            .map((tournament) => ({
              ...tournament,
              creatorProfile: getProfileById(tournament.createdBy),
              participantCount: tournament.participants.length,
              tournamentType: "joined",
            }));
          resolve(joinedTournaments);
          break;

        /**
         *
         * 3. Pending Invitations
         *
         * It retrieves all the userId pending invitations and all the
         * associated tournaments informations
         *
         * SELECT *
         * FROM TournamentInvitations as ti
         * INNER JOIN Tournaments as t ON ti.tournament_id = t.tournament_id
         * WHERE invited_user_id == ${userID} AND status == "pending";
         *
         * Frontend: 3rd tab "Pending invitations"
         *
         */
        case `/api/user/${userId}/pending-invitations`:
          const pendingInvitations = mockData.tournamentInvitations
            .filter(
              (invite) =>
                invite.invitedUserId === userId && invite.status === "Pending"
            )
            .map((invite) => {
              const tournament = mockData.tournaments.find(
                (t) => t.id === invite.tournamentId
              );
              return {
                ...tournament,
                invitationStatus: "Pending",
                creatorProfile: getProfileById(tournament.createdBy),
                participantCount: tournament.participants.length,
                tournamentType: "pending",
              };
            });
          resolve(pendingInvitations);
          break;

        default:
          resolve(null);
      }
    }, 200);
  });
}

export { mockFetch, userId };
