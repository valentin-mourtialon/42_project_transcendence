// user 1 : 7 wins, 1 lose, 8 games
// user 2 : 5 wins, 5 loses, 10 games
// user 3 : 1 win, 7 loses, 8 games
// user 4 : 5 wins, 2 loses, 7 games
// user 5 : 0 win, 1 lose, 1 game
// user 6 : 0 win, 2 loses, 2 games
const mockData = {
  Users: [
    {
      id: 2,
      username: "PongMaster",
      email: "vmourtia@pong.com",
      password: "Testing321",
    },
    {
      id: 3,
      username: "PaddleWizard",
      email: "titi@pong.com",
      password: "Testing321",
    },
    {
      id: 4,
      username: "BallChaser",
      email: "twister@pong.com",
      password: "Testing321",
    },
    {
      id: 5,
      username: "SpinKing",
      email: "poluk@pong.com",
      password: "Testing321",
    },
    {
      id: 6,
      username: "TableTitan",
      email: "spiningboy@pong",
      password: "Testing321",
    },
    {
      id: 7,
      username: "RallyQueen",
      email: "girlgirl@pong.com",
      password: "Testing321",
    },
  ],

  Profiles: [
    { user: 2, avatar: "avatar2.png", display_name: "Master Of Pong" },
    { user: 2, avatar: "avatar3.png", display_name: "Wizard Of Paddles" },
    { user: 3, avatar: "avatar4.png", display_name: "Chase The Ball" },
    { user: 4, avatar: "avatar5.png", display_name: "King Of Spin" },
    { user: 5, avatar: "avatar6.png", display_name: "Titan Of The Table" },
    { user: 6, avatar: "avatar7.png", display_name: "Queen Of Rallies" },
  ],

  /**
   * User 1 has 2 pending request + 1 declined one by user 6
   * User 5 has one declined invitation by user 6
   * User 6 declined user 5 and user 1 invitations
   */
  FriendInvitations: [
    { sender: 1, receiver: 2, status: "Accepted" },
    { sender: 1, receiver: 3, status: "Accepted" },
    { sender: 1, receiver: 4, status: "Pending" },
    { sender: 1, receiver: 5, status: "Pending" },
    { sender: 1, receiver: 6, status: "Declined" },
    { sender: 2, receiver: 3, status: "Accepted" },
    { sender: 2, receiver: 4, status: "Accepted" },
    { sender: 2, receiver: 5, status: "Accepted" },
    { sender: 2, receiver: 6, status: "Accepted" },
    { sender: 3, receiver: 4, status: "Accepted" },
    { sender: 3, receiver: 5, status: "Accepted" },
    { sender: 3, receiver: 6, status: "Accepted" },
    { sender: 4, receiver: 5, status: "Accepted" },
    { sender: 4, receiver: 6, status: "Accepted" },
    { sender: 5, receiver: 6, status: "Declined" },
  ],

  Tournaments: [
    // Tournament 1
    { name: "Summer Slam", type: "Remote", createdBy: 1, status: "Completed" },
    // Tournament 2
    { name: "Festoche", type: "Remote", createdBy: 2, status: "Completed" },
    // Tournament 3
    {
      name: "Paddle Party",
      type: "Remote",
      createdBy: 3,
      status: "In Progress",
    },
    // Tournament 4
    {
      name: "Spin Masters",
      type: "Remote",
      createdBy: 4,
      status: "Preparation",
    },
    // Tournament 5
    {
      name: "El grande Natchos",
      type: "Remote",
      createdBy: 1,
      status: "Preparation",
    },
    // Tournament 6
    { name: "Royal Pong", type: "Remote", createdBy: 5, status: "In Progress" },
    // Tournament 7
    {
      name: "Table Tennis Extravaganza",
      type: "Remote",
      createdBy: 6,
      status: "In Progress",
    },
  ],

  UserTournamentInvitations: [
    // Tournament 1 Completed | 4 players = 6 games
    { tournament: 1, user: 2, status: "Accepted" },
    { tournament: 1, user: 3, status: "Accepted" },
    { tournament: 1, user: 4, status: "Accepted" },
    // Tournament 2 Completed | 4 players = 6 games
    { tournament: 2, user: 1, status: "Accepted" },
    { tournament: 2, user: 3, status: "Accepted" },
    { tournament: 2, user: 4, status: "Accepted" },
    // Tournament 3 Completed | 3 players = 3 games
    { tournament: 3, user: 1, status: "Accepted" },
    { tournament: 3, user: 2, status: "Accepted" },
    // Tournament 4 Preparation | 4 potential players = 6 games
    { tournament: 4, user: 1, status: "Pending" },
    { tournament: 4, user: 2, status: "Accepted" },
    { tournament: 4, user: 3, status: "Pending" },
    // Tournament 5 Preparation | 4 potential players = 6 games
    { tournament: 5, user: 2, status: "Pending" },
    { tournament: 5, user: 3, status: "Accepted" },
    { tournament: 5, user: 4, status: "Declined" },
    { tournament: 5, user: 5, status: "Accepted" },
    // Tournament 6 In progress | 3 players = 3 games
    { tournament: 6, user: 1, status: "Pending" }, // [TODO]: What we do if a user starts a tournament when it still remains pending requests
    { tournament: 6, user: 2, status: "Accepted" },
    { tournament: 6, user: 3, status: "Declined" },
    { tournament: 6, user: 4, status: "Accepted" },
    // Tournament 7 In progress | 3 players = 3 games
    { tournament: 7, user: 2, status: "Accepted" },
    { tournament: 7, user: 3, status: "Declined" },
    { tournament: 7, user: 4, status: "Accepted" },
  ],

  UserGames: [
    // Tournament 1 | 6 games | 12 records
    { user: 1, game: 1, score: 11, is_winner: true },
    { user: 2, game: 1, score: 9, is_winner: false },
    { user: 1, game: 2, score: 11, is_winner: true },
    { user: 3, game: 2, score: 2, is_winner: false },
    { user: 1, game: 3, score: 11, is_winner: true },
    { user: 4, game: 3, score: 6, is_winner: false },
    { user: 2, game: 4, score: 11, is_winner: true },
    { user: 3, game: 4, score: 8, is_winner: false },
    { user: 2, game: 5, score: 5, is_winner: false },
    { user: 4, game: 5, score: 11, is_winner: true },
    { user: 3, game: 6, score: 1, is_winner: false },
    { user: 4, game: 6, score: 11, is_winner: true },
    // Tournament 2 | 6 games | 12 records
    { user: 1, game: 1, score: 11, is_winner: true },
    { user: 2, game: 1, score: 10, is_winner: false },
    { user: 1, game: 2, score: 11, is_winner: true },
    { user: 3, game: 2, score: 0, is_winner: false },
    { user: 1, game: 3, score: 10, is_winner: false },
    { user: 4, game: 3, score: 11, is_winner: true },
    { user: 2, game: 4, score: 11, is_winner: true },
    { user: 3, game: 4, score: 9, is_winner: false },
    { user: 2, game: 5, score: 11, is_winner: true },
    { user: 4, game: 5, score: 9, is_winner: true },
    { user: 3, game: 6, score: 4, is_winner: false },
    { user: 4, game: 6, score: 11, is_winner: true },
    // Tournament 3 | 3 games | 6 records
    { user: 1, game: 1, score: 11, is_winner: true },
    { user: 2, game: 1, score: 4, is_winner: false },
    { user: 1, game: 2, score: 11, is_winner: true },
    { user: 3, game: 2, score: 3, is_winner: false },
    { user: 2, game: 3, score: 10, is_winner: false },
    { user: 3, game: 3, score: 11, is_winner: true },
    // Tournament 6 | In progress 1 game done = 2 records | Players = 5, 2, 4
    { user: 2, game: 1, score: 11, is_winner: true },
    { user: 5, game: 1, score: 10, is_winner: false },
    // Tournament 7 | In progress 2 games done = 4 records | Players = 2, 4, 6
    { user: 2, game: 1, score: 11, is_winner: true },
    { user: 6, game: 1, score: 8, is_winner: false },
    { user: 4, game: 2, score: 11, is_winner: true },
    { user: 6, game: 2, score: 3, is_winner: false },
  ],

  /**
   * One object is one game from one tournament
   */
  Games: [
    // Tournament 1 | 6 games
    { tournament: 1 },
    { tournament: 1 },
    { tournament: 1 },
    { tournament: 1 },
    { tournament: 1 },
    { tournament: 1 },
    // Tournament 2 | 6 games
    { tournament: 2 },
    { tournament: 2 },
    { tournament: 2 },
    { tournament: 2 },
    { tournament: 2 },
    { tournament: 2 },
    // Tournament 3 | 3 games
    { tournament: 3 },
    { tournament: 3 },
    { tournament: 3 },
    // Tournament 6 | 1 game done | In progress 3 games max
    { tournament: 6 },
    // Tournament 7| 2 games done | In progress 3 games max
    { tournament: 7 },
    { tournament: 7 },
  ],
};

export default mockData;
