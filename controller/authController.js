const { verifyGoogleToken, generateJwtToken } = require('../services/googleAuthenticationService');

// google login handler 
const googleLogin = async (req, res) => {
  const { idToken } = req.body;

  try {
    const user = await verifyGoogleToken(idToken);
    const token = generateJwtToken(user);
    res.json({ token });
  } catch (error) {
    res.status(400).json({ error: 'Invalid Token' });
  }
}

module.exports = {googleLogin};
