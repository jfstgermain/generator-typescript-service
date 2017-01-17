import * as sinon from 'sinon';
import * as sinonChai from 'sinon-chai';

chai.use(sinonChai);

describe('The <something>', function () {
  before(function () {
    console.log('before block');
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
