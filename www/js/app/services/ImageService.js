'use strict';

angular.module('lf.services.image', [])
.factory('ImageService', function ($firebaseObject) {
	var service = {
		createImage: function(imageBase64, callback) {
			var imgRef = firebase.database().ref('images');	
			var image = {
				"image": imageBase64
			};
			var newImgRef = imgRef.push(image);
			if (typeof callback === 'function') {
				$firebaseObject(newImgRef).$loaded()
				.then(function(image) {
					callback(image);
					return $firebaseObject(newImgRef).$loaded();;
				});
			} else {
				return $firebaseObject(newImgRef).$loaded();
			}
		}
	};

	return service;
});	

