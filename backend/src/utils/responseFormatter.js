export function formatSuccessResponse(data) {
  return {
    success: true,
    ...data
  };
}

export function formatErrorResponse(error, message, statusCode = 500) {
  return {
    success: false,
    error,
    message
  };
}