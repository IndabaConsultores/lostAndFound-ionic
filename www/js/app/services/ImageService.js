'use strict';

angular.module('lf.services.image', [])
.service('ImageService', function ($firebaseArray, constants) {

	var _ref;
	var _images;

	this.loaded = function() {
		_ref = firebase.database().ref('images');
		_images = $firebaseArray(_ref);
		return _images.$loaded();
	};

	this.getImage = function(imageId) {
		var imageOrig = _images.$getRecord(imageId);
		return JSON.parse(JSON.stringify(imageOrig));
	};

	this.createImage = function(image) {
		image.createDate = firebase.database.ServerValue.TIMESTAMP;
		image.office = constants.OFFICE_ID;

		return _images.$add(image);
	};
	
	this.updateImage = function(image) {
		return _images.$save(image);
	};

	this.removeImages = function(imagesArray) {
		for (var i=0; i<imagesArray.length; i++) {
			var key = imagesArray[i].$id;
			var index = _images.$indexFor(key);
			_images.$remove(index);
		}
	};

});	

