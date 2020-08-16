"use strict";
const AWS = require("aws-sdk");
const processResponse = require("../utils/process-response");
const processErrorResponse = require("../utils/process-error-response");

module.exports.listGroup = async (event, context) => {
  const ownerId = event.requestContext.authorizer.uid;
  const params = {
    TableName: process.env.DYNAMODB_GROUP_TABLE_NAME,
    KeyConditionExpression: "ownerId=:ownerId",
    ExpressionAttributeValues: {
      ":ownerId": ownerId,
    },
  };
  try {
    const db = new AWS.DynamoDB.DocumentClient();
    const queryResponse = await db.query(params).promise();
    return processResponse(
      true,
      queryResponse.Items.map((item) => ({ id: item.id, name: item.name })),
      200
    );
  } catch (error) {
    console.log("There was an error while querying user groups");
    console.log("error=>", error);
    console.log("params=>", params.ExpressionAttributeValues);
    return processErrorResponse(error);
  }
};
