function setTokens(accessToken, refreshToken) {
  sessionStorage.setItem("accessToken", accessToken);
  sessionStorage.setItem("refreshToken", refreshToken);
}

function getAccessToken() {
  return sessionStorage.getItem("accessToken");
}

function getRefreshToken() {
  return sessionStorage.getItem("refreshToken");
}

function isAuthenticated() {
  return !!getAccessToken();
}

function clearTokens() {
  sessionStorage.removeItem("accessToken");
  sessionStorage.removeItem("refreshToken");
}

export {
  setTokens,
  getAccessToken,
  getRefreshToken,
  isAuthenticated,
  clearTokens,
};
