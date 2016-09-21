'use strict';

angular.module('lf')
.controller('FoundItemCtrl', function($scope,$stateParams,$rootScope,$ionicPopup,ItemService,OfficeService,$firebaseArray,$firebaseObject){

	$rootScope.showLoading();
	$scope.item = ItemService.getOfficeItem($stateParams.itemId);
	if ($scope.item.images) {
		$scope.item.cover = $scope.item.images[0];
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

