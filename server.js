const express = require("express");
const cors = require("cors");
const admin = require("firebase-admin");

const app = express();
app.use(cors());
app.use(express.json());

const serviceAccount = require("./serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

const pool = [
100,100,100,100,100,
200,200,200,200,
500,500,500,
1000,1000,
2000,
5000,
10000
];

app.post("/spin", async (req, res) => {
  const { user } = req.body;

  if (!user) return res.json({ error: "Isi No HP!" });

  const usersRef = db.collection("users");

  const snapshot = await usersRef.get();
  if (snapshot.size >= 500) {
    return res.json({ error: "Kuota habis!" });
  }

  const doc = await usersRef.doc(user).get();

  if (doc.exists) {
    return res.json({ error: "Lu udah spin!" });
  }

  const reward = pool[Math.floor(Math.random()*pool.length)];

  await usersRef.doc(user).set({
    phone: user,
    reward,
    time: new Date()
  });

  res.json({ reward });
});

app.listen(3000, () => console.log("Server jalan"));
