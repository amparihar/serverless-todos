"use strict";
const AWS = require("aws-sdk");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const processResponse = require("../utils/process-response");
const processErrorResponse = require("../utils/process-error-response");

module.exports.signIn = async (event, context) => {
  const requestBody = JSON.parse(event.body);
  const params = {
    TableName: process.env.DYNAMODB_USER_TABLE_NAME,
    KeyConditionExpression: "username=:username",
    ExpressionAttributeValues: {
      ":username": requestBody.username,
    },
  };
  let queryResponse = {};
  try {
    const db = new AWS.DynamoDB.DocumentClient();
    queryResponse = await db.query(params).promise();
  } catch (error) {
    console.log("There was an error while user signIn");
    console.log("error", error);
    console.log("params", params.ExpressionAttributeValues);
    return processErrorResponse(error);
  }

  if (
    queryResponse &&
    queryResponse.Items &&
    queryResponse.Items.length === 1
  ) {
    try {
      const passwordsEqual = await bcrypt.compare(
        requestBody.password,
        queryResponse.Items[0].password
      );
      if (passwordsEqual) {
        const accessToken = jwt.sign(
          { uid: queryResponse.Items[0].id },
          process.env.JWT_ACCESS_TOKEN
        );
        return processResponse(
          true,
          { accessToken, username: queryResponse.Items[0].username },
          200
        );
      }
    } catch (bcryptCompareError) {
      return processErrorResponse({ ...bcryptCompareError, statusCode: 404 });
    }
  }
  return processErrorResponse({
    name: "AccessDeniedException",
    message: "Please recheck the username & password and try again.",
    statusCode: 404,
  });
};
