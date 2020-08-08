'use strict';

const accessTokenPayload = require("../utils/accessTokenPayload");

module.exports.authenticate = async (event, context) => {
  return accessTokenPayload(event)
};
