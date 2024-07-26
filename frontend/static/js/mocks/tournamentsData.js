/**
 * These data are different from tournamentsFlowData.
 * These ones are made to test the tournaments presentation interface not the
 * tournaments flow.
 */
const tournamentsData = {
  users: [{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }, { id: 5 }, { id: 6 }],

  profiles: [
    {
      userId: 1,
      avatar: "avatar5.png",
      username: "PongMaster",
      alias: "Master Of Pong",
      wins: 10,
      losses: 5,
    },
    {
      userId: 2,
      avatar: "avatar2.png",
      username: "PaddleWizard",
      alias: "Wizard Of Paddles",
      wins: 8,
      losses: 7,
    },
    {
      userId: 3,
      avatar: "avatar3.png",
      username: "BallChaser",
      alias: "Chase The Ball",
      wins: 6,
      losses: 9,
    },
    {
      userId: 4,
      avatar: "avatar4.png",
      username: "SpinKing",
      alias: "King Of Spin",
      wins: 9,
      losses: 6,
    },
    {
      userId: 5,
      avatar: "avatar1.png",
      username: "TableTitan",
      alias: "Titan Of The Table",
      wins: 12,
      losses: 3,
    },
    {
      userId: 6,
      avatar: "avatar1.png",
      username: "RallyQueen",
      alias: "Queen Of Rallies",
      wins: 7,
      losses: 8,
    },
  ],

  friendships: [
    { userId: 1, friendId: 2 },
    { userId: 1, friendId: 3 },
    { userId: 1, friendId: 4 },
    { userId: 1, friendId: 5 },
    { userId: 1, friendId: 6 },
    { userId: 2, friendId: 3 },
    { userId: 2, friendId: 4 },
    { userId: 2, friendId: 5 },
    { userId: 2, friendId: 6 },
    { userId: 3, friendId: 4 },
    { userId: 3, friendId: 5 },
    { userId: 3, friendId: 6 },
    { userId: 4, friendId: 5 },
    { userId: 4, friendId: 6 },
    { userId: 5, friendId: 6 },
  ],

  tournaments: [
    {
      id: 1,
      name: "Summer Slam",
      createdBy: 1,
      status: "Completed",
      participants: [1, 2, 3, 4],
      invitedPlayers: [2, 3, 4],
      // declinedPlayers: null,
    },
    {
      id: 2,
      name: "Festoche",
      createdBy: 1,
      status: "Completed",
      participants: [1, 2, 3, 4],
      invitedPlayers: [2, 3, 4],
      // declinedPlayers: null,
    },
    {
      id: 3,
      name: "Paddle Party",
      createdBy: 2,
      status: "In Progress",
      participants: [1, 2, 3, 4],
      invitedPlayers: [1, 3, 4],
      // declinedPlayers: null,
    },
    {
      id: 4,
      name: "Spin Masters",
      createdBy: 4,
      status: "Preparation",
      participants: [4],
      invitedPlayers: [1, 2, 3],
      // declinedPlayers: null,
    },
    {
      id: 5,
      name: "El grande Natchos",
      createdBy: 1,
      status: "Preparation",
      participants: [1, 3],
      invitedPlayers: [2, 3, 4, 5, 6],
      // declinedPlayers: [6],
    },
    {
      id: 6,
      name: "Pong Royale",
      createdBy: 5,
      status: "In Progress",
      participants: [1, 2, 3, 4, 5],
      invitedPlayers: [1, 2, 3, 4],
      // declinedPlayers: null,
    },
    {
      id: 7,
      name: "Table Tennis Extravaganza",
      createdBy: 6,
      status: "In Progress",
      participants: [1, 2, 3, 4, 5, 6],
      invitedPlayers: [1, 2, 3, 4, 5],
      // declinedPlayers: null,
    },
  ],

  // On ne récupère que les inviations des tournois qui n'ont pas encore commencés
  tournamentInvitations: [
    { tournamentId: 4, invitedUserId: 1, status: "Pending" },
    { tournamentId: 4, invitedUserId: 2, status: "Pending" },
    { tournamentId: 4, invitedUserId: 3, status: "Pending" },
    { tournamentId: 5, invitedUserId: 2, status: "Pending" },
    { tournamentId: 5, invitedUserId: 3, status: "Accepted" },
    { tournamentId: 5, invitedUserId: 4, status: "Pending" },
    { tournamentId: 5, invitedUserId: 5, status: "Accepted" },
    { tournamentId: 5, invitedUserId: 6, status: "Declined" },
  ],
};

export default tournamentsData;
