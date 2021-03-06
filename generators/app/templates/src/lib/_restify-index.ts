import config from 'config';
import * as events from 'events';
import * as fs from 'fs';
import * as http from 'http';
import * as restify from 'restify';
import * as swaggerRestify from 'swagger-restify-mw';
import * as util from 'util';
import * as path from 'path';
import loggerHelper from 'lib-logger-helper';
import * as _ from 'lodash';

let logger;

if (process.env.NODE_ENV === 'production') {
  logger = loggerHelper.logger(`${process.cwd()}/config/logger-production.json`);
} else {
  logger = loggerHelper.logger();
}
/**
 * Serveur applicatif RESTful
 *
 * @class RestifyServer
 */
export class RestifyServer extends events.EventEmitter {
  public started = false;
  public server;

  public start() {
    const self = this;

    if (!self.server) {
      // configs
      let port = process.env.PORT || 8080;
      let options = {
        appRoot: process.cwd(),
        log: logger,
        name: '<%= appName %>',
        swaggerFile: path.resolve(process.cwd(), 'config', 'swagger.yaml'),
      };

      logger.info(_.omit(options, 'log'), 'Restify options');

      self.server = restify.createServer(options);
      self.server.use(self.crossOrigin);
      self.server.use(restify.bodyParser());
      self.server.use(restify.requestLogger());

      swaggerRestify.create(options, function(err, swaggerRestify) {
        if (err) { throw err; }
        swaggerRestify.register(self.server);
        self.server.listen(port, function() {
          self.notifyStarted();

          logger.info({
            server_name: self.server.name,
            server_url: self.server.url,
          }, 'Server started');
        });
      });
    }

    // ***** DUMMY ROUTE TO BE REMOVED *****
    self.server.get('/api/gdam', (req, res) => {
      logger.debug({
        some_field: 'hello',
      }, 'Always add the optional description as the last log param');

      res.send(200);
    });
    // *************************************
  }

  public waitStarted(cb) {
    if (this.started) {
      cb();
    } else {
      this.once('started', cb);
    }
  }

  private notifyStarted() {
    this.started = true;
    this.emit('started');
  }

  /**
   * Configure le serveur pour supporter les appels d'origine externe
   *
   * @param {any} req objet de requête
   * @param {any} res objet de réponse
   * @param {any} next méthode suivante dans le pipeline
   * @returns {undefined}
   */
  private crossOrigin(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    return next();
  }
}

const restifyServer = new RestifyServer();
restifyServer.start();

export default restifyServer;
