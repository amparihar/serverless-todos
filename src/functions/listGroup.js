"use strict";
const AWS = require("aws-sdk");
const processResponse = require("../utils/process-response");
const accessTokenPayload = require("../utils/accessTokenPayload");

module.exports.listGroup = async (event, context) => {
  const ownerId = accessTokenPayload.uid;
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
    return processResponse(true, queryResponse.Items, 200);
  } catch (error) {
    console.log("There was an error while querying user groups");
    console.log("error=>", error);
    console.log("params=>", params.ExpressionAttributeValues);
    return processResponse(true, null, 500);
  }
};
