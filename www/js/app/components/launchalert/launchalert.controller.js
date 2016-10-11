'use strict';

angular.module('lf')
.controller('LaunchAlertCtrl', function($state, $scope,$rootScope,$ionicPopup,$ionicModal,CameraService,ItemService,ImageService) {

	$scope.newAlert = {location:$rootScope.currentLocation};

	$scope.showPopup = function() {
		$ionicModal.fromTemplateUrl('js/app/templates/use_camera.html', {
			scope: $scope,
			animation: 'slide-in-up'
		}).then(function(modal) {
			$scope.modal = modal;
			$scope.modal.show();
		});
	};
	
	$scope.openModal = function(type) {
		$scope.newAlert.type = type;
		var p = new Promise(function(resolve, reject) {
			if (!$scope.formModal) {
				$ionicModal.fromTemplateUrl('createalert.html', {
					scope: $scope,
					animation: 'slide-in-up'
				}).then(function(modal) {
					$scope.formModal = modal;
					resolve();
				});
			} else {
				resolve();
			}
		});
		p.then(function() {
			$scope.formModal.show();
			if (!$scope.launchMap) {
				$scope.launchMap = L.map('map',{ tap:true }).setView([ 
					$scope.newAlert.location.latitude, 
					$scope.newAlert.location.longitude
				], 14);
				L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
					attribution: 'Lost & Found',
					maxZoom: 18
				}).addTo($scope.launchMap);

				$scope.marker = L.marker([ 
					$scope.newAlert.location.latitude, 
					$scope.newAlert.location.longitude
				]).addTo($scope.launchMap);
				$scope.launchMap.on('click', onMapClick);
				$scope.$watch('currentLocation', function() {
					$scope.newAlert.location = $rootScope.currentLocation;
					$scope.launchMap.setView([ 
						$scope.newAlert.location.latitude, 
						$scope.newAlert.location.longitude
					], 14);

					$scope.marker.setLatLng([ 
						$scope.newAlert.location.latitude, 
						$scope.newAlert.location.longitude
					]);
				});
			}
		});
	};


	function onMapClick(e) {
		$scope.launchMap.removeLayer($scope.marker);
		$scope.marker = L.marker([e.latlng.lat, e.latlng.lng]).addTo($scope.launchMap);
		$scope.newAlert.location = {
			latitude: e.latlng.lat,
			longitude: e.latlng.lng
		};
	}

	$scope.useCamera = function(){
		var options = {
		  quality: 50,
		  destinationType: navigator.camera.DestinationType.DATA_URL
		};

		CameraService.getPicture(options)
		.then(function(imageURI) {
			$scope.imageBase64 = "data:image/jpeg;base64," + imageURI;
			var img = new Image;
			img.src = $scope.imageBase64;
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
			var img = new Image;
			img.src = $scope.imageBase64;
			$scope.modal.hide();
		}, function(err) {
			alert(err);
		});
	};

	$scope.createAlert = function(){
		if($rootScope.data.currentUser){
			$rootScope.showLoading();

			var error = [];
			if ($scope.newAlert.name == undefined) {
				error.push('Alert name can\'t be empty');
			}

			if (error.length > 0) {
				var template = '<ul>';
				for (var i=0; i<error.length; i++) {
					template += '<li>' + error[i] + '</li>';
				}
				template += '</ul>';
				$rootScope.hideLoading();
				
				var alertPopup = $ionicPopup.alert({
					title: 'Error',
					template: template
				});
				return;
			}

			var images = [$scope.imageBase64];
			if(typeof $scope.imageBase64 == 'undefined'){
				$scope.imageBase64=null;
				images = null;
			}
			ItemService.createAlertItem($scope.newAlert, images)
			.then(function(itemRef) {
				var user = $rootScope.data.currentUser;
				if (!user.favorites) user.favorites = {};
				user.favorites[itemRef.key] = true;
				user.$save();
				$rootScope.hideLoading();
				$scope.newAlert = {location: $rootScope.currentLocation};
				$scope.imageBase64 = null;
				$rootScope.$emit('alert-added');
				var alertPopup = $ionicPopup.alert({
					title: 'New alert',
					template: 'New alert created successfully'
				});
				alertPopup.then(function(res) {
					$state.go('app.alerts');
					$scope.formModal.hide();
				});
			}).catch(function(error) {
				console.log(error);
			});
		} else {
			var alertPopup = $ionicPopup.alert({
				title: 'Access denied',
				template: 'Para crear una alerta necesitas iniciar sesion primero'
			});
			alertPopup.then(function(res) {});
		}
	};

	$scope.$on('$destroy', function() {
		if ($scope.modal) {
			$scope.modal.hide();
		}
		if ($scope.formModal) {
			$scope.formModal.remove();
		}
	});

});

