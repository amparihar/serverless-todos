'use strict';
const AWS = require("aws-sdk");
const processResponse = require("../utils/process-response");

module.exports.deleteGroup = async (event, context) => {
  const id = event.pathParameters.id || "";
  const ownerId = event.queryStringParameters.owner;
  const params = {
    TableName: process.env.DYNAMODB_GROUP_TABLE_NAME,
    Key: {
      id : id,
      ownerId : ownerId
    }
  };

  try {
    const db = new AWS.DynamoDB.DocumentClient();
    const response = await db.delete(params).promise();
    return processResponse(true, null, 200);
  } catch (error) {
    console.log("There was an error deleting the group");
    console.log("error", error);
    console.log("params", params.Key);
    return processResponse(true, null, 500);
  }
};
