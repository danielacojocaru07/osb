document.getElementById("loginForm").addEventListener("submit", function (e) {
  e.preventDefault();

  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();
  const errorMsg = document.getElementById("errorMsg");

  errorMsg.textContent = "";
  console.log("Se încearcă login cu:", email, password);

  if (!email || !password) {
    errorMsg.textContent = "Toate câmpurile sunt obligatorii!";
    return;
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    errorMsg.textContent = "Email invalid!";
    return;
  }

  if (password.length < 6) {
    errorMsg.textContent = "Parola trebuie să aibă minim 6 caractere.";
    return;
  }

  fetch("http://localhost:3000/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  })
    .then((res) => {
      console.log("Status răspuns:", res.status);
      return res.json();
    })
    .then((data) => {
      console.log("Răspuns server:", data);
      if (data.success) {
        localStorage.setItem("email", data.user.EMAIL);
        window.location.href = "home.html";
      } else {
        document.getElementById("errorMsg").textContent = data.message;
      }
    })
    .catch((err) => {
      console.error("Eroare fetch:", err);
      errorMsg.textContent = "Eroare server.";
    });
});
