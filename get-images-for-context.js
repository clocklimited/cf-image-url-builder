module.exports = getImagesForContext

function getImagesForContext(images, context) {
  return (
    (images &&
      images.filter &&
      images.filter(function (image) {
        return (
          image &&
          image.selectedContexts &&
          image.selectedContexts.includes(context)
        )
      })) ||
    []
  )
}
