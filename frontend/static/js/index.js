import { navigateTo, router } from "./router.js";

/*
  "popstate" is triggered when the user clicks on "->" or "<-"
  "router" function here updates the view subsequently.
*/
window.addEventListener("popstate", router);

document.addEventListener("DOMContentLoaded", () => {
  document.body.addEventListener("click", (e) => {
    // At this point e.target is the link that has been clicked
    if (e.target.matches("[data-link]")) {
      e.preventDefault(); // Prevents from reload the page
      navigateTo(e.target.href);
    }
  });
  router();
});
