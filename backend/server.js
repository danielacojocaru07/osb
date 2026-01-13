const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const oracledb = require("oracledb");

const app = express();
app.use(cors());
app.use(bodyParser.json());

oracledb.outFormat = oracledb.OUT_FORMAT_OBJECT;

// CONFIG ORACLE
const dbConfig = {
    user: "osb_app",
    password: "osb123",
    connectString: "localhost/FREEPDB1"
};

app.post("/login", async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ success: false, message: "Lipsește email sau parola" });
    }

    let connection;

    try {
        connection = await oracledb.getConnection(dbConfig);

        // 1. Verificare user în USERS
        const userResult = await connection.execute(
            `SELECT id, email FROM USERS WHERE email = :email AND password = :password`,
            [email, password]
        );

        if (userResult.rows.length === 0) {
            return res.json({ success: false, message: "Email sau parolă incorecte!" });
        }

        const user = userResult.rows[0]; // { ID, EMAIL }

        // 2. Preluare prenume, nume din VOLUNTAR după id_voluntar = users.id
        const volResult = await connection.execute(
            `SELECT prenume, nume FROM VOLUNTAR WHERE id_voluntar = :userId`,
            [user.ID]
        );

        const voluntar = volResult.rows[0] || { PRENUME: null, NUME: null };

        res.json({ 
            success: true, 
            user: {
                ID: user.ID,
                EMAIL: user.EMAIL,
                PRENUME: voluntar.PRENUME,
                NUME: voluntar.NUME
            }
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: "Eroare DB" });
    } finally {
        if (connection) await connection.close();
    }
});

app.post("/signup", async (req, res) => {
    console.log("A fost apelat endpoint-ul /signup");
    console.log("Body primit:", req.body);

    let {
        email,
        password,
        nume,
        prenume,
        data_nasterii,
        telefon,
        universitate,
        facultate,
        specializare,
        an_studiu,
        program_studii
    } = req.body;

    // Trimming input
    email = email?.trim();
    nume = nume?.trim();
    prenume = prenume?.trim();
    telefon = telefon?.trim();
    universitate = universitate?.trim();
    facultate = facultate?.trim();
    specializare = specializare?.trim();
    program_studii = program_studii?.trim();

    // Validate date format or null
    if (!data_nasterii || isNaN(Date.parse(data_nasterii))) {
        data_nasterii = null;
    }

    // Validate an_studiu numeric
    an_studiu = parseInt(an_studiu, 10);
    if (isNaN(an_studiu)) {
        an_studiu = null;
    }

    let connection;

    try {
        connection = await oracledb.getConnection(dbConfig);

        const result = await connection.execute(
            `BEGIN adauga_voluntar(
                :email,
                :password,
                :nume,
                :prenume,
                ${data_nasterii ? `TO_DATE(:data_nasterii, 'YYYY-MM-DD')` : 'NULL'},
                :telefon,
                :universitate,
                :facultate,
                :specializare,
                :an_studiu,
                :program_studii,
                :p_result
            ); END;`,
            {
                email,
                password,
                nume,
                prenume,
                data_nasterii,
                telefon,
                universitate,
                facultate,
                specializare,
                an_studiu,
                program_studii,
                p_result: { dir: oracledb.BIND_OUT, type: oracledb.STRING, maxSize: 200 }
            },
            { autoCommit: true }
        );

        const procResult = result.outBinds.p_result;
        console.log("Rezultat procedură:", procResult);

        if (procResult !== 'OK') {
            return res.json({ success: false, message: procResult });
        }

        res.json({ success: true, message: "Cont creat cu succes!" });

    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: "Eroare la baza de date." });
    } finally {
        if (connection) await connection.close();
    }
});

app.get("/profile", async (req, res) => {
  const email = req.query.email;

  if (!email) {
    return res.json({ success: false, message: "Email lipsește" });
  }

  let connection;
  try {
    connection = await oracledb.getConnection(dbConfig);

    // 1. Ia userul
    const userResult = await connection.execute(
      `SELECT id, email FROM USERS WHERE email = :email`,
      [email]
    );

    if (userResult.rows.length === 0) {
      return res.json({ success: false, message: "Utilizator inexistent" });
    }

    const user = userResult.rows[0];

    // 2. Ia prenume, nume din VOLUNTAR
    const volResult = await connection.execute(
      `SELECT prenume, nume, telefon FROM VOLUNTAR WHERE id_voluntar = :userId`,
      [user.ID]
    );

    const voluntar = volResult.rows[0] || { PRENUME: null, NUME: null, TELEFON: null };

    res.json({ 
      success: true, 
      profil: {
        EMAIL: user.EMAIL,
        PRENUME: voluntar.PRENUME,
        NUME: voluntar.NUME,
        TELEFON: voluntar.TELEFON
      }
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Eroare server" });
  } finally {
    if (connection) await connection.close();
  }
});

app.listen(3000, () => {
    console.log("Server pornit pe http://localhost:3000");
});
