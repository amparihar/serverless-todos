
"use strict";
const AWS = require("aws-sdk");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const processResponse = require("./process-response");

module.exports.signIn = async (event, context) => {
  const requestBody = JSON.parse(event.body);
  const params = {
    TableName: process.env.DYNAMODB_USER_TABLE_NAME,
    KeyConditionExpression: "username=:username",
    ExpressionAttributeValues: {
      ":username": requestBody.username,
    }
  };
  let queryResponse = {};
  try {
    const db = new AWS.DynamoDB.DocumentClient();
    queryResponse = await db.query(params).promise();
  } catch (error) {
    console.log("There was an error while signIn");
    console.log("error", error);
    console.log("params", params.ExpressionAttributeValues);
    return processResponse(true, null, 500);
  }

  if (
    queryResponse &&
    queryResponse.Items &&
    queryResponse.Items.length === 1
  ) {
    bcrypt.compare(requestBody.password, queryResponse.Items[0].password, (err, same) => {
      if (err) {
        return processResponse(true, null, 404);
      }
      if (same) {
        const accessToken = jwt.sign({ uid: queryResponse.Items[0].id }, process.env.JWT_ACCESS_TOKEN);
        return processResponse(true, { token: accessToken, username: queryResponse.Items[0].username }, 201);
      }
    })
  }
  return processResponse(true, null, 404);
};
