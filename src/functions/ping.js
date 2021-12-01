module.exports.handler = async (event, context) => {
  return {
    statusCode: 200,
    body: "pong",
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Credentials": true,
    },
  };
};
