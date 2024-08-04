import {
  getCreatedTournaments,
  getJoinedTournaments,
  getPendingInvitations,
  getGameHistory,
} from "../fetch.js";

export default class TournamentsComponent {
  constructor() {
    this.container = document.querySelector(".tournaments-container");
    this.tabButtons = this.container.querySelectorAll(".tab-btn");
    this.tournamentsList = document.getElementById("tournaments-list");
    this.createButton = document.getElementById("create-tournament");
    this.currentTab = "my-tournaments";

    this.seeAllGamesBtn = document.getElementById("see-all-games");
    this.modal = null;
    this.closeBtn = null;

    this.initEventListeners();
    this.loadTournaments();
  }

  initEventListeners() {
    this.tabButtons.forEach((button) => {
      button.addEventListener("click", () =>
        this.switchTab(button.dataset.tab)
      );
    });
    this.createButton.addEventListener("click", () => this.createTournament());
    this.seeAllGamesBtn.addEventListener("click", () => this.showGameHistory());
  }

  switchTab(tabName) {
    this.currentTab = tabName;
    this.tabButtons.forEach((button) => {
      button.classList.toggle("active", button.dataset.tab === tabName);
    });
    this.loadTournaments();
  }

  async loadTournaments() {
    let tournaments = [];
    switch (this.currentTab) {
      case "my-tournaments":
        tournaments = await getCreatedTournaments();
        break;
      case "accepted-tournaments":
        tournaments = await getJoinedTournaments();
        break;
      case "pending-invitations":
        tournaments = await getPendingInvitations();
        break;
    }
    this.renderTournaments(tournaments);
  }

  renderTournaments(tournaments) {
    this.tournamentsList.innerHTML = "";
    const template = document.getElementById("template-tournament");

    tournaments.forEach((tournament) => {
      const tournamentElement = template.content.cloneNode(true);

      // Tournament name
      tournamentElement.querySelector(".tournament-name").textContent =
        tournament.name;

      // Tournament status
      tournamentElement.querySelector(".tournament-status").textContent =
        this.getTournamentStatus(tournament.status);

      // Add the tournament creator
      const createdByElement = tournamentElement.querySelector(
        ".tournament-created-by"
      );
      if (tournament.tournamentType === "created") {
        createdByElement.textContent = "Created by: you";
      } else if (tournament.tournamentType === "joined") {
        createdByElement.textContent = `Created by ${
          tournament.creatorProfile
            ? tournament.creatorProfile.username
            : "Unknown"
        }`;
      } else if (tournament.tournamentType === "pending") {
        createdByElement.textContent = `${
          tournament.creatorProfile
            ? tournament.creatorProfile.username
            : "Unknown"
        } is inviting you`;
      }

      // Add the number of participants
      tournamentElement.querySelector(
        ".tournament-number-players"
      ).textContent = `${tournament.participantCount} players`;

      const actionElement =
        tournamentElement.querySelector(".tournament-action");
      const actionButtonText = this.getActionButtonText(tournament);

      if (actionButtonText === "Waiting") {
        const waitingSpan = document.createElement("span");
        waitingSpan.textContent = "Waiting";
        waitingSpan.classList.add("tournament-action", "waiting");
        actionElement.parentNode.replaceChild(waitingSpan, actionElement);
      } else {
        actionElement.textContent = actionButtonText;
        actionElement.classList.add(
          "tournament-action",
          `${actionButtonText.toLowerCase()}`
        );
        actionElement.addEventListener("click", () =>
          this.handleTournamentAction(tournament)
        );
      }

      if (tournament.tournamentType === "pending") {
        const declineButton = document.createElement("button");
        declineButton.textContent = "Decline";
        declineButton.classList.add("tournament-action", "decline");
        declineButton.addEventListener("click", () =>
          this.declineTournament(tournament)
        );
        tournamentElement
          .querySelector(".tournament-actions")
          .appendChild(declineButton);
      }

      this.tournamentsList.appendChild(tournamentElement);
    });
  }

