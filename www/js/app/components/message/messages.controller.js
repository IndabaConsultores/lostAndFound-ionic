'use strict';

angular.module('lf')
.controller('MessageCtrl', function($rootScope, $scope, $stateParams, $ionicModal, $ionicScrollDelegate, MessageService, ItemService, UserService, CameraService) {

	var item = ItemService.getAlertItem($stateParams.item);
	var type = 'alert';
	if (!item) {
		item = ItemService.getOfficeItem($stateParams.item);
		type = 'office';
	}

	$scope.msg = {picture:{}};

	$scope.sendMessage = function() {
		if ($scope.msg) {
			ItemService.addMessage(item, $scope.msg).then(function(msgKey) {
				$scope.msg = {picture:{}};
			});
		}
	};

	$scope.getUser = function(message) {
		return UserService.getUser(message.user);
	};

	$rootScope.showLoading();
	var itemId = type + '/' + item.$id;
	MessageService.getMessagesByCompositeItemId(itemId)
	.then(function(messages) {
		$ionicScrollDelegate.scrollBottom();
		$scope.messages = messages;
		$scope.messages.$watch(function(event) {
			$ionicScrollDelegate.scrollBottom();
		});
		$rootScope.hideLoading();
	});

	$scope.showPopup = function() {
		$ionicModal.fromTemplateUrl('js/app/templates/use_camera.html', {
			scope: $scope,
			animation: 'slide-in-up'
		}).then(function(modal) {
			$scope.modal = modal;
			$scope.modal.show();
		});
	};

	$scope.showPicture = function(message){
		var modalScope = $scope.$new();
		modalScope.image = {
			title: message.body,
			image: message.picture.image
		};
		$ionicModal.fromTemplateUrl('js/app/templates/image_modal.html', {
			scope: modalScope,
			animation: 'slide-in-up'
		}).then(function(modal) {
			$scope.modal = modal;
			$scope.modal.show();
		});
	};

	$scope.closeModal = function() {
		$scope.modal.hide();
	};


	function resizeImage() {
		$scope.msg.picture.thumbnail = CameraService.resizePicture(this, 64, 64);
		$ionicScrollDelegate.scrollBottom(true);
	};

	$scope.useCamera = function(){
		var options = {
			quality: 50,
			destinationType: navigator.camera.DestinationType.DATA_URL 
		};
		CameraService.getPicture(options)
		.then(function(imageURI) {
			$scope.msg.picture.image= "data:image/jpeg;base64," + imageURI;
			var img = new Image;
			img.onload = resizeImage;
			img.src = $scope.msg.picture.image;
			$scope.modal.hide();
		}, function(err) {
			alert(err);
		});
	};

	$scope.usePicture = function(){
		var options = {
			quality: 50,
			destinationType: navigator.camera.DestinationType.DATA_URL,
			sourceType: navigator.camera.PictureSourceType.PHOTOLIBRARY
		};

		CameraService.getPicture(options)
		.then(function(imageURI) {
			$scope.msg.picture.image= "data:image/jpeg;base64," + imageURI;
			var img = new Image;
			img.onload = resizeImage;
			img.src = $scope.msg.picture.image;
			$scope.modal.hide();
		}, function(err) {
			alert(err);
		});
	};

});

