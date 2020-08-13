"use strict";
const AWS = require("aws-sdk");
const processResponse = require("../utils/process-response");

module.exports.saveTask = async (event, context) => {
  const requestBody = JSON.parse(event.body);
  const ownerId = event.requestContext.authorizer.uid;
  const params = {
    TableName: process.env.DYNAMODB_TASK_TABLE_NAME,
    Item: { ...requestBody, ownerId }
  };

  try {
    const db = new AWS.DynamoDB.DocumentClient();
    const response = await db.put(params).promise();
    return processResponse(true, params.Item, 201);
  } catch (error) {
    console.log(`There was an error saving the task ${params.Item.name}`);
    console.log("error", error);
    console.log("params", params.Item);
    return processResponse(true, null, 500);
  }
};
