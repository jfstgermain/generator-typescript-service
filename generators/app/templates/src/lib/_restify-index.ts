import config from 'config';
import * as events from 'events';
import * as fs from 'fs';
import * as http from 'http';
import * as restify from 'restify';
import * as swaggerRestify from 'swagger-restify-mw';
import * as util from 'util';
import * as path from 'path';
import loggerHelper from 'lib-logger-helper';

const logger = loggerHelper.logger();

/**
 * Serveur applicatif RESTful
 *
 * @class RestifyServer
 */
export class RestifyServer extends events.EventEmitter {
  public started = false;
  private server;

  public start() {
    const self = this;

    if (!this.server) {
      // configs
      let port = process.env.PORT || 8080;
      let options = {
        appRoot: process.cwd(),
        log: logger,
        name: '<%= appName %>',
        swaggerFile: path.resolve(process.cwd(), 'config', 'swagger.yaml'),
      };

      logger.info({ restify_options: options });

      self.server = restify.createServer(options);
      self.server.use(self.crossOrigin);
      self.server.use(restify.bodyParser());
      self.server.use(restify.requestLogger());

      swaggerRestify.create(options, function(err, swaggerRestify) {
        if (err) { throw err; }
        swaggerRestify.register(self.server);
        self.server.listen(port, function() {
          self.notifyStarted();

          logger.info('Server started:', { server_name: self.server.name, server_url: self.server.url });
        });
      });
    }
  }

  public waitStarted(cb) {
    if (this.started) {
      done();
    } else {
      this.on('started', cb);
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
