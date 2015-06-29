var assert = require('assert')
  , createUrlBuilder = require('../image-url-builder')
  , getImagesForContext = require('../get-images-for-context')
  , getCropUriByName = require('../get-crop-uri-by-name')
  , imageWidgets = require('./fixtures/image-widgets')

/* global describe, it */

describe('getImagesForContext()', function () {

  it('should get the crops for a context with a single selection', function () {

    var images = getImagesForContext(imageWidgets, 'Thumbnail')
    assert.equal(images[0].crops._note, 'a1 crops')
    assert.equal(images.length, 1)

  })

  it('should get the crops for a context with multiple selections', function () {

    var images = getImagesForContext(imageWidgets, 'Hero')
    assert.equal(images[0].crops._note, 'a2 crops')
    assert.equal(images[1].crops._note, 'a3 crops')
    assert.equal(images.length, 2)

  })

  it('should return an empty array for contexts that don\'t exist', function () {
    var images = getImagesForContext(imageWidgets, 'nope')
    assert.deepEqual(images, [])
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
        var images = createUrlBuilder(darkroomUrl, darkroomSalt, imageWidgets)
        assert.equal(images.getImages('Thumbnail').length, 1)
        assert.equal(images.getImages('Hero').length, 2)
        assert.equal(images.getImages('nope').length, 0)
      })

      it('should return an array of objects with a crop() function and a properties property', function () {
        var images = createUrlBuilder(darkroomUrl, darkroomSalt, imageWidgets)
          , image = images.getImage('Thumbnail')
        assert.deepEqual(Object.keys(image), [ 'crop', 'properties' ])
        assert.equal(typeof image.crop, 'function')
        assert.equal(image.properties, imageWidgets[0])
      })

      describe('crop()', function () {

        it('should return an object with two functions: constrain() and url()', function () {
          var images = createUrlBuilder(darkroomUrl, darkroomSalt, imageWidgets)
            , crop = images.getImage('Thumbnail').crop('Square')
          assert.deepEqual(Object.keys(crop), [ 'constrain', 'url' ])
          assert.equal(typeof crop.constrain, 'function')
          assert.equal(typeof crop.url, 'function')
        })

        it('should still return an object even if no crop exists', function () {
          var images = createUrlBuilder(darkroomUrl, darkroomSalt, imageWidgets)
            , crop = images.getImage('Thumbnail').crop('nope')
          assert.deepEqual(Object.keys(crop), [ 'constrain', 'url' ])
          assert.equal(typeof crop.constrain, 'function')
          assert.equal(typeof crop.url, 'function')
        })

        it('should use the original un-cropped resource if no crop name is passed', function () {
          var images = createUrlBuilder(darkroomUrl, darkroomSalt, imageWidgets)
            , crop = images.getImage('Thumbnail').crop()

          assert(crop.url().indexOf('0000a1') !== -1)
        })

        describe('url()', function () {

          it('should generate a url based off of the correct resource', function () {
            var images = createUrlBuilder(darkroomUrl, darkroomSalt, imageWidgets)
              , image = images.getImage('Thumbnail')
            assert(/a1\-square/.test(image.crop('Square').url()))
            assert(/a1\-square/.test(image.crop('Square').constrain(100).url()))
            assert(/a1\-square/.test(image.crop('Square').constrain(324, 303).url()))
            assert(/a1\-square/.test(image.crop('Square').constrain(null, 800).url()))
            images.getImages('Hero').forEach(function (image, i) {
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
            var images = createUrlBuilder(darkroomUrl, darkroomSalt, imageWidgets)
              , image = images.getImage('Thumbnail')
            assert.doesNotThrow(function () {
              image.crop('nope').url()
            })
          })

          it('should return an error as a string', function () {
            var images = createUrlBuilder(darkroomUrl, darkroomSalt, imageWidgets)
              , image = images.getImage('Thumbnail')
            assert.equal(image.crop('nope').url(), 'Error: no "nope" crop available for context "Thumbnail"')
          })

          it('should include and escape the filename in the URL', function () {
            var images = createUrlBuilder(darkroomUrl, darkroomSalt, imageWidgets)
            assert(/\/a1\.jpg/.test(images.getImage('Thumbnail').crop('Square').url()))
            assert(/\/a2\.jpg/.test(images.getImages('Hero')[0].crop('Square').url()))
            assert(/\/a3\.jpg/.test(images.getImages('Hero')[1].crop('Square').url()))
          })

        })

        describe('constrain()', function () {

          it('should have an effect on the resulting url', function () {
            var images = createUrlBuilder(darkroomUrl, darkroomSalt, imageWidgets)
            assert(/\/300\//.test(images.getImage('Thumbnail').crop('Square').constrain(300).url()))
            assert(/\/300\//.test(images.getImage('Thumbnail').crop('Square').constrain(null, 300).url()))
            assert(/\/123\//.test(images.getImage('Thumbnail').crop('Square').constrain(123, 456).url()))
            assert(/\/456\//.test(images.getImage('Thumbnail').crop('Square').constrain(123, 456).url()))
          })

          it('should return an object with a single function: url()', function () {
            var images = createUrlBuilder(darkroomUrl, darkroomSalt, imageWidgets)
              , toTest =
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
        var images = createUrlBuilder(darkroomUrl, darkroomSalt, imageWidgets)
        assert.equal(images.getImage('Hero').crop('Square').url(), images.getImages('Hero')[0].crop('Square').url())
      })

    })

    describe('providing an existing url builder', function () {

      it('should use an existing urlBuilder if provided', function (done) {
        function mockUrlBuilder() {
          done()
          return {}
        }
        createUrlBuilder(mockUrlBuilder, imageWidgets).getImage('Thumbnail')
      })

      it('should throw an error if incorrect argument length is provided', function () {
        assert.throws(function () { createUrlBuilder(1, 2, 3, 4) })
      })

    })

  })

})
