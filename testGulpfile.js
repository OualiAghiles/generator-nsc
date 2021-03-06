'use strict';
var generators = require('yeoman-generator');
var yosay = require('yosay');
var chalk = require('chalk');
var wiredep = require('wiredep');
var mkdirp = require('mkdirp');
var _s = require('underscore.string');

module.exports = generators.Base.extend({
    constructor: function () {
    var testLocal;

    generators.Base.apply(this, arguments);

    this.option('skip-welcome-message', {
      desc: 'Skips the welcome message',
      type: Boolean
    });

    this.option('skip-install-message', {
      desc: 'Skips the message after the installation of dependencies',
      type: Boolean
    });

    this.option('test-framework', {
      desc: 'Test framework to be invoked',
      type: String,
      defaults: 'mocha'
    });

    this.option('babel', {
      desc: 'Use Babel',
      type: Boolean,
      defaults: true
    });

    if (this.options['test-framework'] === 'mocha') {
      testLocal = require.resolve('generator-mocha/generators/app/index.js');
    } else if (this.options['test-framework'] === 'jasmine') {
      testLocal = require.resolve('generator-jasmine/generators/app/index.js');
    }

    this.composeWith(this.options['test-framework'] + ':app', {
      options: {
        'skip-install': this.options['skip-install']
      }
    }, {
      local: testLocal
    });
  },

  initializing: function () {
    this.pkg = require('../package.json');
  },
  prompting: function () {
    if (!this.options['skip-welcome-message']) {
      this.log(yosay('\'Allo \'allo! Out of the box I include HTML5 Boilerplate, jQuery, and a gulpfile to build your app.'));
    }
    var prompts = [{
      type: 'checkbox',
      name: 'features',
      message: 'Which additional features would you like to include?',
      choices: [{
        name: 'Sass',
        value: 'includeSass',
        checked: true
      }, {
        name: 'Bootstrap',
        value: 'includeBootstrap',
        checked: true
      },{
        name: 'MDL',
        value: 'includeMdl',
        checked: false
      },{
        name: 'bourbon',
        value: 'includeBourbon',
        checked: false
      }, {
        name: 'Neat',
        value: 'includeNeat',
        checked: false
      },{
        name: 'Pug',
        value: 'includePug',
        checked: true
      }, {
        name: 'Modernizr',
        value: 'includeModernizr',
        checked: true
      }]
    }, {
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

      function hasFeature(feat) {
        return features && features.indexOf(feat) !== -1;
      };

      // manually deal with the response, get back and store the results.
      // we change a bit this way of doing to automatically do this in the self.prompt() method.
      this.includeSass = hasFeature('includeSass');
      this.includeBootstrap = hasFeature('includeBootstrap');
      this.includeMdl = hasFeature('includeMdl');
      this.includeBourbon = hasFeature('includeBourbon');
      this.includeNeat = hasFeature('includeNeat');
      this.includePug = hasFeature('includePug');
      this.includeModernizr = hasFeature('includeModernizr');
      this.includeJQuery = answers.includeJQuery;

    }.bind(this));
  }, // fin prompting
  writing: {
    gulpfile: function () {
      this.fs.copyTpl(
        this.templatePath('gulpfile.js'),
        this.destinationPath('gulpfile.js'),
        {
          date: (new Date).toISOString().split('T')[0],
          name: this.pkg.name,
          version: this.pkg.version,
          includeSass: this.includeSass,
          includeBootstrap: this.includeBootstrap,
          includeMdl: this.includeMdl,
          includeBourbon: this.includeBourbon,
          includeNeat : this.includeNeat,
          includePug : this.includePug,
          includeBabel: this.options['babel'],
          testFramework: this.options['test-framework']
        }
      );
    },  
  

  packageJSON: function () {
      this.fs.copyTpl(
        this.templatePath('_package.json'),
        this.destinationPath('package.json'),
        {
          includeSass: this.includeSass,
          includePug: this.includePug,
          includeBabel: this.options['babel']
        }
      );
    },// fin  packageJSON

    babel: function () {
      this.fs.copy(
        this.templatePath('babelrc'),
        this.destinationPath('.babelrc')
      );
    },// fin  babel

    git: function () {
      this.fs.copy(
        this.templatePath('gitignore'),
        this.destinationPath('.gitignore'));

      this.fs.copy(
        this.templatePath('gitattributes'),
        this.destinationPath('.gitattributes'));
    }, // fin git

    bower: function () {
      var bowerJson = {
        name: _s.slugify(this.appname),
        private: true,
        dependencies: {}
      };

      if (this.includeBootstrap) {
        if (this.includeSass) {
          bowerJson.dependencies['bootstrap-sass'] = '~3.3.7';
          bowerJson.overrides = {
            'bootstrap-sass': {
              'main': [
                'assets/stylesheets/_bootstrap.scss',
                'assets/fonts/bootstrap/*',
                'assets/javascripts/bootstrap.js'
              ]
            }
          };
        } else {
          bowerJson.dependencies['bootstrap'] = '~3.3.5';
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
      } else if (this.includeMdl) {
        if (this.includeSass) {
          bowerJson.dependencies['mdl'] = '~1.2.1';
          bowerJson.overrides = {
            'material-design-lite': {
              'main': [
                'src/material-design-lite.scss',
                'src/**/*.js'
              ]
            }
          };
        }
      } else if (this.includeBourbon) {
        if (this.includeBourbon) {
          bowerJson.dependencies['Bourbon'] = '~4.2.7';
          bowerJson.overrides = {
            'bourbon': {
              'main': [
                'core/_bourbon.scss',
              ]
            }
          };
        }
      } else if (this.includeNeat) {
        if (this.includeNeat) {
          bowerJson.dependencies['Neat'] = '~1.8.0';
          bowerJson.overrides = {
            'neat': {
              'main': [
                'app/assets/stylesheets/_neat.scss',
              ]
            }
          };
        }
      } else if (this.includeJQuery) {
        bowerJson.dependencies['jquery'] = '~2.1.1';
      }

      if (this.includeModernizr) {
        bowerJson.dependencies['modernizr'] = '~2.8.1';
      }

      this.fs.writeJSON('bower.json', bowerJson);
      this.fs.copy(
        this.templatePath('bowerrc'),
        this.destinationPath('.bowerrc')
      );
    }, // fin bower
    
     editorConfig: function () {
      this.fs.copy(
        this.templatePath('editorconfig'),
        this.destinationPath('.editorconfig')
      );
    },

    h5bp: function () {
      this.fs.copy(
        this.templatePath('favicon.ico'),
        this.destinationPath('app/favicon.ico')
      );

      this.fs.copy(
        this.templatePath('apple-touch-icon.png'),
        this.destinationPath('app/apple-touch-icon.png')
      );

      this.fs.copy(
        this.templatePath('robots.txt'),
        this.destinationPath('app/robots.txt'));
    },
    styles: function () {
      var css = 'main';

      if (this.includeSass) {
        css += '.sass';
      } else {
        css += '.css';
      }

      this.fs.copyTpl(
        this.templatePath(css),
        this.destinationPath('app/styles/' + css),
        {
          includeBootstrap: this.includeBootstrap,
          includeMdl: this.includeMdl,
          includeBourbon: this.includeBourbon,
          includeNeat: this.includeNeat
        }
      );
    },
    scripts: function () {
      this.fs.copy(
        this.templatePath('main.js'),
        this.destinationPath('app/scripts/main.js')
      );
    },
    
    html: function () {
      var bsPath;
      var mdlPath;

      // path prefix for Bootstrap JS files
      if (this.includeBootstrap) {
        bsPath = '/bower_components/';

        if (this.includeSass) {
          bsPath += 'bootstrap-sass/assets/javascripts/bootstrap/';
        } else {
          bsPath += 'bootstrap/js/';
        }
      } else if (this.includeMdl) {
        mdlPath = '/bower_components/';

        if (this.includeSass) {
          mdlPath += 'material-design-lite/src/';
        } else {
          mdlPath += 'material-design-lite/material.min.js';
        }
      }

      if (this.includePug){
          if(this.includeBootstrap){
              this.fs.copyTpl(
                this.templatePath('pugFiles/index.pug'),
                this.destinationPath('app/pugFiles/index.pug'),
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
                ]
                }
            );
          } else if(this.includeMdl){
              this.fs.copyTpl(
                this.templatePath('pugFiles/index.pug'),
                this.destinationPath('app/pugFiles/index.pug'),
                {
                appname: this.appname,
                includeSass: this.includeSass,
                includeMdl: this.includeMdl,
                includeModernizr: this.includeModernizr,
                includeJQuery: this.includeJQuery,
                mdlPath: mdlPath,
                mdlPlugins: [
                    "mdlComponentHandler.js",
                    "button/button.js",
                    "checkbox/checkbox.js",
                    "icon-toggle/icon-toggle.js",
                    "menu/menu.js",
                    "progress/progress.js",
                    "radio/radio.js",
                    "slider/slider.js",
                    "spinner/spinner.js",
                    "switch/switch.js",
                    "tabs/tabs.js",
                    "textfield/textfield.js",
                    "tooltip/tooltip.js",
                    "layout/layout.js",
                    "data-table/data-table.js",
                    "ripple/ripple.js",
                    "scripts/main.js"
                ]
                }
            );
          }

      } else{
            this.fs.copyTpl(
        this.templatePath('index.html'),
        this.destinationPath('app/index.html'),
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
          ]
        }
      );
      }      
        },// fin html
        misc: function () {
            mkdirp('app/images');
            mkdirp('app/fonts');
            mkdirp('app/styles');
            }
    }, // fin writing
    install: function () {
        this.installDependencies({
        skipMessage: this.options['skip-install-message'],
        skipInstall: this.options['skip-install']
        });
    },
    end: function () {
    var bowerJson = this.fs.readJSON(this.destinationPath('bower.json'));
    var howToInstall =
      '\nAfter running ' +
      chalk.yellow.bold('npm install & bower install') +
      ', inject your' +
      '\nfront end dependencies by running ' +
      chalk.yellow.bold('gulp wiredep') +
      '.';

    if (this.options['skip-install']) {
      this.log(howToInstall);
      return;
    }

    // wire Bower packages to .html
    wiredep({
      bowerJson: bowerJson,
      directory: 'bower_components',
      exclude: ['bootstrap-sass', 'bootstrap.js','material-design-lite',],
      ignorePath: /^(\.\.\/)*\.\./,
      src: 'app/index.html'
    });

    if (this.includeSass) {
      // wire Bower packages to .scss
      wiredep({
        bowerJson: bowerJson,
        directory: 'bower_components',
        ignorePath: /^(\.\.\/)+/,
        src: 'app/styles/*.scss'
      });
    }
  }

});