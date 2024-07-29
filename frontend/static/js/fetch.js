// export default async function apiRequest(url, method, data = null) {
//   const options = {
//     method: method,
//     headers: {
//       "Content-Type": "application/json",
//     },
//     credentials: "include", // Pour gérer les cookies de session
//   };

//   const token = localStorage.getItem("access_token");
//   if (token) {
//     options.headers["Authorization"] = `Bearer ${token}`;
//   }

//   if (data) {
//     options.body = JSON.stringify(data);
//   }

//   const response = await fetch(`/api${url}`, options);
//   if (!response.ok) {
//     throw new Error(`HTTP error! status: ${response.status}`);
//   }
//   return await response.json();
// }
