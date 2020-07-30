"use strict";
const AWS = require("aws-sdk");
const processResponse = require("./process-response");

module.exports.listTask = async (event, context) => {
  const groupId = event.pathParameters.group || "";
  const params = {
    TableName: process.env.DYNAMODB_TASK_TABLE_NAME,
    KeyConditionExpression: "groupId=:groupId",
    ExpressionAttributeValues: {
      ":groupId": groupId,
    },
  };
  try {
    const db = new AWS.DynamoDB.DocumentClient();
    const queryResponse = await db.query(params).promise();
    return processResponse(true, queryResponse.Items, 200);
  } catch (error) {
    console.log("There was an error while querying user tasks");
    console.log("error", error);
    console.log("params", params.ExpressionAttributeValues);
    return processResponse(true, null, 500);
  }
};
