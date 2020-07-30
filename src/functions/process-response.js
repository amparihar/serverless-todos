module.exports = (isCors, body, statusCode) => {
  const status = statusCode || (body ? 200 : 204);
  const headers = { "Content-Type": "application/json" };
  if (isCors) {
    Object.assign(headers, {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Credentials": true,
    });
  }
  if (statusCode === 500) {
    return {
      statusCode: 500,
    };
  }
  return {
    statusCode: status,
    body: JSON.stringify(body) || "",
    headers: headers,
  };
};
