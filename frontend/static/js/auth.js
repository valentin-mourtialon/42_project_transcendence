import { navigateTo, navigateToUserPage } from "./router.js";
import {
  setTokens,
  getAccessToken,
  getRefreshToken,
  clearTokens,
} from "./sessionManager.js";

// [TODO] ADD FRONTEND FORM VALIDATION
function setupLoginForm() {
  const loginForm = document.getElementById("login-form");
  if (loginForm) {
    loginForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const username = document.getElementById("login-username").value;
      const password = document.getElementById("login-password").value;
      const loginResult = await loginUser(username, password);
      if (loginResult.success) {
        console.log("User logged in successfully.");
        navigateToUserPage();
      } else {
        console.error("Login failed");
        navigateTo("/login");
      }
    });
  }
}

function setupRegisterForm() {
  const registerForm = document.getElementById("register-form");
  if (registerForm) {
    registerForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const username = document.getElementById("register-username").value;
      const email = document.getElementById("register-email").value;
      const password = document.getElementById("register-password").value;
      const password_confirmation = document.getElementById(
        "register-password-confirmation"
      ).value;

      if (password !== password_confirmation) {
        console.error("Passwords do not match");
        // [TODO] GIVE USER ERRORS FEEDBACKS
        return;
      }

      const requestBody = {
        username,
        email,
        password,
        password_confirmation,
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
          console.log("Success: you are registered !");

          // Try to automatically log in
          const loginResult = await loginUser(username, password);

          if (loginResult.success) {
            console.log("User logged in successfully after registration");
            navigateToUserPage();
          } else {
            console.error("Automatic login failed after registration");
            navigateTo("/login");
          }
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

async function loginUser(username, password) {
  try {
    const response = await fetch("/api/auth/login/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    });
    if (response.ok) {
      const data = await response.json();
      setTokens(data.access, data.refresh);
      return { success: true };
    } else {
      console.error("Login failed");
      return { success: false };
    }
  } catch (error) {
    console.error("Error during login:", error);
    return { success: false };
  }
}

async function refreshToken() {
  const refreshToken = getRefreshToken();
  if (!refreshToken) {
    return false;
  }

  try {
    const response = await fetch("/api/auth/token/refresh/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ refresh: refreshToken }),
    });

    if (response.ok) {
      const data = await response.json();
      setTokens(data.access, refreshToken); // We keep the same access token
      return true;
    } else {
      clearTokens();
      return false;
    }
  } catch (error) {
    console.error("Error refreshing token:", error);
    clearTokens();
    return false;
  }
}

async function authenticatedFetch(url, options = {}) {
  let accessToken = getAccessToken();
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
      // If the token has expired, it tries to refresh it
      const refreshed = await refreshToken();
      if (refreshed) {
        accessToken = getAccessToken();
        options.headers["Authorization"] = `Bearer ${accessToken}`;
        response = await fetch(url, options);
      } else {
        throw new Error("Unable to refresh token");
      }
    }
    return response;
  } catch (error) {
    console.error("Error in authenticated fetch:", error);
    throw error;
  }
}

export { loginUser, authenticatedFetch, setupLoginForm, setupRegisterForm };
