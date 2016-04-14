angular.module('lf.services.camera', [])
.factory('CameraService', ['$q', function($q) {
  return {
      
      getPicture: function(options) {
          console.log(options);
          var q = $q.defer();

          navigator.camera.getPicture(function(result) {
            // Do any magic you need
            q.resolve(result);
          }, function(err) {
            q.reject(err);
          }, options);

        return q.promise;
      },

      resizePicture: function(img, width, height){
          // create an off-screen canvas
          var canvas = document.createElement('canvas'),
              ctx = canvas.getContext('2d');

          // set its dimension to target size
          canvas.width = width;
          canvas.height = height;

          // draw source image into the off-screen canvas:
          ctx.drawImage(img, 0, 0, width, height);

          // encode image to data-uri with base64 version of compressed image
          return canvas.toDataURL('image/jpeg', 0.8);
      }

  }
}]);