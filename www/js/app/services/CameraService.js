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
    }
  }
}]);