import request from 'supertest';
import { app } from '../src/index';

describe('End-to-End Application Cybersecurity & Hardening Audit', () => {

  describe('1. Security Headers & Server Identification', () => {
    it('should include Helmet defensive security headers', async () => {
      const res = await request(app).get('/health');
      expect(res.headers).toHaveProperty('x-content-type-options', 'nosniff');
      expect(res.headers).toHaveProperty('x-dns-prefetch-control');
      // Ensure X-Powered-By is hidden by Helmet
      expect(res.headers['x-powered-by']).toBeUndefined();
    });

    it('should enforce CSP and nosniff on the static uploads route', async () => {
      const res = await request(app).get('/uploads/nonexistent-file.txt');
      expect(res.headers['x-content-type-options']).toBe('nosniff');
      expect(res.headers['content-security-policy']).toBe("default-src 'none'");
    });
  });

  describe('2. Authentication & Broken Access Control (OWASP A01)', () => {
    it('should reject unauthenticated access to /api/auth/me with 401', async () => {
      const res = await request(app).get('/api/auth/me');
      expect(res.status).toBe(401);
      expect(res.body).toHaveProperty('error');
    });

    it('should reject forged or malformed JWT tokens with 401', async () => {
      const res = await request(app)
        .get('/api/auth/me')
        .set('Authorization', 'Bearer forged.token.payload');
      expect(res.status).toBe(401);
      expect(res.body.error).toMatch(/invalid token/i);
    });

    it('should reject unauthenticated POST to /api/detect/disease', async () => {
      const res = await request(app)
        .post('/api/detect/disease')
        .send({ cropType: 'wheat' });
      expect(res.status).toBe(401);
    });

    it('should reject unauthenticated POST to /api/forum/threads', async () => {
      const res = await request(app)
        .post('/api/forum/threads')
        .send({ title: 'Test Thread', content: 'Test content here', categoryId: '1' });
      expect(res.status).toBe(401);
    });
  });

  describe('3. Information Disclosure & Stack Trace Leak Prevention (OWASP A05)', () => {
    it('should silently handle bot/probe paths with clean 404 without stack traces', async () => {
      const res = await request(app).get('/.env');
      expect(res.status).toBe(404);
      expect(res.body.stack).toBeUndefined();
    });

    it('should not leak stack traces on invalid route requests', async () => {
      const res = await request(app).get('/api/invalid-nonexistent-endpoint');
      expect(res.status).toBe(404);
      expect(res.body.stack).toBeUndefined();
    });
  });

  describe('4. File Upload & Path Traversal Protections (OWASP A04/A03)', () => {
    it('should reject file upload without authentication', async () => {
      const res = await request(app)
        .post('/api/detect/disease')
        .attach('image', Buffer.from('fake script content'), 'exploit.sh');
      expect(res.status).toBe(401);
    });
  });

  describe('5. Input Validation on Authentication Endpoints', () => {
    it('should reject registration requests missing mandatory email and password', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({ firstName: 'Test' });
      expect([400, 422]).toContain(res.status);
    });

    it('should reject login requests with invalid email formats', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({ email: 'not-an-email', password: '123' });
      expect([400, 422]).toContain(res.status);
    });

    it('should reject password reset requests with empty tokens', async () => {
      const res = await request(app)
        .post('/api/auth/reset-password')
        .send({ token: '', newPassword: 'short' });
      expect([400, 422]).toContain(res.status);
    });
  });
});
