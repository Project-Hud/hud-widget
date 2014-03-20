var express = require('express')
  , http = require('http')
  , path = require('path')
  , extend = require('lodash.assign')
  , uberCacheExpress = require('uber-cache-express')
  , async = require('async')
  , events = require('events')
  , util = require('util')
  , defaultBuildTasks = require('./lib/default-build-tasks')
  , buildStaticMap = require('./lib/build-static-map')

module.exports = Widget

function Widget(options) {

  var app = express()
    , defaultOptions =
      { port: process.env.PORT || 3000
      , viewPath: path.join(process.cwd(), 'views')
      , viewEngine: 'jade'
      , favicon: express.favicon()
      , staticPath: path.join(process.cwd(), 'public')
      , logger: express.logger('dev')
      , autoStart: true
      , buildTasks: defaultBuildTasks
      }

  this.options = options = extend({}, defaultOptions, options)
  this._cache = uberCacheExpress(options.cacheOptions)
  this._app = app

  events.EventEmitter.call(this)

  var tasks = []
    , buildTasks = options.buildTasks(this)

  Object.keys(buildTasks).forEach(function (task) {
    if (task) tasks.push(buildTasks[task])
  })

  async.parallel(tasks, function () {

    buildStaticMap(this, function () {

      this.emit('buildComplete')

      app.set('port', options.port)
      app.set('views', options.viewPath)
      app.set('view engine', options.viewEngine)

      if (options.favicon) app.use(options.favicon)

      app.use(options.logger)
      app.use(express.json())
      app.use(express.urlencoded())
      app.use(express.methodOverride())
      app.use(app.router)
      app.use(express.static(options.staticPath, { maxAge: 2592000000 }))

      // development only
      if ('development' === app.get('env')) {
        app.use(express.errorHandler())
      }

      if (options.autoStart) {
        process.nextTick(function () {
          this.start()
        }.bind(this))
      }
    }.bind(this))
  }.bind(this))

}

util.inherits(Widget, events.EventEmitter)

Widget.prototype.start = function (cb) {
  this.server = http.createServer(this._app)

  this.server.listen(this._app.get('port'), function() {
    console.log('Hud Widget server listening on port ' + this._app.get('port'))

    this.emit('started')

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
