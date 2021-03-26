module.exports = createUrlBuilder

var createDarkroomUrlBuilder = require('darkroom-url-builder')
  , getImagesForContext = require('./get-images-for-context')
  , getCropUriByName = require('./get-crop-uri-by-name')

function createUrlBuilder() {

  var darkroomUrlBuilder
    , images

  if (arguments.length === 3) {
    darkroomUrlBuilder = createDarkroomUrlBuilder(arguments[0], arguments[1])
    images = arguments[2]
  } else if (arguments.length === 2) {
    darkroomUrlBuilder = arguments[0]
    images = arguments[1]
  } else {
    throw new Error('createUrlBuilder() called with invalid arguments length')
  }

  /*
   * Build image url builder objects for all images available with the given `context`
   */
  function getImages(context) {

    // Map each image that is found for the given context
    // onto an object with which to build URLs
    return getImagesForContext(images, context).map(function (image) {

      // Instantiate a darkroom URL builder
      var builder = darkroomUrlBuilder()
      var methods = { constrain: constrain, url: url, mode: mode }
      var error
      /*
       * Get the crop by the given `name`
       */
      function crop(name) {

        var uri

        if (name) {
          uri = getCropUriByName(image.crops, name)
        } else {
          // if no crop was passed, use the original resource
          uri = image.binaryUri
        }

        if (uri) {
          builder.resource(uri)
          builder.filename(image.name)
        } else {
          // Only error on .url() to avoid a single missing image stop
          // a template from rendering
          error = 'Error: no "' + name + '" crop available for context "' + context + '"'
        }

        return methods
      }

      /*
       * Add `height`/`width` contraints to the image
       */
      function constrain(width, height) {
        if (width) builder.width(width)
        if (height) builder.height(height)
        return methods
      }

      /*
       * Set the resize mode
       */
      function mode(modeType) {
        if (modeType) builder.mode(modeType)
        return methods
      }

      /*
       * Get the URL builder to build the URL
       */
      function url() {
        if (error) return error
        return builder.url()
      }

      // Expose just the crop function on each URL builder object
      return { crop: crop, properties: image }

    })

  }

  /*
   * Get a url builder for a single image. This is convenience function
   * that simply returns the first object from `getImages()`
   */
  function getImage(context) {
    return getImages(context)[0]
  }

  // Expose getImage[s]() functions to the caller
  return (
    { getImage: getImage
    , getImages: getImages
    })

}
