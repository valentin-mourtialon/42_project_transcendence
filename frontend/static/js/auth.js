// [TODO] ADD FRONTEND FORM VALIDATION
function setupLoginForm() {
  const form = document.querySelector("form");
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    try {
      const response = await apiRequest("/login/", "POST", { email, password });
      // localStorage.setItem("access_token", response.access);
      // localStorage.setItem("refresh_token", response.access);
      console.log("Logged in successfully", response);
      // [TODO] ADD URL PARAMS
      navigateTo("/user");
    } catch (error) {
      console.error("Login failed", error);
      // [TODO] GIVE USER ERRORS FEEDBACKS
    }
  });
}

function setupRegisterForm() {
  const form = document.querySelector("form");
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const username = document.getElementById("id_username").value;
    const email = document.getElementById("id_email").value;
    const password1 = document.getElementById("id_password1").value;
    const password2 = document.getElementById("id_password2").value;

    if (password1 !== password2) {
      console.error("Passwords do not match");
      // [TODO] GIVE USER ERRORS FEEDBACKS
      return;
    }

    try {
      const response = await apiRequest("/register/", "POST", {
        username,
        email,
        password1,
        password2,
      });
      console.log("Registered successfully", response);
      // [TODO] LOG THE USER IN AFTER A SUCCESSFULL REGISTRATION
      navigateTo("/login");
    } catch (error) {
      console.error("Registration failed", error);
      // [TODO] GIVE USER ERRORS FEEDBACKS
    }
  });
}

export { setupLoginForm, setupRegisterForm };
