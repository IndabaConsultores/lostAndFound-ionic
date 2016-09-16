angular.module('lf')
.controller('LaunchAlertCtrl', function($state, $scope,$rootScope,$ionicPopup,$ionicModal,CameraService,ItemService,ImageService) {

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
		$scope.map = L.map('map',{ tap:true }).setView([ $scope.coords.lat, $scope.coords.lng ], 14);

		L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
			attribution: 'Lost & Found',
			maxZoom: 18
		}).addTo($scope.map);

		$scope.marker = L.marker([$scope.coords.lat, $scope.coords.lng]).addTo($scope.map);
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
		$scope.coords = {'lat':success.coords.latitude, 'lng': success.coords.longitude };
		$scope.initMap();
	},function(error){
		// TODO no funciona, ya que office no tiene location
		// $scope.coords = {'lat':$rootScope.office.location.latitude, 'lng': $rootScope.office.location.longitude };
		$scope.coords = {'lat': 0, 'lng': 0};
		console.log(error);
		$scope.initMap();
	},{timeout:10000});


	function resizeImage() {
		//$scope.imageThumb = CameraService.resizeImage(this, 64, 64);
	}

	$scope.newalert = {};

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
		if($rootScope.data.currentuser){
			$rootScope.showLoading();

			if(typeof $scope.imageBase64 == 'undefined'){
				$scope.imageBase64=null;
			}
			if (!$scope.imageThumb) $scope.imageThumb=null;
			ImageService.createImage($scope.imageBase64)
			.then(function(fbImg) {
				var new_item = {
					"type": "alert",
					"createdAt": Date.now(),
					"createdBy": $rootScope.data.currentuser.$id,
					"images": {},
					"office": $rootScope.office.$id,
					"name": $scope.newalert.name,
					"description": $scope.newalert.description,
					"location": {
						"latitude": $scope.coords.lat,
						"longitude": $scope.coords.lng
					}
				};
				new_item.images[fbImg.$id] = true;
				ItemService.newAlertItem(new_item, function(error,data){
					ItemService.fetchAlerts(function(error,collection){
						$rootScope.hideLoading();
						$scope.newalert = {};
						$scope.imageBase64 = null;
						$rootScope.alert_collection = collection;
						var alertPopup = $ionicPopup.alert({
							title: 'New alert',
							template: 'New alert created successfully'
						});
						alertPopup.then(function(res) {
							$state.go('app.alerts');
						});
					});
				});			
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
		$scope.modal.remove();
	});

});
