import { navigateTo, navigateToUserPage } from "./router.js";

// [TODO] ADD FRONTEND FORM VALIDATION
function setupLoginForm() {
  const loginForm = document.getElementById("login-form");
  if (loginForm) {
    loginForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const username = document.getElementById("email").value;
      const password = document.getElementById("password").value;

      try {
        const response = await fetch("/api/auth/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ username, password }),
        });

        if (response.ok) {
          const data = await response.json();
          localStorage.setItem("access", data.access);
          localStorage.setItem("refresh", data.refresh);
          const userId = data.user_id; // [TODO] Ensure that the API send back the user ID
          navigateToUserPage(userId);
        } else {
          // [TODO] GIVE USER ERRORS FEEDBACKS
          console.error("Login failed");
        }
      } catch (error) {
        console.error("Error during login:", error);
      }
    });
  }
}

function setupRegisterForm() {
  const registerForm = document.getElementById("register-form");
  if (registerForm) {
    registerForm.addEventListener("submit", async (e) => {
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

      const requestBody = {
        username: username,
        email: email,
        password: password1,
        password_confirmation: password2,
      };

      console.log("Sending registration request with data:", requestBody);

      try {
        const response = await fetch("/api/auth/register/", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestBody),
        });

        const responseData = await response.json();
        console.log("Server response:", response.status, responseData);

        if (response.ok) {
          // [TODO] LOG THE USER IN AFTER A SUCCESSFULL REGISTRATION
          console.log("You are well registered");
        } else {
          // [TODO] GIVE USER ERRORS FEEDBACKS
          console.error("Registration failed", response);
        }
      } catch (error) {
        console.error("Error during registration:", error);
      }
    });
  }
}

async function refreshToken() {
  const refreshToken = localStorage.getItem("refresh");
  if (!refreshToken) {
    throw new Error("No refresh token available");
  }

  try {
    const response = await fetch("/api/auth/token/refresh", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ refresh: refreshToken }),
    });

    if (response.ok) {
      const data = await response.json();
      localStorage.setItem("accessToken", data.access);
      return data.access;
    } else {
      throw new Error("Failed to refresh token");
    }
  } catch (error) {
    // If refresh process fails, log the user out.
    console.error("Error refreshing token:", error);
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    navigateTo("/login");
  }
}

// Making authenticated request with the Bearer token
async function authenticatedFetch(url, options = {}) {
  let accessToken = localStorage.getItem("access");

  if (!accessToken) {
    throw new Error("No access token available");
  }

  options.headers = {
    ...options.headers,
    Authorization: `Bearer ${accessToken}`,
  };

  try {
    let response = await fetch(url, options);

    if (response.status === 401) {
      // If token has expired, it tries to refresh it
      accessToken = await refreshToken();
      options.headers["Authorization"] = `Bearer ${accessToken}`;
      response = await fetch(url, options);
    }
    return response;
  } catch (error) {
    console.error("Error in authenticated fetch:", error);
    throw error;
  }
}

export { setupLoginForm, setupRegisterForm };
