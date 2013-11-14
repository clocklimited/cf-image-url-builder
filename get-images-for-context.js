module.exports = getImagesForContext

function getImagesForContext(images, context) {

  return images.filter(function (image) {
    return image.selectedContexts.indexOf(context) !== -1
  })

}