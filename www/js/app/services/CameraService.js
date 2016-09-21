'use strict';

angular.module('lf.services.camera', [])
.service('CameraService', function() {
	this.getPicture = function(options) {
		var promise = new Promise(function(resolve, reject) {
			navigator.camera.getPicture(function(result) {
				// Do any magic you need
				resolve(result);
			}, function(err) {
				reject(err);
			}, options);
		});
		return promise;
	};

	this.resizePicture = function(img, width, height){
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
	};
});

