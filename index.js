require("dotenv").config();
const express = require("express");
const { Client } = require("pg");
const cors = require("cors");
const app = express();
const client = new Client();

client.connect();

app.use(cors());
app.use(express.json());

app.get("/api/v1/health", async (req, res) => {
  res.sendStatus(200);
});

app.post("/api/v1/create-message", async (req, res) => {
  const message = req.body;

  const text =
    "insert into messages(Email, Subject, Content) values($1, $2, $3) returning *";
  const values = [message.email, message.subject, message.content];

  try {
    const dbRes = await client.query(text, values);
    res.status(200).json({ returnedMessage: dbRes.rows[0] });
    console.log(res.rows[0]);
  } catch (err) {
    console.log(err.stack);
    res.status(400).json({ returnedMessage: err });
  }
});

app.listen(5000, () => console.log("Running on port 5000"));
