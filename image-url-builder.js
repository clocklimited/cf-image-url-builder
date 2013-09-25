module.exports = createUrlBuilder

var createDarkroomUrlBuilder = require('darkroom-url-builder')
  , getImagesForContext = require('./get-images-for-context')
  , getCropUriByName = require('./get-crop-uri-by-name')

function createUrlBuilder(darkroomUrl, darkroomSalt, images, selectedContexts) {

  var darkroomUrlBuilder = createDarkroomUrlBuilder(darkroomUrl, darkroomSalt)

  /*
   * Build image url builder objects for all images available with the given `context`
   */
  function getImages(context) {

    // Map each image that is found for the given context
    // onto an object with which to build URLs
    return getImagesForContext(images, selectedContexts, context).map(function (image) {

      // Instantiate a darkroom URL builder
      var builder = darkroomUrlBuilder()

      /*
       * Get the crop by the given `name`
       */
      function crop(name) {

        function error() {
          return 'Error: no "' + name + '" crop available for context "' + context + '"'
        }

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
          return { constrain: constrain, url: url }
        } else {
          // Slightly weird composition here, but this keeps the interface nice while
          // deferrring error presentation until .url() function is called (thrown errors
          // are not desirable as this is designed for use within a template).
          return { constrain: function () { return { url: error } }, url: error }
        }

      }

      /*
       * Add `height`/`width` contraints to the image
       */
      function constrain(width, height) {
        if (width) builder.width(width)
        if (height) builder.height(height)
        return { url: url }
      }

      /*
       * Get the URL builder to build the URL
       */
      function url() {
        return builder.url()
      }

      // Expose just the crop function on each URL builder object
      return { crop: crop }

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