  getActionButtonText(tournament) {
    if (tournament.tournamentType === "pending") return "Accept";
    if (
      tournament.tournamentType === "created" &&
      tournament.status === "Preparation"
    ) {
      return this.canStartTournament(tournament) ? "Start" : "Waiting";
    }
    switch (tournament.status) {
      case "Preparation":
        return tournament.tournamentType === "created" ? "Waiting" : "Leave"; // Wainting when you are the one who created the tournament else you can leave it
      case "In Progress":
        return "View";
      case "Completed":
        return "Results";
      default:
        return "View";
    }
  }

  getParticipantCount(tournament) {
    if (tournament.status === "Preparation") {
      return tournament.participants.length;
    } else {
      return tournament.participants.length;
    }
  }

  getTournamentStatus(status) {
    const formattedStatus = status.toLowerCase().replace("_", " ");
    return formattedStatus.charAt(0).toUpperCase() + formattedStatus.slice(1);
  }

  canStartTournament(tournament) {
    // Do all guests have answered ?
    const allResponded = tournament.invitedPlayers.every(
      (playerId) =>
        tournament.participants.includes(playerId) ||
        tournament.declinedPlayers.includes(playerId)
    );

    // Count the number of participants included the creator.
    const participantCount = tournament.participants.length;
    return allResponded && participantCount >= 4;
  }

  handleTournamentAction(tournament) {
    if (
      tournament.tournamentType === "created" &&
      tournament.status === "Preparation"
    ) {
      if (this.canStartTournament(tournament)) {
        console.log(`Starting tournament ${tournament.id}`);
      } else {
        console.log(
          `Cannot start tournament ${tournament.id} yet. Waiting for more participants or responses.`
        );
      }
    } else {
      console.log(
        `Action for tournament ${tournament.id}: ${tournament.status}, Type: ${tournament.tournamentType}`
      );
    }
  }

  declineTournament(tournament) {
    console.log(`Declining tournament invitation: ${tournament.id}`);
    this.loadTournaments();
  }

  createTournament() {
    console.log("Creating a new tournament");
  }

  async showGameHistory() {
    try {
      const games = await getGameHistory();
      this.openGameHistoryModal(games);
    } catch (error) {
      console.error("Error showing game history:", error);
      // [TODO] : Add a user feedback
    }
  }

  openGameHistoryModal(games) {
    const template = document.getElementById("template-game-history-modal");
    this.modal = template.content
      .cloneNode(true)
      .querySelector("#game-history-modal");

    const gameList = this.modal.querySelector("#game-list");
    games.forEach((game) => {
      const li = document.createElement("li");
      const date = new Date(
        game.game.tournament.created_by
      ).toLocaleDateString();
      const tournamentName = game.game.tournament.name;
      const opponentName = game.opponent.display_name;
      const userScore = game.score;
      const opponentScore = game.opponent.score;
      const result = game.is_winner ? "Won" : "Lost";
      const tournamentStatus = game.game.tournament.status;

      li.innerHTML = `
        <div class="game-item">
          <div class="game-info">
            <span class="game-date">${date}</span>
            <span class="tournament-name">« ${tournamentName} »</span>
            <span class="tournament-status">${this.getTournamentStatus(
              tournamentStatus
            )}</span>
          </div>
          <div class="game-result">
          <span class="result ${result.toLowerCase()}">Result: ${result} |</span>
            <span class="opponent-name">You (${userScore}) VS « ${opponentName} » (${opponentScore})</span>
          </div>
        </div>
      `;
      gameList.appendChild(li);
    });

    document.body.appendChild(this.modal);
    this.modal.style.display = "block";
    document.body.classList.add("no-scroll");
    document.getElementById("app").classList.add("blur-background");

    this.closeBtn = this.modal.querySelector(".close");
    this.closeBtn.addEventListener("click", () => this.closeModal());

    window.addEventListener("click", (event) => {
      if (event.target == this.modal) {
        this.closeModal();
      }
    });
  }

  closeModal() {
    if (this.modal) {
      this.modal.style.display = "none";
      document.body.removeChild(this.modal);
      document.body.classList.remove("no-scroll");
      document.getElementById("app").classList.remove("blur-background");
      this.modal = null;
    }
  }
}
