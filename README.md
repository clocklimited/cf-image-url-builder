# cf-image-url-builder

Build URLs for your cf entity's images

## Installation

      npm install cf-image-url-builder

## Usage

```
var createImageUrlBuilder = require('cf-image-url-builder')
var images = createImageUrlBuilder('http://dr.io', 'salty', [], {})

images.getImages('Thumbnail').forEach(function (img) {
  img.crop('Square').constrain().url()
})

images.getImage('Thumbnail').crop('Square').constrain(width, height).url()
```

## Credits
Built by developers at [Clock](http://clock.co.uk).

## Licence
Licensed under the [New BSD License](http://opensource.org/licenses/bsd-license.php)
