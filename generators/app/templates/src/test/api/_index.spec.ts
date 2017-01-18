import * as sinon from 'sinon';
import * as sinonChai from 'sinon-chai';
import * as request from 'supertest';
// TODO: elaborate on this a bit more (when to use nock, sinon and supertest):
// mock http requests responses.  Only useful when mocking
// third party http request isn't possible.  Use Sinon mocks
// otherwise
import * as nock from 'nock';
import server from '../../lib';

chai.use(sinonChai);

describe('The <something>', function () {
  before(function (cb) {
    // Wait that the application has initialized before starting tests
    server.waitStarted(cb);
  });

  describe('Sub functionality of something', function () {
    it('should do something right sync', function () {
      expect(true).to.be.true;
    });

    it('should do something right async', function (cb) {
      request(server)
        .get('/api/gdam/')
        .expect(200, cb);
    });
  });
});
