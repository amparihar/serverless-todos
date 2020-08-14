"use strict";

const accessTokenPayload = require("../utils/accessTokenPayload");

module.exports.handler = async (event, context) => {
  const decodedToken = accessTokenPayload(event);
  if (decodedToken) {
    return generatePolicy(decodedToken.uid, "Allow", "*");
  }
  return generatePolicy(undefined, "Deny", event.methodArn);
};

var generatePolicy = function (principalId, effect, resource) {
  var authResponse = {};
  authResponse.principalId = principalId;
  if (effect && resource) {
    var policyDocument = {};
    policyDocument.Version = "2012-10-17";
    policyDocument.Statement = [];
    var statementOne = {};
    statementOne.Action = "execute-api:Invoke";
    statementOne.Effect = effect;
    statementOne.Resource = resource;
    policyDocument.Statement[0] = statementOne;
    authResponse.policyDocument = policyDocument;
    if (effect === "Allow") {
      authResponse.context = {
        uid: principalId,
      };
    }
  }
  return authResponse;
};
