# hud-widget
This is an abstraction of express to allow quick prototyping of widgets.

## Usage
```js
var Widget = new require('hud-widget')
  , widget = new Widget()

widget.get('/', function (req, res) {
  res.render('index', { title: 'Calendar' })
})
```

## Properties
- `app` Exposes express

## Methods
- `get` Exposes express get
- `start` Starts the server
- `cache(ttl)` Caches the route output, used as a middleware

## Options
- `port` (`Integer`): Port to run the service on. Defaults to the PORT env if set `3000`
- `viewPath` (`String`): Path to views (`views`)
- `viewEngine` (`String`): template engine (`jade`)
- `favicon` (`Function`): Middileware which handles the favicon, set to null if no favicon is wanted (`express.favicon()`)
- `staticPath` (`String`): Path to static content to serve (`public`)
- `logger` (`Function`): Logger middleware (`express.logger('dev')`)
- `autoStart` (`Boolean`): Automatically start the server on the next tick. If false, use widget.start() (`true`)
