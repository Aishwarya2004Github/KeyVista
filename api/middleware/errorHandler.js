// middleware/errorHandler.js
export const errorHandler = (err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal Server Error';
    
    console.error(`Error: ${message}`); // Log the error for debugging
    
    return res.status(statusCode).json({
      success: false,
      statusCode,
      message,
    });
  };
  