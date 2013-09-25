var assert = require('assert')
  , createUrlBuilder = require('../image-url-builder')
  , getCropsForContext = require('../get-crops-for-context')
  , getCropUriByName = require('../get-crop-uri-by-name')
  , imageWidgets = require('./fixtures/image-widgets')
  , mixedContexts = require('./fixtures/mixed-contexts')

/* global describe, it */

describe('getCropsForContext()', function () {

  it('should get the crops for a context with a single selection', function () {

    var crops = getCropsForContext(imageWidgets, mixedContexts, 'Thumbnail')
    assert.equal(crops[0]._note, 'a1 crops')
    assert.equal(crops.length, 1)

  })

  it('should get the crops for a context with multiple selections', function () {

    var crops = getCropsForContext(imageWidgets, mixedContexts, 'hero')
    assert.equal(crops[0]._note, 'a2 crops')
    assert.equal(crops[1]._note, 'a3 crops')
    assert.equal(crops.length, 2)

  })

  it('should return an empty array for contexts that don\'t exist', function () {
    var crops = getCropsForContext(imageWidgets, mixedContexts, 'nope')
    assert.deepEqual(crops, [])
  })

})

describe('getCropUriByName()', function () {

  it('should return the crop uri for a single image\'s crops matching the given name', function () {
    var uri = getCropUriByName(imageWidgets[0].crops, 'Square')
    assert.equal(uri, 'a1-square')
  })

  it('should return undefined if there is not a crop available with the given name', function () {
    var uri = getCropUriByName(imageWidgets[0].crops, 'nope')
    assert.equal(uri, undefined)
  })

})

describe('image url builder', function () {

  var darkroomUrl = 'http://darkroom.io'
    , darkroomSalt = 'salty'

  describe('createUrlBuilder()', function () {

    it('should return an object that has getImage() and getImages() functions', function () {
      var images = createUrlBuilder(darkroomUrl, darkroomSalt)
      assert.equal(typeof images.getImage, 'function')
      assert.equal(typeof images.getImages, 'function')
    })

    describe('getImages()', function () {

      it('should return the correct number of images for the given context', function () {
        var images = createUrlBuilder(darkroomUrl, darkroomSalt, imageWidgets, mixedContexts)
        assert.equal(images.getImages('Thumbnail').length, 1)
        assert.equal(images.getImages('hero').length, 2)
        assert.equal(images.getImages('nope').length, 0)
      })

      it('should return an array of objects with a single function: crop()', function () {
        var images = createUrlBuilder(darkroomUrl, darkroomSalt, imageWidgets, mixedContexts)
          , image = images.getImage('Thumbnail')
        assert.deepEqual(Object.keys(image), [ 'crop' ])
        assert.equal(typeof image.crop, 'function')
      })

      describe('crop()', function () {

        it('should return an object with two functions: constrain() and url()', function () {
          var images = createUrlBuilder(darkroomUrl, darkroomSalt, imageWidgets, mixedContexts)
            , crop = images.getImage('Thumbnail').crop('Square')
          assert.deepEqual(Object.keys(crop), [ 'constrain', 'url' ])
          assert.equal(typeof crop.constrain, 'function')
          assert.equal(typeof crop.url, 'function')
        })

        it('should still return an object even if no crop exists', function () {
          var images = createUrlBuilder(darkroomUrl, darkroomSalt, imageWidgets, mixedContexts)
            , crop = images.getImage('Thumbnail').crop('nope')
          assert.deepEqual(Object.keys(crop), [ 'constrain', 'url' ])
          assert.equal(typeof crop.constrain, 'function')
          assert.equal(typeof crop.url, 'function')
        })

        describe('url() (unconstrained)', function () {

          it('should generate a url based off of the correct resource', function () {
            var images = createUrlBuilder(darkroomUrl, darkroomSalt, imageWidgets, mixedContexts)
              , image = images.getImage('Thumbnail')
            assert(/a1\-square/.test(image.crop('Square').url()))
            assert(/a1\-square/.test(image.crop('Square').constrain(100).url()))
            assert(/a1\-square/.test(image.crop('Square').constrain(324, 303).url()))
            assert(/a1\-square/.test(image.crop('Square').constrain(null, 800).url()))
            images.getImages('hero').forEach(function (image, i) {
              if (i > 1) throw new Error('only expected 2 images')
              if (i === 0) {
                assert(/a2\-square/.test(image.crop('Square').url()))
                assert(/a2\-square/.test(image.crop('Square').constrain(100).url()))
                assert(/a2\-square/.test(image.crop('Square').constrain(324, 303).url()))
                assert(/a2\-square/.test(image.crop('Square').constrain(null, 800).url()))
              }
              if (i === 1) {
                assert(/a3\-square/.test(image.crop('Square').url()))
                assert(/a3\-square/.test(image.crop('Square').constrain(100).url()))
                assert(/a3\-square/.test(image.crop('Square').constrain(324, 303).url()))
                assert(/a3\-square/.test(image.crop('Square').constrain(null, 800).url()))
              }
            })
          })

          it('should not throw errors', function () {
            var images = createUrlBuilder(darkroomUrl, darkroomSalt, imageWidgets, mixedContexts)
              , image = images.getImage('Thumbnail')
            assert.doesNotThrow(function () {
              image.crop('nope').url()
            })
          })

          it('should return an error as a string', function () {
            var images = createUrlBuilder(darkroomUrl, darkroomSalt, imageWidgets, mixedContexts)
              , image = images.getImage('Thumbnail')
            assert.equal(image.crop('nope').url(), 'Error: no "nope" crop available for context "Thumbnail"')
          })

          it('should include the filename in the URL')

        })

        describe('constrain()', function () {

          it('should have an effect on the resulting url', function () {
            var images = createUrlBuilder(darkroomUrl, darkroomSalt, imageWidgets, mixedContexts)
            assert(/\/300\//.test(images.getImage('Thumbnail').crop('Square').constrain(300).url()))
            assert(/\/300\//.test(images.getImage('Thumbnail').crop('Square').constrain(null, 300).url()))
            assert(/\/123\//.test(images.getImage('Thumbnail').crop('Square').constrain(123, 456).url()))
            assert(/\/456\//.test(images.getImage('Thumbnail').crop('Square').constrain(123, 456).url()))
          })

          it('should return an object with a single function: url()', function () {
            var images = createUrlBuilder(darkroomUrl, darkroomSalt, imageWidgets, mixedContexts)

            var toTest =
              [ images.getImage('Thumbnail').crop('Square').constrain()
              , images.getImage('Thumbnail').crop('Square').constrain(100)
              , images.getImage('Thumbnail').crop('Square').constrain(null, 100)
              , images.getImage('Thumbnail').crop('Square').constrain(100, 100)
              , images.getImage('Thumbnail').crop('nope').constrain(100)
              ]

            toTest.forEach(function (obj) {
              assert.deepEqual(Object.keys(obj), [ 'url' ])
              assert.equal(typeof obj.url, 'function')
            })

          })

        })

      })

    })

    describe('getImage()', function () {

      it('should return the first result from getImages()', function () {
        var images = createUrlBuilder(darkroomUrl, darkroomSalt, imageWidgets, mixedContexts)
        assert.equal(images.getImage('hero').crop('Square').url(), images.getImages('hero')[0].crop('Square').url())
      })

    })

  })

})