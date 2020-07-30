"use strict";
const AWS = require("aws-sdk");
const processResponse = require("./process-response");

module.exports.signUp = async (event, context) => {
  const requestBody = JSON.parse(event.body);
  const params = {
    TableName: process.env.DYNAMODB_USER_TABLE_NAME,
    Item: requestBody,
    ConditionExpression: "attribute_not_exists(username)"
  };

  try {
    const db = new AWS.DynamoDB.DocumentClient();
    const response = await db.put(params).promise();
    return processResponse(true, params.Item, 201);
  } catch (error) {
    console.log("There was an error while signUp");
    console.log("error", error);
    console.log("params", params.Item);
    return processResponse(true, null, 500);
  }
};
