# cf-image-url-builder

Build URLs for your cf entity's images

**From v1.0.0 this module will be incompatible with old-style cf entities that
store contexts at `entity.crops`. Use the `pre-v1.0.0` branch or some version < 1.0.0
if your entities do that. From now on, this module assumes that context selection is annotated
on each image object itself, e.g:**

```js
{ images:
  [ { name: 'image.jpeg'
    /* other properties omitted for brevity */
    , selectedContexts: [ 'Main', 'Thumbnail' ]
    }
  ]
}
```

## Installation

```
npm install cf-image-url-builder
```

```js
var createUrlBuilder = require('cf-image-url-builder')
```

## Usage

Instantiate like so:

```js
var createImageUrlBuilder = require('cf-image-url-builder')
var urlBuilder = createImageUrlBuilder('http://dr.io', 'darkroom-key', images)
// or provide your own darkroom url builder
var urlBuilder = createImageUrlBuilder(req.darkroomUrlBuilder, images)
```

Where:
- `images` is an array of raw image widget models (e.g. on the backend `article.images.widgets`,
and on the frontend `article.get('images').widgets.map(function (widget) { return widget.toJSON() })`)

## Examples

### Article list with thumbnails

In your js view:

```js
var template = renderJade(__dirname + '/article-list.jade')
  , createImageUrlBuilder = require('cf-image-url-builder')

function render() {

  var articles = [...] // Get the articles somehow

  articles.forEach(function (article) {
    var urlBuilder = createImageUrlBuilder('http://dr.io', 'darkroom-key', images)
      , image = urlBuilder.getImage('Thumbnail')

    if (image) {
      article.thumbnail =
        { url: image.crop('Landscape').constrain(300)
        , caption: image.properties.name
        }
    }

  })

  template({ articles: articles })

}
```

In your template:
```jade
each article in articles
  .article
    img(src=article.thumnail.url, alt=article.thumbnail.caption)
    h1 #{article.shortTitle}
```

### Multi image slideshow

`@todo:` complete this stubbed out example

```js
urlBuilder.getImages('Hero').forEach(function (img) {
  img.crop('Wide').constrain().url()
})
```

## API

The full API docs follow. Unless you need to figure something tricky out, it's best
to look at the examples. The API was designed to chain well, and for that reason, it
looks a lot more complex than it needs to be in this formal view.

### var urlBuilder = createUrlBuilder(darkroomUrl, darkroomKey, imageWidgets)

Creates a URL builder instance from a cf entity. All arguments are required.

### var images = urlBuilder.getImages(String:context)

Returns an array of images for the given context. If no images exist for this context,
the array is empty.

### var image = urlBuilder.getImage(String:context)

Returns a single image for the given context. This calls `getImages()` internally and is
just a convenience function the common use case where only a single image is desired.
If there are no images for the given context, the return value is `undefined`.

### var crop = image.crop(String:name)

Get the URL for the crop named `name`. Returns a `crop` entity, detailed below.

### image.properties

A reference back to the image for accessing metadata. Useful if image captions or
alt tags are required.

### crop.url()

Generate a url for the original image.

### var constrained = crop.constrain(Number:width, Number:height)

Apply the `width` or `height` constrains to the crop. Both are optional.

### constrained.url()

Generate a url for the constrained image.

### Errors

This module is designed to be used in templates, so throwing exceptions is avoided.
Error messages are returned in place of the image URLs, if errors occur.

## Tests

Run the tests with `npm test` and generate coverage report with `npm test --coverage`.

## Credits
Built by developers at [Clock](http://clock.co.uk).

## Licence
Licensed under the [New BSD License](http://opensource.org/licenses/bsd-license.php)
