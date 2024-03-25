'use strict';

const axios = require('axios');

const {
  STAR_WARS_API: {
    BASE_URL,
    ENDPOINTS: { PEOPLE },
  },
} = require('../../config');

module.exports = async (req, res, context) => {
  try {
    // Extract the favorites array from the request body
    const { favorites } = req.body;

    // If favorites array exists and is not empty, enrich each character with details
    if (Array.isArray(favorites) && favorites.length > 0) {
      // Map over each character ID in the favorites array and fetch details from SWAPI
      const promises = favorites.map(async (characterId) => {
        const response = await axios.get(`${BASE_URL}/people/${characterId}`);
        return response.data;
      });

      // Wait for all promises to resolve
      const favoritesDetails = await Promise.all(promises);

      // Attach the enriched favoritesDetails to the response object
      res.locals.responseData.favoritesDetails = favoritesDetails;
    }

    // Continue with the request pipeline
    return context.continue;
  } catch (error) {
    console.error('Error enriching response data:', error);
    return res.status(500).json({ message: 'Internal server error.' });
  }
};

