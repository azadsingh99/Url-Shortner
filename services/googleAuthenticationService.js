const { OAuth2Client } = require('google-auth-library');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// verify token , if user is there then OK, else create it and insert it into the user table.
const verifyGoogleToken = async (idToken) => {
  const tokenVerifier = await client.verifyIdToken({
    idToken,
    audience: process.env.GOOGLE_CLIENT_ID,
  });

  const payload = tokenVerifier.getPayload();
  const user = await User.findOne({ googleId: payload.sub });

  if (!user) {
    const newUserObject = new User({
      googleId: payload.sub,
      email: payload.email,
      name: payload.name,
    });
    await newUserObject.save();
    return newUserObject;
  }

  return user;
}

const generateJwtToken = (user) => {
  return jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '1d' });
}

module.exports = { verifyGoogleToken, generateJwtToken };
