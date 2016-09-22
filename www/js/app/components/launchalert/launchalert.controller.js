'use strict';

angular.module('lf')
.controller('LaunchAlertCtrl', function($state, $scope,$rootScope,$ionicPopup,$ionicModal,CameraService,ItemService,ImageService) {

	$scope.newAlert = {location:{ latitude:0, longitude:0}};

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

	$scope.onMapClick = function(e) {
		//alert("You clicked the map at " + e.latlng);
		$scope.map.removeLayer($scope.marker);
		$scope.marker = L.marker([e.latlng.lat, e.latlng.lng]).addTo($scope.map);
		$scope.coords = e.latlng;
	};

	$scope.mapCreated = function(map) {
		$scope.map = map;
	};

	//$scope.coords = {'lat':$rootScope.office.get('location')._latitude, 'lng': $rootScope.office.get('location')._longitude };
	//$scope.initMap();


	navigator.geolocation.getCurrentPosition(function(success){
		/*
			En caso de que podamos acceder la ubicacion del dispositivo
			colocamos el marker en su lugar
		*/
		$scope.newAlert.location = {
			'latitude':success.coords.latitude, 
			'longitude': success.coords.longitude 
		};
		$scope.initMap();
	},function(error){
		// TODO no funciona, ya que office no tiene location
		// $scope.coords = {'lat':$rootScope.office.location.latitude, 'lng': $rootScope.office.location.longitude };
		$scope.newAlert.location = {'latitude': 0, 'longitude': 0 };
		console.log(error);
		$scope.initMap();
	},{timeout:10000});


	function resizeImage() {
		//$scope.imageThumb = CameraService.resizeImage(this, 64, 64);
	}

	$scope.useCamera = function(){
		/*
			Usar camara para sacar foto
		*/
		var options = {
		  quality: 50,
		  destinationType: navigator.camera.DestinationType.DATA_URL
		};

		CameraService.getPicture(options)
		.then(function(imageURI) {
			$scope.imageBase64 = "data:image/jpeg;base64," + imageURI;
			var img = new Image;
				img.onload = resizeImage;
				img.src = $scope.imageBase64;
			
			$scope.modal.hide();
		}, function(err) {
			alert(err);
		});
	};

	$scope.usePicture = function(){
		/*
			Usar foto de la camara
		*/
		var options = {
			quality: 50,
			destinationType: navigator.camera.DestinationType.DATA_URL,
			sourceType: navigator.camera.PictureSourceType.PHOTOLIBRARY
		};

		CameraService.getPicture(options)
		.then(function(imageURI) {
			$scope.imageBase64 = "data:image/jpeg;base64," + imageURI;
			var img = new Image;
				img.onload = resizeImage;
				img.src = $scope.imageBase64;
			$scope.modal.hide();
		}, function(err) {
			alert(err);
		});
	};

	$scope.createAlert = function(){
		if($rootScope.data.currentUser){
			$rootScope.showLoading();
			var images = [$scope.imageBase64];
			if(typeof $scope.imageBase64 == 'undefined'){
				$scope.imageBase64=null;
				images = null;
			}
			if (!$scope.imageThumb) $scope.imageThumb=null;
			ItemService.createAlertItem($scope.newAlert, images)
			.then(function(itemRef) {
				var user = $rootScope.data.currentUser;
				if (!user.favorites) user.favorites = {};
				user.favorites[itemRef.key] = true;
				user.$save();
				$rootScope.hideLoading();
				$scope.newAlert = {};
				$scope.imageBase64 = null;
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
		$scope.modal.hide();
	});

});

