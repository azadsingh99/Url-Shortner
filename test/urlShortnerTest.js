// tests/urlShortener.test.js
const request = require('supertest');
const app = require('../index'); 

describe('URL Shortener API', () => {
  it('should create a short URL', async () => {
    const response = await request(app)
      .post('/api/shorten')
      .send({ longUrl: 'http://example.com' })
      .set('Authorization', 'Bearer <valid-jwt-token>');
    
    expect(response.status).toBe(200);
    expect(response.body.shortUrl).toContain('short.ly');
  });
});
