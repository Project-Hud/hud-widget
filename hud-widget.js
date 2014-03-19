var express = require('express')
  , http = require('http')
  , path = require('path')
  , extend = require('lodash.assign')
  , uberCacheExpress = require('uber-cache-express')

module.exports = Widget

function Widget(options) {

  var app = express()
    , defaultOptions =
      { port: process.env.PORT || 3000
      , viewPath: process.cwd() + '/views'
      , viewEngine: 'jade'
      , favicon: express.favicon()
      , staticPath: process.cwd() + '/public'
      , logger: express.logger('dev')
      , autoStart: true
      }

  options = extend({}, defaultOptions, options)

  this._cache = uberCacheExpress(options.cacheOptions)

  app.set('port', options.port)
  app.set('views', options.viewPath)
  app.set('view engine', options.viewEngine)

  if (options.favicon) app.use(options.favicon)

  app.use(options.logger)
  app.use(express.json())
  app.use(express.urlencoded())
  app.use(express.methodOverride())
  app.use(app.router)
  app.use(express.static(path.normalize('public')))

  // development only
  if ('development' === app.get('env')) {
    app.use(express.errorHandler())
  }

  this._app = app

  if (options.autoStart) {
    process.nextTick(function () {
      this.start()
    }.bind(this))
  }
}

Widget.prototype.start = function (cb) {
  http.createServer(this._app).listen(this._app.get('port'), function() {
    console.log('Hud Widget server listening on port ' + this._app.get('port'))

    if (cb) cb()
  }.bind(this))
}

Object.defineProperty(Widget.prototype, 'app',
  { get: function() {
      return this._app
    }
  })

Object.defineProperty(Widget.prototype, 'cache',
  { get: function() {
      return this._cache
    }
  })

Object.defineProperty(Widget.prototype, 'get',
  { get: function() {
      return this._app.get.bind(this._app)
    }
  })
