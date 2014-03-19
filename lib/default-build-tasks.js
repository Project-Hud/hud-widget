var glob = require('glob')
  , path = require('path')
  , renderStylus = require('stylus-renderer')
  , stylusCompile = require('./compile-stylus')

module.exports = function (widget) {
  var tasks =
    { compileStylus: function (cb) {
        glob(path.join(widget.options.staticPath, 'stylesheets', '**/*.styl'), function (error, files) {

          renderStylus(files,
            { compile: stylusCompile
            , src: widget.options.staticPath
            , dest: widget.options.staticPath
            }
            , cb)
        })
      }
    }

  return tasks
}
