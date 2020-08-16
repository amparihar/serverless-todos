"use strict";
const AWS = require("aws-sdk");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const processResponse = require("../utils/process-response");
const processErrorResponse = require("../utils/process-error-response");

module.exports.signUp = async (event) => {
  const requestBody = JSON.parse(event.body);
  var params = {
    TableName: process.env.DYNAMODB_USER_TABLE_NAME,
    //ConditionExpression: "attribute_not_exists(username)",
    ConditionExpression: "#username <> :username",
    ExpressionAttributeNames: {
      "#username": "username",
    },
    ExpressionAttributeValues: {
      ":username": requestBody.username,
    },
  };
  try {
    const db = new AWS.DynamoDB.DocumentClient();
    const hashedPassword = await bcrypt.hash(requestBody.password, 10);
    params = { ...params, Item: { ...requestBody, password: hashedPassword } };
    const response = await db.put(params).promise();
    const accessToken = jwt.sign(
      { uid: params.Item.id },
      process.env.JWT_ACCESS_TOKEN
    );
    return processResponse(
      true,
      { accessToken, username: params.Item.username },
      201
    );
  } catch (error) {
    console.log("There was an error while user signUp");
    console.log("error", error);
    console.log("params", params.Item);
    if (error.name === "ConditionalCheckFailedException") {
      return processErrorResponse({
        ...error,
        name: "ValidationException",
        message: "User already exists.",
      });
    }
    return processErrorResponse(error);
  }
};
