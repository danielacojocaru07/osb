document.getElementById("signupForm").addEventListener("submit", function (e) {
    e.preventDefault();

    // Preluare valori din formular
    const nume = document.getElementById("nume").value.trim();
    const prenume = document.getElementById("prenume").value.trim();
    const data_nasterii = document.getElementById("data_nasterii").value;
    const telefon = document.getElementById("telefon").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;
    const confirmPassword = document.getElementById("confirmPassword").value;
    const universitate = document.getElementById("universitate").value.trim();
    const facultate = document.getElementById("facultate").value.trim();
    const specializare = document.getElementById("specializare").value.trim();
    const an_studiu = parseInt(document.getElementById("an_studiu").value, 10);
    const program_studii = document.getElementById("program_studii").value;

    const errorMsg = document.getElementById("errorMsg");
    const successMsg = document.getElementById("successMsg");

    errorMsg.textContent = "";
    successMsg.textContent = "";

    // Validări obligatorii
    if (!nume || !prenume || !data_nasterii || !telefon || !email || !password || !confirmPassword || !universitate || !an_studiu || !program_studii) {
        errorMsg.textContent = "Toate câmpurile obligatorii trebuie completate!";
        return;
    }

    if (password.length < 6) {
        errorMsg.textContent = "Parola trebuie să aibă minim 6 caractere.";
        return;
    }

    if (password !== confirmPassword) {
        errorMsg.textContent = "Parolele nu coincid!";
        return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        errorMsg.textContent = "Email invalid!";
        return;
    }

    const phoneRegex = /^[0-9+\s]{8,15}$/;
    if (!phoneRegex.test(telefon)) {
        errorMsg.textContent = "Număr de telefon invalid!";
        return;
    }

    if (isNaN(an_studiu) || an_studiu < 1 || an_studiu > 6) {
        errorMsg.textContent = "An studiu trebuie să fie un număr între 1 și 6.";
        return;
    }

    // Trimite datele către backend
    fetch("http://localhost:3000/signup", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            nume,
            prenume,
            data_nasterii,
            telefon,
            email,
            password,
            universitate,
            facultate,
            specializare,
            an_studiu,
            program_studii
        })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            successMsg.textContent = "Cont creat cu succes! Te poți autentifica.";
            errorMsg.textContent = "";
            setTimeout(() => {
                window.location.href = "login.html";
            }, 1500);
        } else {
            errorMsg.textContent = data.message || "Eroare la creare cont.";
            successMsg.textContent = "";
        }
    })
    .catch(() => {
        errorMsg.textContent = "Eroare de conexiune cu serverul.";
        successMsg.textContent = "";
    });
});