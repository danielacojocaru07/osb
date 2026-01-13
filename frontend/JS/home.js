// document.addEventListener("DOMContentLoaded", () => {
//   const email = localStorage.getItem("email");

//   if (!email) {
//     // Dacă nu e user logat, redirect la login
//     window.location.href = "login.html";
//     return;
//   }

//   fetch(`http://localhost:3000/profile?email=${encodeURIComponent(email)}`)
//     .then(response => {
//       if (!response.ok) {
//         throw new Error("Eroare la server");
//       }
//       return response.json();
//     })
//     .then(data => {
//       if (data.success && data.profil) {
//         const p = data.profil;
//         // Folosim elementele din HTML unde vrem să afișăm numele/prenumele
//         document.getElementById("userPrenume").textContent = p.PRENUME || "Nedefinit";
//         document.getElementById("userNume").textContent = p.NUME || "Nedefinit";
//       } else {
//         console.error("Profil negasit:", data.message);
//         // Poți să redirecționezi la login dacă vrei
//         window.location.href = "login.html";
//       }
//     })
//     .catch(err => {
//       console.error("Eroare fetch profil:", err);
//       window.location.href = "login.html";
//     });
// });
