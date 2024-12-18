const { createShortUrl, getUrlByAlias } = require('../services/urlShortnerService');
const shortenUrl = async (req, res) => {
  const { longUrl, alias, topic } = req.body;
  const userId = req.user.id;

  try {
    const newUrl = await createShortUrl(longUrl, alias, topic, userId);
    res.json({
      shortUrl: `http://short.ly/${newUrl.shortUrl}`,
      createdAt: newUrl.createdAt
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

const redirectToUrl = async (req, res) => {
  const { alias } = req.params;
  try {
    const urlAlias = await getUrlByAlias(alias);
    res.redirect(urlAlias.longUrl);
  } catch (error) {
    res.status(404).json({ error: 'Short URL not found' });
  }
}

module.exports = { shortenUrl, redirectToUrl };
