'use strict';

const {
  Errors: { BadRequestError },
} = require('finale-rest');

const {
  API: {
    HEADERS: { X_SLUG },
    SLUGS: { MYSELF },
  }, API,
} = require('../../config');

const { UserModel } = require('../model');

module.exports = async (req, res, context) => {
  try {
    // Identify user based on the slug
    const slug = req.headers[X_SLUG] || req.headers['x-slug'];
    if (!slug) {
      throw new BadRequestError('User authentication failed: x-slug header is missing.');
    }

    // Decode the base64 encoded slug
    const decodedSlug = Buffer.from(slug, 'base64').toString('utf-8');

    // Get user with slug === decodedSlug
    const user = await UserModel.findOne({
      where: { slug: decodedSlug },
    });

    if (!user) {
      throw new BadRequestError('user not found.');
    }

    // Attach user to the request object
    req.user = user;

    return context.continue;
  } catch (error) {
    console.error('Error fetching user:', error);
    return res.status(500).json({ message: 'Internal server error.' });
  }
};

