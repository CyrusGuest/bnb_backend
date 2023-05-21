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
  const inquiry = req.body;

  const services = toString(inquiry.services);

  const params = {
    TableName: "bnb-message",
    Item: {
      INQUIRY: { N: toString(Date.now()) },
      INQUIRY_NAME: { S: inquiry.contactInfo.name },
      INQUIRY_EMAIL: { S: inquiry.contactInfo.email },
      INQUIRY_TEL: { S: inquiry.contactInfo.tel },
      INQUIRY_DESCRIPTION: { S: inquiry.contactInfo.description },
      INQUIRY_SERVICES: { S: services },
    },
  };

  ddb.putItem(params, (err, data) => {
    if (err) {
      console.log("Error", err);
      res.status(400).json({ returnedMessage: err });
    } else {
      console.log("Success", data);
      res.status(200).json({ returnedMessage: data });
    }
  });
});

app.listen(5000, () => console.log("Running on port 5000"));
