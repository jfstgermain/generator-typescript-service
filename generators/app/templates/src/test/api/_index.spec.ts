import * as sinon from 'sinon';
import * as sinonChai from 'sinon-chai';
import * as request from 'supertest';
// mock http requests responses.  Only useful when mocking
// third party http request isn't possible.  Use Sinon mocks
// otherwise
import * as nock from 'nock';
import app from '../../lib';

chai.use(sinonChai);

describe('The <something>', function () {
  before(function (cb) {
    // Wait that the application has initialized before starting tests
    app.waitStarted(cb);
  });

  describe('Sub functionality of something', function () {
    it('should do something right sync', function () {
      expect(true).to.be.true;
    });

    it('should do something right async', function (cb) {
      expect(true).to.be.true;
      cb();
    });
  });
});
