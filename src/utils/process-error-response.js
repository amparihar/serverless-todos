const processResponse = require("./process-response");

const processErrorResponse = (error = {}) => {
  return processResponse(
    true,
    {
      error: error.name || "Service Exception",
      message:error.message || "An error has occurred while processing the request."
    },
    error.statusCode || 500
  );
};

module.exports = processErrorResponse;
