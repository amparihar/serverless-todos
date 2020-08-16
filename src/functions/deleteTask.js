'use strict';
const AWS = require("aws-sdk");
const processResponse = require("../utils/process-response");
const processErrorResponse = require("../utils/process-error-response");

module.exports.deleteTask = async (event, context) => {
  const id = event.pathParameters.id || "";
  const groupId = event.queryStringParameters.group;
  const params = {
    TableName: process.env.DYNAMODB_TASK_TABLE_NAME,
    Key: {
      id : id,
      groupId : groupId
    }
  };

  try {
    const db = new AWS.DynamoDB.DocumentClient();
    const response = await db.delete(params).promise();
    return processResponse(true, null, 200);
  } catch (error) {
    console.log("There was an error deleting the task");
    console.log("error", error);
    console.log("params", params.Key);
    return processErrorResponse(error);
  }
};
