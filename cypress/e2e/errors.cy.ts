import { getErrorMessage, AppError } from '../../src/lib/errors';

describe('Error Library Unit Tests', () => {
  describe('getErrorMessage', () => {
    it('should return "Unknown error" for null or undefined', () => {
      expect(getErrorMessage(null)).to.equal('Unknown error');
      expect(getErrorMessage(undefined)).to.equal('Unknown error');
    });

    it('should extract message from nested ErrorResponse', () => {
      const err = { error: { code: 'TEST_CODE', message: 'Nested message' } };
      expect(getErrorMessage(err)).to.equal('Nested message');
    });

    it('should extract message from flat Error object', () => {
      const err = new Error('Flat message');
      expect(getErrorMessage(err)).to.equal('Flat message');
    });

    it('should handle custom dict mappings', () => {
      const err = { error: { code: 'TEST_CODE', message: 'Original' } };
      const dict = { 'TEST_CODE': 'Translated message' };
      expect(getErrorMessage(err, dict)).to.equal('Translated message');
    });

    it('should fallback to stringified error for primitives', () => {
      expect(getErrorMessage('String error')).to.equal('String error');
      expect(getErrorMessage(123)).to.equal('123');
    });
  });

  describe('AppError', () => {
    it('should create an instance correctly', () => {
      const err = new AppError('CUSTOM', 418, 'I am a teapot');
      expect(err.code).to.equal('CUSTOM');
      expect(err.statusCode).to.equal(418);
      expect(err.message).to.equal('I am a teapot');
      expect(err.name).to.equal('AppError');
    });

    it('toJSON should return correct ErrorResponse format', () => {
      const err = new AppError('CUSTOM', 418, 'I am a teapot');
      const json = err.toJSON();
      expect(json).to.deep.equal({
        error: {
          code: 'CUSTOM',
          statusCode: 418,
          message: 'I am a teapot'
        }
      });
    });

    it('badRequest should create a 400 error', () => {
      const err = AppError.badRequest('Bad');
      expect(err.code).to.equal('BAD_REQUEST');
      expect(err.statusCode).to.equal(400);
      expect(err.message).to.equal('Bad');
    });

    it('unauthorized should create a 401 error', () => {
      const err = AppError.unauthorized();
      expect(err.code).to.equal('UNAUTHORIZED');
      expect(err.statusCode).to.equal(401);
      expect(err.message).to.equal('You must be logged in');

      const customErr = AppError.unauthorized('Custom unauth');
      expect(customErr.message).to.equal('Custom unauth');
    });

    it('forbidden should create a 403 error', () => {
      const err = AppError.forbidden();
      expect(err.code).to.equal('FORBIDDEN');
      expect(err.statusCode).to.equal(403);
      expect(err.message).to.equal('You do not have permission');
    });

    it('notFound should create a 404 error', () => {
      const err = AppError.notFound();
      expect(err.code).to.equal('NOT_FOUND');
      expect(err.statusCode).to.equal(404);
      expect(err.message).to.equal('Resource not found');
    });

    it('internal should create a 500 error', () => {
      const err = AppError.internal();
      expect(err.code).to.equal('INTERNAL_ERROR');
      expect(err.statusCode).to.equal(500);
      expect(err.message).to.equal('Internal server error');
    });
  });
});
