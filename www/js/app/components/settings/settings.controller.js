'use strict';

angular.module('lf')
.controller('SettingsCtrl', function($scope, $rootScope, $ionicHistory, $ionicPush, $ionicModal, $ionicPopup, $translate, $timeout, amMoment, CameraService){

	//TODO cargar el lenguaje adecuado. Esperar a que el usuario este logueado

	$scope.saveSettings = function(){
		$rootScope.showLoading();
		$ionicHistory.clearCache();
		window.localStorage.setItem('settings.alerts', $rootScope.settings.alerts);
		if ($rootScope.data.currentUser) {
			if ($rootScope.data.currentUser.username.length < 1) {
				$rootScope.hideLoading();
				var alertPopup = $ionicPopup.alert({
					title: 'Error',
					template: 'Username can\'t be empty'
				});
				return;
			}
			$rootScope.data.currentUser.language = $rootScope.settings.language;
			if($scope.imageBase64){
				$rootScope.data.currentUser.avatar = $scope.imageBase64;
			}

			$rootScope.data.currentUser.$save().then(function(ref){
				$translate.use($rootScope.settings.language);
				amMoment.changeLocale($rootScope.settings.language);
				$rootScope.hideLoading();
			}, function(error){
				$rootScope.hideLoading();
				console.log("Oh crap", error);
			});
		} else {
			window.localStorage.setItem('settings.language', $rootScope.settings.language);
			$translate.use($rootScope.settings.language);
			amMoment.changeLocale($rootScope.settings.language);
			$rootScope.hideLoading();
		}

		if ($rootScope.settings.alerts === true) {
			if (window.localStorage.getItem('pushToken') == null) {
				$ionicPush.register().then(function(t) {
					return $ionicPush.saveToken(t);
				}).then(function(t) {
					window.localStorage.setItem('pushToken', t);
					//save token to Firebase?
				});
			}
		} else {
			var token = window.localStorage.removeItem('pushToken');
			$ionicPush.unregister();
		}
		
		$scope.showMessage = true;
		$timeout(function() {
			$scope.showMessage = false;
		}, 2000);
	};

	$scope.showPopup = function() {
		$ionicModal.fromTemplateUrl('js/app/templates/use_camera.html', {
			scope: $scope,
			animation: 'slide-in-up'
		}).then(function(modal) {
			$scope.modal = modal;
			$scope.modal.show();
		});
	};

	$scope.useCamera = function(){
		var options = {
			quality: 50,
			destinationType: navigator.camera.DestinationType.DATA_URL 
		};

		CameraService.getPicture(options)
		.then(function(imageURI) {
			$scope.imageBase64 = "data:image/jpeg;base64," + imageURI;
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
			$scope.imageBase64 = "data:image/jpeg;base64," + imageURI;
			$scope.modal.hide();
		}, function(err) {
			alert(err);
		});
	};

	$scope.$on('$destroy', function() {
		console.log('reset');
		$rootScope.settings.alerts = window.localStorage.getItem('settings.alerts') == 'true';
		if ($rootScope.currentUser) {
			$rootScope.settings.language = $rootScope.currentUser.language;
		} else {
			$rootScope.settings.language = window.localStorage.getItem('settings.language');
		}
		if ($scope.modal) {
			$scope.modal.remove();
		}
	});
	
});

