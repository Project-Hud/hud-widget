var glob = require('glob')
  , path = require('path')
  , fs = require('fs')
  , renderStylus = require('stylus-renderer')
  , stylusCompile = require('./compile-stylus')

module.exports = function (widget) {
  var tasks =
    { compileStylus: function (cb) {
        glob(path.join(widget.options.staticPath, 'stylesheets', '**/*.styl'), function (error, files) {
          if (error) return cb(error)

          compile(files, function () {
              if ('development' === widget.get('env')) {
                // Watch for files changing and recompile
                files.forEach(function (file) {
                  watchFile(file, function (file) {
                    compile(file, function () { console.log(path.basename(file) + ' Recompiled')})
                  })
                })
              }

              cb()
            })
        })
      }
    }

  return tasks

  function compile(files, cb) {
    if (Object.prototype.toString.call(files) !== '[object Array]') files = [ files ]

    renderStylus(files,
      { compile: stylusCompile
      , src: widget.options.staticPath
      , dest: widget.options.staticPath
      }, cb)
  }

  function watchFile(filePath, cb) {
    var lastChanged = 0

    fs.watch(filePath,  { persistent: false }, function (event) {
      if ((event === 'rename') || (lastChanged > Date.now() - 2000)) return

      lastChanged = Date.now()

      cb(filePath)
    })
  }
}
