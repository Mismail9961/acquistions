import request from 'supertest'
import app from '../src/app.js';

describe('API ENDPOINT ', () => {
    describe('GET /health', () => {
        it('should return health status', async () => {
            const res = await request(app).get('/health').expect(200);
            expect(res.body).toHaveProperty('status', 'ok');
            expect(res.body).toHaveProperty('timestamp');
            expect(res.body).toHaveProperty('uptime');
        });
    });

    describe('GET /api', () => {
        it('should return Api message', async () => {
            const res = await request(app).get('/api').expect(200);
            expect(res.body).toHaveProperty('message', 'Welcome to the Acquisitions API');
        });
    });

    describe('GET /nonexistent', () => {
        it('should return 404', async () => {
           const respone = await request(app).get('/nonexistent').expect(404);
           expect(respone.body).toHaveProperty('error', 'Router not found');
        });
    });

});
