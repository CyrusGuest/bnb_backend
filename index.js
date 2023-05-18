require("dotenv").config();
const express = require("express");
const cors = require("cors");
const AWS = require("aws-sdk");
const app = express();

app.use(cors());
app.use(express.json());

AWS.config.update({ region: "us-east-1" });

const ddb = new AWS.DynamoDB({ apiVersion: "2012-08-10" });

app.get("/api/v1/health", async (req, res) => {
  res.sendStatus(200);
});

app.post("/api/v1/create-message", async (req, res) => {
  const message = req.body;

  const params = {
    TableName: "bnb-message",
    Item: {
      MESSAGE_ID: { N: toString(Date.now()) },
      MESSAGE_EMAIL: { S: message.email },
      MESSAGE_SUBJECT: { S: message.subject },
      MESSAGE_CONTENT: { S: message.content },
    },
  };

  ddb.putItem(params, (err, data) => {
    if (err) {
      console.log("Error", err);
    } else {
      console.log("Success", data);
    }
  });
});

app.listen(5000, () => console.log("Running on port 5000"));
