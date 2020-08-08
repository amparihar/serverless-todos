"use strict";
const AWS = require("aws-sdk");
const bcrypt = require('bcrypt');
const processResponse = require("./process-response");

module.exports.signUp = async (event, context) => {

  const requestBody = JSON.parse(event.body);
  try {
    const hashedPassword = await bcrypt.hash(requestBody.password, 10);
    const params = {
      TableName: process.env.DYNAMODB_USER_TABLE_NAME,
      Item: { ...requestBody, password: hashedPassword },
      ConditionExpression: "attribute_not_exists(username)"
    };
    const db = new AWS.DynamoDB.DocumentClient();
    const response = await db.put(params).promise();
    return processResponse(true, { uid: params.Item.id, username: params.Item.username }, 201);
  } catch (error) {
    console.log("There was an error while signUp");
    console.log("error", error);
    console.log("params", params.Item);
    return processResponse(true, null, 500);
  }
};
