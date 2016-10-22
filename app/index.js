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
          appname: this.appname,
          appdescription: this.appdescription,
          appversion: this.appversion,
          applicense: this.applicense,
          appauthor: this.appauthor,
          appemail: this.appemail,
          includeSass:this.includeSass,
          includeBootstrap:this.includeBootstrap,
          includeMdl:this.includeMdl,
          includeBourbon:this.includeBourbon,
          includeNeat:this.includeNeat,
          includePug:this.includePug,
          includeModernizr:this.includeModernizr,
          includeJQuery:this.includeJQuery,
          date: (new Date).toISOString().split('T')[0],
          name: this.pkg.name,
          version: this.pkg.version,
          includeBabel: this.options['babel'],
          testFramework: this.options['test-framework']
        };

    mkdirp(appDir + '/scripts');
    mkdirp(appDir + '/images');
    mkdirp(appDir + '/pugFiles');
    mkdirp(appDir + '/styles');
    mkdirp(appDir + '/fonts');


    this.fs.copy(sourceRoot + '/.editorconfig', destRoot + '/.editorconfig');
    this.fs.copy(sourceRoot + '/.babelrc', destRoot + '/.babelrc');
    this.fs.copy(sourceRoot + '/.jshintrc', destRoot + '/.jshintrc');
    this.fs.copyTpl(sourceRoot + '/CONTRINUTING.md', destRoot + '/CONTRINUTING.md', templateContext);
    this.fs.copyTpl(sourceRoot + '\\_package.json', destRoot + '/package.json', templateContext);
    this.fs.copyTpl(sourceRoot + '\\gulpfile.js', destRoot + '/gulpfile.babel.js', templateContext);
    this.fs.copyTpl(sourceRoot + '/README.md', destRoot + '/README.md', templateContext);
    this.fs.copy(sourceRoot + '/robots.txt', appDir + '/robots.txt');
    this.fs.copy(sourceRoot + '/humans.txt', appDir + '/humans.txt');
    this.fs.copy(sourceRoot + '\\app\\main.js', appDir + '/scripts/main.js');

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


    _git: function () {
      var destRoot = this.destinationRoot(),
          sourceRoot = this.sourceRoot();
      this.fs.copy(sourceRoot + '\\.gitignore', destRoot + '\\.gitignore');

      this.fs.copy(sourceRoot + '\\.gitattributes', destRoot + '\\.gitattributes');
    },
    _bower: function () {
      var destRoot = this.destinationRoot(),
          sourceRoot = this.sourceRoot();
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
      }
      if (this.includeMdl) {
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
      }
      if (this.includeBourbon) {
        if (this.includeSass) {
          bowerJson.dependencies['Bourbon'] = '~4.2.7';
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
          bowerJson.dependencies['Neat'] = '~1.8.0';
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
        bowerJson.dependencies['jquery'] = '~2.1.1';
      }

      if (this.includeModernizr) {
        bowerJson.dependencies['modernizr'] = '~2.8.1';
      }

      this.fs.writeJSON('bower.json', bowerJson);
      this.fs.copy(sourceRoot + '\\.bowerrc',destRoot + '\\.bowerrc');
    }, // fin bower,
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
      this.fs.copyTpl(sourceRoot + '\\app\\styles\\' + css, appDir + '/styles/' + css,{includeBootstrap: this.includeBootstrap, includeMdl: this.includeMdl,includeBourbon: this.includeBourbon,includeNeat: this.includeNeat});
      this.fs.copyTpl(sourceRoot + '\\app\\styles\\demo\\demo.sass', appDir + '/styles/demo/demo.sass' ,{includeMdl: this.includeMdl,includeBourbon: this.includeBourbon,includeNeat: this.includeNeat});
    }, // fin styles,

    _html: function () {

      var destRoot = this.destinationRoot(),
          sourceRoot = this.sourceRoot();
      var bsPath;
      var mdlPath;

      // path prefix for Bootstrap JS files
      if (this.includeBootstrap) {
        bsPath = 'app/bower_components/';

        if (this.includeSass) {
          bsPath += 'bootstrap-sass/assets/javascripts/bootstrap/';
        } else {
          bsPath += 'bootstrap/js/';
        }
      } else if (this.includeMdl) {
        mdlPath = 'app/bower_components/';

        if (this.includeSass) {
          mdlPath += 'mdl/src/';
        } else {
          mdlPath += 'material-design-lite/material.min.js';
        }
      }

      if (this.includePug){
          if(this.includeBootstrap){
              this.fs.copyTpl( sourceRoot + '\\app\\pugFiles\\layouts\\bslayouts.pug', destRoot + '/app/pugFiles/index.pug', { appname: this.appname, includeSass: this.includeSass, includeBootstrap: this.includeBootstrap, includeModernizr: this.includeModernizr, includeJQuery: this.includeJQuery, bsPath: bsPath, bsPlugins:['affix','alert','dropdown','tooltip','modal','transition','button','popover','carousel','scrollspy','collapse','tab']});
          } else if(this.includeMdl){ this.fs.copyTpl(sourceRoot +'\\app\\pugFiles\\layouts\\mdllayouts.pug', destRoot + '/app/pugFiles/index.pug',{appname: this.appname, includeSass: this.includeSass, includeMdl: this.includeMdl, includeModernizr: this.includeModernizr, includeJQuery: this.includeJQuery, mdlPath: mdlPath, mdlPlugins: ["mdlComponentHandler.js", "button/button.js", "checkbox/checkbox.js", "icon-toggle/icon-toggle.js", "menu/menu.js", "progress/progress.js", "radio/radio.js", "slider/slider.js", "spinner/spinner.js", "switch/switch.js", "tabs/tabs.js", "textfield/textfield.js", "tooltip/tooltip.js", "layout/layout.js", "data-table/data-table.js", "ripple/ripple.js", "scripts/main.js" ] } ); }

      } else{
            this.fs.copyTpl(sourceRoot + '\\index.html',  destRoot + '/app/index.html',{appname: this.appname,
          includeSass: this.includeSass, includeBootstrap: this.includeBootstrap, includeModernizr: this.includeModernizr, includeJQuery: this.includeJQuery, bsPath: bsPath,
          bsPlugins: [ 'affix', 'alert', 'dropdown', 'tooltip', 'modal', 'transition', 'button', 'popover', 'carousel', 'scrollspy', 'collapse', 'tab'          ]
        }
      );
      }
        },// fin html



  initializing: function () {
      var message = chalk.yellow.bold('Welcome to NSC Generator  \n ') + chalk.yellow(' The best Web Starter kit  \n Bootstrap sass mdl pug  ');
      this.log(yosay(message, { maxLength: 15 }));
      this.pkg = require('../package.json');
  },
  prompting: function () {

      var prompts = [
        {
          name: 'name',
          message: 'what is the name of the project?',
          default: this.appname
        },
        {
          name: 'description',
          message: 'How is the description of your project?'
        },
        {
          name: 'version',
          message: 'what is the version of the project?'
        },
        {
          name: 'license',
          message: 'How is your project licensed?',
          default: "MIT"
        },
        {
          name: 'author',
          message: 'what is the name of the Author?'
        },
        {
          name: 'email',
          message: 'what is email address?'
        },{
              type: 'checkbox',
              name: 'prepross',
              message: 'Would you like to include Prepross for (css, html)?',
              choices: [{
                  name: 'Sass',
                  value: 'includeSass',
                  checked: true
              },{
                  name: 'Pug',
                  value: 'includePug',
                  checked: true
              }]
          },
        {
        type: 'checkbox',
        name: 'features',
        message: 'Which additional features would you like to include?',
        choices: [ {
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
        this.includeSass = hasPrepross('includeSass');
        this.includePug = hasPrepross('includePug');
        this.includeBootstrap = hasFeature('includeBootstrap');
        this.includeMdl = hasFeature('includeMdl');
        this.includeBourbon = hasFeature('includeBourbon');
        this.includeNeat = hasFeature('includeNeat');
        this.includeModernizr = hasFeature('includeModernizr');
        this.includeJQuery = answers.includeJQuery;

      }.bind(this));
    }, // fin prompting
  configuring: function () {
    this.config.save();
  },
  writing:function () {
    this._creatProjectFileSystem();
    this._bower();
    this._git();
    this._styles();
    JSON.stringify(this._html());
  },
  install: function () {
 this.npmInstall();
     this.bowerInstall();

  }
});
