'use strict';

angular.module('lf')
.controller('FoundItemCtrl', function($scope, $stateParams, $rootScope, $ionicPopup, $ionicModal, ItemService, OfficeService, $firebaseArray, $firebaseObject){

	$rootScope.showLoading();
	$scope.item = ItemService.getOfficeItem($stateParams.itemId);
	if ($scope.item.images) {
		$scope.item.cover = $scope.item.images[0].image;
	}
	if ($scope.item.messages) {
		$scope.numMessages = Object.keys($scope.item.messages).length;
	} else {
		$scope.numMessages = 0;
	}

	if(!$scope.item.location){
		$scope.item.location = $rootScope.office.location;
	}
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

	$rootScope.hideLoading();

	$scope.showPicture = function(){
		if ($scope.item.cover) {
			var modalScope = $scope.$new();
			modalScope.image = {
				title: $scope.item.name,
				image: $scope.item.cover
			};
			$ionicModal.fromTemplateUrl('js/app/templates/image_modal.html', {
				scope: modalScope,
				animation: 'slide-in-up'
			}).then(function(modal) {
				$scope.modal = modal;
				$scope.modal.show();
			});
		}
	};

});

