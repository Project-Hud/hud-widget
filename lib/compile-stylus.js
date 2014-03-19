var stylus = require('stylus')
  , autoprefixer = require('autoprefixer-stylus')

module.exports = function (str, path) {
  return stylus(str)
    .use(autoprefixer())
    .set('filename', path)
    .set('warn', false)
    .set('compress', true)
}
