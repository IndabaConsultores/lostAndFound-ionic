'use strict';

angular.module('lf')
.controller('AlertItemCtrl', function($scope,$stateParams,$rootScope,$ionicPopup,ItemService,OfficeService,$firebaseObject){

	function itemFavorited() {
		var itemKey = $stateParams.item;
		var user = $rootScope.data.currentUser;
		if (user) {
			if (user.favorites) return user.favorites.hasOwnProperty(itemKey);	
			else return false;
		} else {
			return false;
		}
	}

	$scope.favIcon = itemFavorited() ? 'ion-star' : 'ion-ios-star-outline';

	$scope.save = function() {
		var user = $rootScope.data.currentUser;
		var itemKey = $stateParams.item;

		if (itemFavorited()) {
			user.favorites[itemKey] = null;
			$scope.favIcon = 'ion-ios-star-outline';
		} else {
			if (!user.favorites) user.favorites = {};
			user.favorites[itemKey] = true;
			$scope.favIcon = 'ion-star';
		}
		user.$save();
	}

    $rootScope.showLoading();

	$scope.item = ItemService.getAlertItem($stateParams.item);
	
	if (!$scope.item) {
		$rootScope.hideLoading();
		//TODO manejar item inexistente
		return;
	}

	if ($scope.item.images.length > 0) {
		$scope.item.cover = $scope.item.images[0].image;
	}

	if ($scope.item.messages) {
		$scope.numMessages = Object.keys($scope.item.messages).length;
	} else {
		$scope.numMessages = 0;
	}

	if(!!$scope.item.location){
		if (!$scope.map) {
			$scope.map = L.map('alertmap',{ tap:true });
		}
		$scope.map.setView([
			$scope.item.location.latitude, 
			$scope.item.location.longitude
		], 14);
		L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
		  attribution: 'Lost & Found',
		  maxZoom: 18
		}).addTo($scope.map);

		$scope.marker = L.marker([
			$scope.item.location.latitude, 
			$scope.item.location.longitude
		]).addTo($scope.map);
	}
        
	$rootScope.hideLoading();

});

