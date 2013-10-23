# cf-image-url-builder

Build URLs for your cf entity's images

## Installation

```
npm install cf-image-url-builder
```

## Usage

Instantiate like so:

```js
var createImageUrlBuilder = require('cf-image-url-builder')
var images = createImageUrlBuilder('http://dr.io', 'salty', images, contexts)
```

Where:
- `images` is an array of raw image widget models (e.g. on the backend `article.images.widgets`,
and on the frontend `article.get('images').widgets.map(function (widget) { return widget.toJSON() })`)
- `contexts` is an object that represents which image widget model is chosen for each context (e.g. on
the backend this is `article.crops` and on the frontend `article.get('crops')`)


```js
images.getImages('Hero').forEach(function (img) {
  img.crop('Wide').constrain().url()
})

images.getImage('Thumbnail').crop('Square').constrain(300, 200).url()
```

## API

TODO

## Tests

Run the tests with `npm test` and generate coverage report with `npm test --coverage`.

## Credits
Built by developers at [Clock](http://clock.co.uk).

## Licence
Licensed under the [New BSD License](http://opensource.org/licenses/bsd-license.php)
