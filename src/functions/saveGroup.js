"use strict";
const AWS = require("aws-sdk");
const processResponse = require("../utils/process-response");
const processErrorResponse = require("../utils/process-error-response");

module.exports.saveGroup = async (event, context) => {
  const ownerId = event.requestContext.authorizer.uid;
  const requestBody = JSON.parse(event.body);
  const params = {
    TableName: process.env.DYNAMODB_GROUP_TABLE_NAME,
    Item: { ...requestBody, ownerId },
  };

  try {
    const db = new AWS.DynamoDB.DocumentClient();
    const response = await db.put(params).promise();
    return processResponse(true, params.Item, 201);
  } catch (error) {
    console.log(`There was an error saving the group ${params.Item.name}`);
    console.log("error", error);
    console.log("params", params.Item);
    return processErrorResponse(error);
  }
};
