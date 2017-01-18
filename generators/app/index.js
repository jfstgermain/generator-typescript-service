var Generator = require('yeoman-generator');
var chalk = require('chalk');
var yosay = require('yosay');
var _ = require('lodash');

module.exports = class extends Generator {
  constructor(args, opts) {
    super(args, opts);

    // this.argument('appname', {type: String, required: true});

    // Have Yeoman greet the user.
    this.log(
      yosay(
        `Welcome to the ${chalk.red('Node TypeScript')} generator!`
      )
    );
  }

  prompting() {
    return this.prompt([{
      type: 'input',
      name: 'name',
      message: 'Your service / module name',
      default: this.appname
    }, {
      type: 'input',
      name: 'description',
      message: 'Your service / module description',
      default: _.capitalize(`${this.appname} description`)
    }, {
      type: 'confirm',
      name: 'restify',
      choices: ['yes', 'no'],
      message: 'Will this be a Restify service?'
    }, {
      type: 'confirm',
      name: 'amqp',
      choices: ['yes', 'no'],
      message: 'Will you be connecting to an AMQP based service?'
    }, {
      type: 'confirm',
      name: 'soap',
      choices: ['yes', 'no'],
      message: 'Will you be making SOAP requests?'
    }, {
      type: 'confirm',
      name: 'oracle',
      choices: ['yes', 'no'],
      message: 'Will you need to query an Oracle database?'
    }]).then(answers => {
      this.answers = answers;
      this.answers.name = _.kebabCase(answers.name);
    });
  }

  // _writingDirs() {
  //   this.fs.copy(
  //     this.templatePath('src'),
  //     this.destinationPath('src'),
  //     {ignore: '_*.*'}
  //   );
  //   // this.directory('src', 'src');
  // }

  _writingProjectFiles() {
    let today = new Date();

    this.fs.copyTpl(
      this.templatePath('_package.json'),
      this.destinationPath('package.json'),
      {
        appName: this.answers.name,
        description: this.answers.description
      }
    );

    this.fs.copy(
      this.templatePath('config/default.yaml'),
      this.destinationPath('config/default.yaml')
    );

    this.fs.copy(
      this.templatePath('Dockerfile'),
      this.destinationPath('Dockerfile')
    );

    this.fs.copy(
      this.templatePath('_gulpfile.js'),
      this.destinationPath('gulpfile.js')
    );

    this.fs.copy(
      this.templatePath('editorconfig'),
      this.destinationPath('.editorconfig')
    );

    this.fs.copy(
      this.templatePath('gitignore'),
      this.destinationPath('.gitignore')
    );

    this.fs.copy(
      this.templatePath('LICENSE'),
      this.destinationPath('LICENSE')
    );

    this.fs.copy(this.templatePath('nvmrc'), this.destinationPath('.nvmrc'));

    this.fs.copy(
      this.templatePath('_tsconfig.json'),
      this.destinationPath('tsconfig.json')
    );

    this.fs.copy(
      this.templatePath('config/default.yaml'),
      this.destinationPath('config/default.yaml')
    );

    this.fs.copy(
      this.templatePath('_tslint.json'),
      this.destinationPath('tslint.json')
    );

    this.fs.copy(
      this.templatePath('README.md'),
      this.destinationPath('README.md')
    );

    this.fs.copy(
      this.templatePath('src/types/globals.d.ts'),
      this.destinationPath('src/types/globals.d.ts')
    );

    this.fs.copy(
      this.templatePath('src/test/utils/common.ts'),
      this.destinationPath('src/test/utils/common.ts')
    );

    if (this.answers.restify) {
      this.fs.copyTpl(
        this.templatePath('src/lib/_restify-index.ts'),
        this.destinationPath('src/lib/index.ts'),
        {
          year: today.getFullYear().toPrecision(4),
          appName: this.answers.name
        }
      );

      this.fs.copyTpl(
        this.templatePath('src/test/api/_index.spec.ts'),
        this.destinationPath('src/test/api/index.spec.ts')
      );

      this.fs.copyTpl(
        this.templatePath('config/_swagger.yaml'),
        this.destinationPath('config/swagger.yaml'),
        {appName: this.answers.name}
      );
    } else {
      this.fs.copyTpl(
        this.templatePath('src/lib/_basic-index.ts'),
        this.destinationPath('src/lib/index.ts')
      );
    }

    this.fs.copyTpl(
      this.templatePath('src/test/unit/_index.spec.ts'),
      this.destinationPath('src/test/unit/index.spec.ts')
    );
  }

  writing() {
    // this._writingDirs();
    this._writingProjectFiles();
  }

  install() {
    let npmInstalls = [
      'lodash',
      'bluebird',
      'config',
      'lib-logger-helper@git+ssh://git@bitbucket.org/jfstgermain/lib-logger-helper.git'
    ];

    let npmDevInstalls = [
      '@types/bunyan',
      '@types/chai',
      '@types/sinon',
      '@types/lodash',
      '@types/mocha',
      '@types/node',
      '@types/supertest',
      '@types/bluebird',
      'supertest',
      'chai',
      'sinon-chai',
      'sinon',
      'gulp@^3.9.1',
      'nock',
      'git-guppy',
      'tslint',  // we might want to pin down their version and not take the latest one
      'typescript@^2.1.4',
      'lib-gulp-bootstrap@git+ssh://git@bitbucket.org/jfstgermain/lib-gulp-bootstrap.git',
      'mocha',
      'gulp-tslint'
    ];

    if (this.answers.restify) {
      npmInstalls.push('restify');
      npmInstalls.push('tsoa');
      npmInstalls.push('swagger-restify-mw');
      npmDevInstalls.push('@types/restify');
    }

    if (this.answers.amqp) {
      npmInstalls.push('amqplib');
      npmDevInstalls.push('@types/amqplib');
    }

    if (this.answers.soap) {
      npmInstalls.push('soap');
      npmDevInstalls.push('@types/soap');
    }

    if (this.answers.oracle) {
      npmInstalls.push('oracledb');
      npmInstalls.push('knex');
      npmInstalls.push('knex-migrator');
      npmDevInstalls.push('@types/oracledb');
      npmDevInstalls.push('@types/knex');
    }

    this.npmInstall(npmInstalls, {save: true});
    this.npmInstall(npmDevInstalls, {'save-dev': true});
  }
};
