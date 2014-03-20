var versionator = require('versionator')
  , fs = require('fs')
  , path = require('path')

module.exports = function (widget, cb) {
  versionator.createMapFromPath(widget.options.staticPath, function (error, staticFileMap) {
    var prefixMap = {}
      , mapLocation = path.join(widget.options.staticPath, '..', 'static-file-map.json')

    for(var key in staticFileMap) {
      prefixMap[key] = staticFileMap[key]
    }

    fs.writeFileSync(mapLocation, JSON.stringify(prefixMap, null, true))

    var mappedVersion = versionator.createMapped(require(mapLocation))

    widget.app.use(mappedVersion.middleware)
    widget.app.locals.versionPath = mappedVersion.versionPath

    cb()
  })
}
