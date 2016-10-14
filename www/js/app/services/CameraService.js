'use strict';

angular.module('lf.services.camera', [])
.service('CameraService', function() {
	this.getPicture = function(options) {
		var promise = new Promise(function(resolve, reject) {
			navigator.camera.getPicture(function(imageURI) {
				var img = new Image();
				img.src = 'data:image/jpeg;base64,' + imageURI; 
				var canvas = document.createElement('canvas');
				if (img.naturalWidth > img.naturalHeight) {
					canvas.width = 320;
					canvas.height = 320 * img.naturalHeight/img.naturalWidth;
				} else {
					canvas.width = 320 * img.naturalWidth/img.naturalHeight;
					canvas.height = 320;
				}
				var ctx = canvas.getContext('2d');
				var scaleFactor = canvas.width/img.naturalWidth;
				ctx.scale(scaleFactor, scaleFactor);
				ctx.drawImage(img, 0, 0);
				var res = canvas.toDataURL('image/jpeg', 0.8);
				resolve(res.split('data:image/jpeg;base64,')[1]);
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

