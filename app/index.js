'use strict';
var generators = require('yeoman-generator');
var yosay = require('yosay');
var chalk = require('chalk');
var wiredep = require('wiredep');
var mkdirp = require('mkdirp');
var _s = require('underscore.string');


module.exports = generators.Base.extend({
  _creatProjectFileSystem: function () {
    var destRoot = this.destinationRoot(),
        sourceRoot = this.sourceRoot(),
        appDir = destRoot + '/app',
        templateContext = {

          // read me

          appname: this.appname,
          appdescription: this.appdescription,
          appversion: this.appversion,
          applicense: this.applicense,
          appauthor: this.appauthor,
          appemail: this.appemail,

          // language

          includePug:this.includePug,
          includeSass:this.includeSass,

          // libs

          includeBourbon:this.includeBourbon,
          includeNeat:this.includeNeat,
          includeModernizr:this.includeModernizr,

          //frameworks

          includeBootstrap:this.includeBootstrap,
          includeBulma:this.includeBulma,
          includeJQuery:this.includeJQuery,

          // auters

          date: (new Date).toISOString().split('T')[0],
          name: this.pkg.name,
          version: this.pkg.version,
          includeBabel: this.options['babel'],
          testFramework: this.options['test-framework']
        };

    // creating directories structure

    mkdirp(appDir + '/scripts');
    mkdirp(appDir + '/images');
    mkdirp(appDir + '/pugFiles');
    mkdirp(appDir + '/styles');
    mkdirp(appDir + '/fonts');

    // copie des fichiers


      // config editor

    this.fs.copy(sourceRoot + '/.editorconfig', destRoot + '/.editorconfig');

      // babel for gulpfile

    this.fs.copy(sourceRoot + '/.babelrc', destRoot + '/.babelrc');

      // jshint blanc

    this.fs.copy(sourceRoot + '/.jshintrc', destRoot + '/.jshintrc');
    this.fs.copy(sourceRoot + '/robots.txt', appDir + '/robots.txt');
    this.fs.copy(sourceRoot + '/humans.txt', appDir + '/humans.txt');

      // javascript for application blanc

    this.fs.copy(sourceRoot + '/app/main.js', appDir + '/scripts/main.js');

      // copies des fichier avec application des condition


    this.fs.copyTpl(sourceRoot + '/CONTRINUTING.md', destRoot + '/CONTRINUTING.md', templateContext);
    this.fs.copyTpl(sourceRoot + '/_package.json', destRoot + '/package.json', templateContext);
    this.fs.copyTpl(sourceRoot + '/gulpfile.js', destRoot + '/gulpfile.babel.js', templateContext);
    this.fs.copyTpl(sourceRoot + '/README.md', destRoot + '/README.md', templateContext);

  },
    _h5bp: function () {
      this.fs.copy(
        this.sourceRoot('favicon.ico'),
        this.destRoot('app/favicon.ico')
      );

      this.fs.copy(
        this.sourceRoot('apple-touch-icon.png'),
        this.destRoot('app/apple-touch-icon.png')
      ) },

    // git file config

    _git: function () {
      var destRoot = this.destinationRoot(),
          sourceRoot = this.sourceRoot();
      this.fs.copy(sourceRoot + '/.gitignore', destRoot + '/.gitignore');

      this.fs.copy(sourceRoot + '/.gitattributes', destRoot + '/.gitattributes');
    },

    // bower config

    _bower: function () {
      var destRoot = this.destinationRoot(),
          sourceRoot = this.sourceRoot();
      var bowerJson = {
        name: _s.slugify(this.appname),
        private: true,
        devDependencies: {}
      };

      if (this.includeBootstrap) {
        if (this.includeSass) {
          bowerJson.devDependencies['bootstrap'] = '~4.0';
          bowerJson.overrides = {
            'bootstrap': {
              'main': [
                'assets/stylesheets/_bootstrap.scss',
                'assets/fonts/bootstrap/*',
                'assets/javascripts/bootstrap.js'
              ]
            }
          };
        } else {
          bowerJson.devDependencies['bootstrap'] = '~3.3.5';
          bowerJson.overrides = {
            'bootstrap': {
              'main': [
                'less/bootstrap.less',
                'dist/css/bootstrap.css',
                'dist/js/bootstrap.js',
                'dist/fonts/*'
              ]
            }
          };
        }
      }
      if (this.includeBulma) {
        if (this.includeSass) {
          bowerJson.devDependencies['bulma'] = '~0.7.4';

          bowerJson.overrides = {
            'bulma': {
              'main': [
                'bulma.sass'
              ]
            }
          };

        }
        bowerJson.devDependencies['fontawesome'] = '~5.7.2';

        bowerJson.overrides = {
          'fontawesome': {
            'main': [
              'js/all.js'
            ]
          }
        };
      }
      if (this.includeBourbon) {
        if (this.includeSass) {
          bowerJson.devDependencies['bourbon'] = '~4.2.7';
          bowerJson.overrides = {
            'bourbon': {
              'main': [
                'core/_bourbon.scss',
              ]
            }
          };
        }
      }
      if (this.includeNeat) {
        if (this.includeSass) {
          bowerJson.devDependencies['neat'] = '~1.8.0';
          bowerJson.overrides = {
            'neat': {
              'main': [
                'app/assets/stylesheets/_neat.scss',
              ]
            }
          };
        }
      }
      if (this.includeJQuery) {
        bowerJson.dependencies['jquery'] = '~3.1.1';
      }

      if (this.includeModernizr) {
        bowerJson.dependencies['modernizr'] = '~2.8.1';
      }

      this.fs.writeJSON('bower.json', bowerJson);
      this.fs.copy(sourceRoot + '/.bowerrc',destRoot + '/.bowerrc');
    },
      // fin bower,

    // style config

    _styles: function () {
      var destRoot = this.destinationRoot(),
          sourceRoot = this.sourceRoot(),
          appDir = destRoot + '/app',
          css = 'main';

      if (this.includeSass) {
        css += '.sass';
      } else {
        css += '.css';
      }
      this.fs.copyTpl(sourceRoot + '/app/styles/' + css, appDir + '/styles/' + css,{includeBootstrap: this.includeBootstrap, includeBulma: this.includeBulma,includeBourbon: this.includeBourbon,includeNeat: this.includeNeat});
      this.fs.copyTpl(sourceRoot + '/app/styles/demo.scss', appDir + '/styles/demo.scss' ,{includeBulma: this.includeBulma,includeBourbon: this.includeBourbon,includeNeat: this.includeNeat});
    },
      // fin styles,

    // html config

    _html: function () {
      var destRoot = this.destinationRoot(),
          sourceRoot = this.sourceRoot();
      var bsPath;
      var bulmaPath;

      // path prefix for Bootstrap JS files
      if (this.includeBootstrap) {
        bsPath = 'app/bower_components/';

        if (this.includeSass) {
          bsPath += 'bootstrap-sass/assets/javascripts/bootstrap/';
        } else {
          bsPath += 'bootstrap/js/';
        }
      } else if (this.includeBulma) {
        bulmaPath = 'app/bower_components/fontawesome/js/';

        if (this.includeSass) {
          bulmaPath += 'bulma/';
        }
      }

      if (this.includePug){
          if(this.includeBootstrap){
              this.fs.copyTpl(
                sourceRoot + '/app/pugFiles/layouts/bslayouts.pug',
                destRoot + '/app/pugFiles/index.pug', {
                  appname: this.appname,
                  includeSass: this.includeSass,
                  includeBootstrap: this.includeBootstrap,
                  includeModernizr: this.includeModernizr,
                  includeJQuery: this.includeJQuery,
                  bsPath: bsPath,
                  bsPlugins:[
                    'affix',
                    'alert',
                    'dropdown',
                    'tooltip',
                    'modal',
                    'transition',
                    'button',
                    'popover',
                    'carousel',
                    'scrollspy',
                    'collapse',
                    'tab'
                  ]});
          } else if(this.includeBulma){
              this.fs.copyTpl(sourceRoot +'/app/pugFiles/layouts/bulmalayout.pug',

              destRoot + '/app/pugFiles/index.pug',
              {
              appname: this.appname,
              includeSass: this.includeSass,
              includeBulma: this.includeBulma,
              includeModernizr: this.includeModernizr
            } );
          }

      } else{
            this.fs.copyTpl(sourceRoot + '/index.html',
              destRoot + '/app/index.html',
                {
                  appname: this.appname,
                  includeSass: this.includeSass,
                  includeBootstrap: this.includeBootstrap,
                  includeModernizr: this.includeModernizr,
                  includeJQuery: this.includeJQuery,
                  bsPath: bsPath,
                  bsPlugins: [
                    'affix',
                    'alert',
                    'dropdown',
                    'tooltip',
                    'modal',
                    'transition',
                    'button',
                    'popover',
                    'carousel',
                    'scrollspy',
                    'collapse',
                    'tab'
                  ]}
      );
      }
        },

      // fin html


  // init (+ welcome text)
  initializing: function () {
      var message = chalk.yellow.bold('Welcome to NSC Generator  \n ') + chalk.yellow(' The best Web Starter kit  \n Bootstrap sass bulma pug  ');
      this.log(yosay(message, { maxLength: 20 }));
      this.pkg = require('../package.json');
  },

  // prompting (all questions here)

  prompting: function () {

      var prompts = [
        {
          name: 'name',
          message: 'what is the name of the project? \n\n',
          default: this.appname
        },
        {
          name: 'description',
          message: '\n\n How is the description of your project? \n\n'
        },
        {
          name: 'version',
          message: ' \n\n what is the version of the project? \n\n'
        },
        {
          name: 'license',
          message: '\n\n How is your project licensed? \n\n',
          default: "MIT"
        },
        {
          name: 'author',
          message: '\n\n what is the name of the Author? \n\n'
        },
        {
          name: 'email',
          message: ' \n\n what is email address? \n\n'
        },
        {
          type: 'checkbox',
          name: 'prepross',
          message: '\n\n Would you like to include Prepross/libs for (css, html)? \n\n',
          choices: [
            {
            name: 'Sass',
            value: 'includeSass',
            checked: true
            },
            {
            name: 'Pug',
            value: 'includePug',
            checked: true
            },
            {
            name: 'Modernizr',
            value: 'includeModernizr',
            checked: false
            },
            {
            name: 'bourbon',
            value: 'includeBourbon',
            checked: false
            },
            {
            name: 'Neat',
            value: 'includeNeat',
            checked: false
          }]
          },
        {
        type: 'checkbox',
        name: 'features',
        message: 'Which additional features would you like to include?  \n\n',
        choices: [ {
          name: 'Bootstrap',
          value: 'includeBootstrap',
        },{
          name: 'Bulma',
          value: 'includeBulma',
        },{
          name: 'Zurb Foundation 6',
          value: 'includeFoundation',
        }]
      },

        {
        type: 'confirm',
        name: 'includeJQuery',
        message: 'Would you like to include jQuery?',
        default: true,
        when: function (answers) {
          return answers.features.indexOf('includeBootstrap') === -1;
        }
      }];

      return this.prompt(prompts).then(function (answers) {
        var features = answers.features;
        var prepross = answers.prepross;
        function hasFeature(feat) {
          return features && features.indexOf(feat) !== -1;
        };
        function hasPrepross(pPros) {
              return prepross && prepross.indexOf(pPros) !== -1;
          };

        // manually deal with the response, get back and store the results.
        // we change a bit this way of doing to automatically do this in the self.prompt() method.
        this.appname = answers.name;
        this.appdescription = answers.description;
        this.appversion = answers.version;
        this.applicense = answers.license;
        this.appauthor = answers.author;
        this.appnemail = answers.email;
        this.includeJQuery = answers.includeJQuery;

        // prepross / libs

        this.includeSass = hasPrepross('includeSass');
        this.includePug = hasPrepross('includePug');
        this.includeBourbon = hasPrepross('includeBourbon');
        this.includeNeat = hasPrepross('includeNeat');
        this.includeModernizr = hasPrepross('includeModernizr');

        // frameworks

        this.includeBootstrap = hasFeature('includeBootstrap');
        this.includeBulma = hasFeature('includeBulma');
        this.includeMdl = hasFeature('includeFountation');
        this.includeMdl = hasFeature('includeSemanticUi');


      }.bind(this));
    },
    // fin prompting
  // yeoman config

  configuring: function () {
    this.config.save();
  },

  /**
  * exec all functions
  * npm and bower installation
  */

  writing:function () {
    this._creatProjectFileSystem();6

    this._bower();
    this._git();
    this._styles();
    JSON.stringify(this._html());
  },
  install: function () {
      var install = chalk.white.bold('Installation  \n Running \n') + chalk.green('" npm install "\n && " bower install "  ');
      this.log(install, { maxLength: 25 });
     this.npmInstall();
     this.bowerInstall();

  }
});
