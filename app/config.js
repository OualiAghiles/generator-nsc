module.exports = {
  options: {
    'skip-welcome-message': {
      desc: 'Skips the welcome message',
      type: Boolean
    },
    'skip-install-message': {
      desc: 'Skips the message after the installation of dependencies',
      type: Boolean
    },
    'test-framework': {
      desc: 'Test framework to be invoked',
      type: String,
      defaults: 'mocha'
    }
  },
  prompts: [
    {
      type: 'checkbox',
      name: 'features',
      message: 'Which additional features would you like to include?',
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
          name: 'Bootstrap',
          value: 'includeBootstrap',
          checked: false
        },
        {
          name: 'Modernizr',
          value: 'includeModernizr',
          checked: true
        },
        {
          name: 'Bulma',
          value: 'includeBulma',
          checked: true
        },
        {
          name: 'Google Analytics',
          value: 'includeAnalytics',
          checked: true
        }
      ]
    },
    {
      type: 'confirm',
      name: 'includeJQuery',
      message: 'Would you like to include jQuery?',
      default: true,
      when: answers => !answers.features.includes('includeBootstrap')
    }
  ],
  dirsToCreate: ['app/images', 'app/fonts'],
  filesToCopy: [
    {
      input: 'babelrc',
      output: '.babelrc'
    },
    {
      input: 'gitignore',
      output: '.gitignore'
    },
    {
      input: 'gitattributes',
      output: '.gitattributes'
    },
    {
      input: 'editorconfig',
      output: '.editorconfig'
    },
    {
      input: 'webpack.config.js',
      output: 'webpack.config.js'
    },
    {
      input: 'config.js',
      output: 'config.js'
    },
    {
      input: 'favicon.ico',
      output: 'app/favicon.ico'
    },
    {
      input: 'apple-touch-icon.png',
      output: 'app/apple-touch-icon.png'
    },
    {
      input: 'robots.txt',
      output: 'app/robots.txt'
    }
  ],
  filesToRender: [
    {
      input: 'gulpfile.babel.js',
      output: 'gulpfile.babel.js'
    },
    {
      input: '_package.json',
      output: 'package.json'
    },
    {
      input: 'source/javascript',
      output: 'app/scripts/'
    },
    {
      input: 'source/html/',
      output: 'app/'
    }
  ]
};
