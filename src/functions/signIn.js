"use strict";
const AWS = require("aws-sdk");
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
    const passwordMatch =
      queryResponse.Items[0].password === requestBody.password;
    if (passwordMatch) {
      const token = {
        uid: queryResponse.Items[0].id,
        username: queryResponse.Items[0].username
      };
      return processResponse(true, token, 201);
    }
  }
  return processResponse(true, null, 404);
};
