'use strict';
var Generator = require('yeoman-generator');
var chalk = require('chalk');
var yosay = require('yosay');
var path = require('path');
var _ = require('lodash');

module.exports = class extends Generator {
  constructor(args, opts) {
    super(args, opts);

    // this.argument('appname', {type: String, required: true});

    // Have Yeoman greet the user.
    this.log(
      yosay(
        `Welcome to the minimal ${chalk.red('Node TypeScript')} generator!`
      )
    );

    this.log([
      chalk.cyan(
        'I simply get down to business of generating, no questions asked!'
      ),
      chalk.yellow(
        'Libraries you ask? I use npm (or optionally gulp) as task runner and mocha for testing.'
      ),
      chalk.gray(
        'Can you change these? Of course, it\'s your code. I get out of the way after scaffolding.'
      )
    ].join('\n'));
  }

  prompting() {
    return this.prompt([{
      type: 'input',
      name: 'name',
      message: 'Your project name',
      default: this.appname
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
      this.appname = answers.name;
    });
  }

  _writingDirs() {
    this.fs.copy(
      this.templatePath('src'),
      this.destinationPath('src'),
      {ignore: '_*.*'}
    );
    // this.directory('src', 'src');
  }

  _writingProjectFiles() {
    let today = new Date();

    this.fs.copyTpl(
      this.templatePath('_package.json'),
      this.destinationPath('package.json'),
      {appname: _.kebabCase(path.basename(process.cwd()))}
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

    this.fs.copyTpl(
      this.templatePath('_tslint.json'),
      this.destinationPath('tslint.json'),
      {year: today.getFullYear().toPrecision(4)}
    );

    this.fs.copy(
      this.templatePath('README.md'),
      this.destinationPath('README.md')
    );
  }

  writing() {
    this._writingDirs();
    this._writingProjectFiles();
  }

  install() {
    let npmInstalls = [
      'lodash',
      'bluebird',
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
      'mocha'
    ];

    if (this.answers.restify === 'yes') {
      npmInstalls.push('restify');
      npmDevInstalls.push('@types/restify');
    }

    if (this.answers.amqp === 'yes') {
      npmInstalls.push('amqplib');
      npmDevInstalls.push('@types/amqplib');
    }

    if (this.answers.soap === 'yes') {
      npmInstalls.push('soap');
      npmDevInstalls.push('@types/soap');
    }

    if (this.answers.soap === 'yes') {
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
