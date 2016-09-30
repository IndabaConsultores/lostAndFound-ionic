'use strict';

angular.module('lf')
.controller('LaunchAlertCtrl', function($state, $scope,$rootScope,$ionicPopup,$ionicModal,CameraService,ItemService,ImageService) {

	$scope.newAlert = {location:$rootScope.currentLocation};

	function imageToDataUri(img, width, height) {
		//CameraService
	}

	$scope.showPopup = function() {
		$ionicModal.fromTemplateUrl('js/app/templates/use_camera.html', {
			scope: $scope,
			animation: 'slide-in-up'
		}).then(function(modal) {
			$scope.modal = modal;
			$scope.modal.show();
		});
	};

	$scope.initMap = function(){
		$scope.map = L.map('map',{ tap:true }).setView([ 
			$scope.newAlert.location.latitude, 
			$scope.newAlert.location.longitude
		], 14);

		L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
			attribution: 'Lost & Found',
			maxZoom: 18
		}).addTo($scope.map);

		$scope.marker = L.marker([ 
			$scope.newAlert.location.latitude, 
			$scope.newAlert.location.longitude
		]).addTo($scope.map);
		$scope.map.on('click', $scope.onMapClick);
	};

	$scope.$watch('currentLocation', function() {
		$scope.newAlert.location = $rootScope.currentLocation;
		$scope.map.setView([ 
			$scope.newAlert.location.latitude, 
			$scope.newAlert.location.longitude
		], 14);

		$scope.marker.setLatLng([ 
			$scope.newAlert.location.latitude, 
			$scope.newAlert.location.longitude
		]);
	});

	$scope.onMapClick = function(e) {
		$scope.map.removeLayer($scope.marker);
		$scope.marker = L.marker([e.latlng.lat, e.latlng.lng]).addTo($scope.map);
		$scope.newAlert.location = {
			latitude: e.latlng.lat,
			longitude: e.latlng.lng
		};
	};

	$scope.mapCreated = function(map) {
		$scope.map = map;
	};

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
	});

	$scope.initMap();

});

