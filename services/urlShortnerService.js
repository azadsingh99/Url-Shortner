// services/urlService.js
const Url = require('../models/Url');
const shortid = require('shortid');
const redis = require('redis');
const client = redis.createClient();

const createShortUrl = async (longUrl, alias, topic, userId) => {
  let shortUrl = alias || shortid.generate();

  const ifUrlAlreadyExist = await Url.findOne({ $or: [{ shortUrl }, { alias }] });

  if (ifUrlAlreadyExist) {
    throw new Error('Short URL or alias already exists');
  }

  const newUrlObject = new Url({
    longUrl,
    shortUrl,
    alias,
    topic,
    userId
  });

  await newUrlObject.save();
  client.set(shortUrl, JSON.stringify(newUrlObject));  
  return newUrlObject;
}

const getUrlByAlias = async (alias) => {
    try {
      const cachedUrl = await new Promise((resolve, reject) => {
        client.get(alias, (err, result) => {
          if (err) reject(err);
          resolve(result);
        });
      });
  
      
      if (cachedUrl) {
        return JSON.parse(cachedUrl);
      } 
   
      const isUrlExists = await Url.findOne({ alias });
      if (isUrlExists) {
        client.set(alias, JSON.stringify(isUrlExists));
        return isUrlExists;
      } else {
        throw new Error('Short URL not found');
      }
    } catch (error) {
      throw error;
    }
  };
  

module.exports = { createShortUrl, getUrlByAlias };
