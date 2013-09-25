module.exports = getImagesForContext

function getImagesForContext(images, selectedContexts, context) {

  var imageIds = selectedContexts[context]
    , crops = []

  // Short circuit if `context` does not exist
  if (typeof imageIds === 'undefined') return []

  // Ensure `imageIds` is an array
  if (!Array.isArray(imageIds)) imageIds = [ imageIds ]

  // Look up in the `images` array for images with an `_id`
  // that exists in `imageIds` and save their `crops`
  imageIds.forEach(function (id) {
    images.some(function (image) {
      if (image._id === id) {
        crops.push(image)
        // Stop iterating because the image with `id` was found
        return true
      }
    })
  })

  return crops

}