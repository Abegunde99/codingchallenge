'use strict';

const { ForbiddenError } = require('finale-rest');
const { API: { KEY, HEADERS: { X_API_KEY } } } = require('../../config');

module.exports = (req, res, context) => {
  try {
    // Get the API key from the request headers
    const apiKey = req.headers[X_API_KEY] || req.headers['x-api-key'];

    // Check if the API key is provided
    if (!apiKey) {
      throw new ForbiddenError('API key is required.');
    }

    // Check if the API key is valid
    if (apiKey !== KEY) {
      throw new ForbiddenError('Invalid API key.');
    }

    // Continue with the request pipeline
    return context.continue;
  } catch (error) {
    // Handle any errors
    return res.status(error.status || 500).json({ message: error.message || 'Internal server error.' });
  }
};
