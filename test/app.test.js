import request from 'supertest';
import app from '../src/app.js';

describe('API ENDPOINT ', () => {
  // Common headers to satisfy Arcjet rules
  const arcjetHeaders = {
    'user-agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36',
  };

  describe('GET /health', () => {
    it('should return health status', async () => {
      const res = await request(app)
        .get('/health')
        .set(arcjetHeaders)
        .expect(200);

      expect(res.body).toHaveProperty('status', 'ok');
      expect(res.body).toHaveProperty('timestamp');
      expect(res.body).toHaveProperty('uptime');
    });
  });

  describe('GET /api', () => {
    it('should return Api message', async () => {
      const res = await request(app)
        .get('/api')
        .set(arcjetHeaders)
        .expect(200);

      expect(res.body).toHaveProperty('message', 'Welcome to the Acquisitions API');
    });
  });

  describe('GET /nonexistent', () => {
    it('should return 404', async () => {
      const response = await request(app)
        .get('/nonexistent')
        .set(arcjetHeaders)
        .expect(404);

      expect(response.body).toHaveProperty('error', 'Router not found');
    });
  });
});