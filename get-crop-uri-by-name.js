module.exports = getCropUriByName

function getCropUriByName(crops, name) {

  var uri

  crops.some(function (crop) {
    if (crop.name === name) {
      uri = crop.src
      return true
    }
  })

  return uri

}