import {
  getFriendsList,
  getPendingFriendsInvitations,
  getBlockedList,
} from "../fetch.js";

export default class FriendsComponent {
  constructor(userId) {
    this.userId = userId;
    this.container = document.querySelector(".friends-container");
    this.tabButtons = this.container.querySelectorAll(".friends-tab");
    this.friendsList = document.getElementById("friends-list");
    this.addButton = document.getElementById("add-friend");
    this.currentTab = "my-friends";

    this.initEventListeners();
    this.loadFriends();
  }

  initEventListeners() {
    this.tabButtons.forEach((button) => {
      button.addEventListener("click", () =>
        this.switchTab(button.dataset.tab)
      );
    });

    this.addButton.addEventListener("click", () => this.addFriend());
  }

  switchTab(tabName) {
    this.currentTab = tabName;
    this.tabButtons.forEach((button) => {
      button.classList.toggle("active", button.dataset.tab === tabName);
    });
    this.loadFriends();
  }

  async loadFriends() {
    let friends = [];
    switch (this.currentTab) {
      case "my-friends":
        friends = await getFriendsList();
        break;
      case "pending-friend-invitations":
        friends = await getPendingFriendsInvitations();
        break;
      case "blocked-friends":
        friends = await getBlockedList();
        break;
    }
    this.renderFriends(friends);
  }

  renderFriends(friends) {
    this.friendsList.innerHTML = "";
    const template = document.getElementById("template-friends");

    friends.forEach((friend) => {
      const friendElement = template.content.cloneNode(true);

      // Friend's infos
      let friendDisplayName = "";
      let friendAvatar = "";
      if (this.currentTab === "my-friends") {
        friendDisplayName = friend.display_name;
        friendAvatar = friend.avatar;
      } else if (this.currentTab === "pending-friend-invitations") {
        friendDisplayName = friend.sender.display_name;
        friendAvatar = friend.sender.avatar;
      } else if (this.currentTab === "blocked-friends") {
        friendDisplayName = friend.blockedUser.display_name;
        friendAvatar = friend.blockedUser.avatar;
      }
      friendElement.querySelector(".friend-name").textContent =
        friendDisplayName;
      const avatarElement = friendElement.querySelector("#friend-avatar");
      if (avatarElement) {
        avatarElement.src = friendAvatar;
        avatarElement.alt = `${friendDisplayName}'s avatar`;
      }

      // Friends actions
      const friendActions = friendElement.querySelector(".friend-actions");
      friendActions.innerHTML = "";
      if (this.currentTab === "my-friends") {
        // View profile button
        const viewProfileButton = document.createElement("button");
        viewProfileButton.textContent = "View profile";
        viewProfileButton.classList.add("friend-action", "view-profile");
        viewProfileButton.addEventListener("click", () =>
          this.viewProfile(friend)
        );
        friendActions.appendChild(viewProfileButton);

        // Block button
        const blockButton = document.createElement("button");
        blockButton.textContent = "Block";
        blockButton.classList.add("friend-action", "block");
        blockButton.addEventListener("click", () => this.blockFriend(friend));
        friendActions.appendChild(blockButton);
      } else if (this.currentTab === "pending-friend-invitations") {
        // Accept button
        const acceptButton = document.createElement("button");
        acceptButton.textContent = "Accept";
        acceptButton.classList.add("friend-action", "accept");
        acceptButton.addEventListener("click", () =>
          this.acceptInvitation(friend)
        );
        friendActions.appendChild(acceptButton);

        // Decline button
        const declineButton = document.createElement("button");
        declineButton.textContent = "Decline";
        declineButton.classList.add("friend-action", "decline");
        declineButton.addEventListener("click", () =>
          this.declineInvitation(friend)
        );
        friendActions.appendChild(declineButton);
      } else if (this.currentTab === "blocked-friends") {
        // Unblock button
        const unblockButton = document.createElement("button");
        unblockButton.textContent = "Unblock";
        unblockButton.classList.add("friend-action", "unblock");
        unblockButton.addEventListener("click", () =>
          this.unblockFriend(friend)
        );
        friendActions.appendChild(unblockButton);
      }

      this.friendsList.appendChild(friendElement);
    });
  }

  viewProfile(friend) {
    // [TODO]: Implement logic to view friend's profile
    console.log("Viewing profile of", friend.displayName);
  }

  blockFriend(friend) {
    // [TODO]: Implement logic to block friend
    console.log("Blocking", friend.displayName);
  }

  acceptInvitation(friend) {
    // [TODO]: Implement logic to accept friend invitation
    console.log("Accepting invitation from", friend.sender.displayName);
  }

  declineInvitation(friend) {
    // [TODO]: Implement logic to decline friend invitation
    console.log("Declining invitation from", friend.sender.displayName);
  }

  unblockFriend(friend) {
    // [TODO]: Implement logic to unblock friend
    console.log("Unblocking", friend.blockedUser.displayName);
  }

  addFriend() {
    // [TODO]: Implement logic to add a friend
    console.log("Creating a new friend");
  }
}
