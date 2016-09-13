angular.module('lf')
.controller('FoundItemCtrl', function($scope,$stateParams,$rootScope,$ionicPopup,ItemService,OfficeService,$firebaseArray,$firebaseObject){

	$rootScope.showLoading();
	ItemService.getFoundItem($stateParams.itemId, function(error,item){
		console.log(item);
		$scope.item = item;
		if(!!$scope.item.location){
			$scope.map = L.map('alertmap',{ tap:true }).setView([$scope.item.location.latitude, $scope.item.location.longitude], 14);
			L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
				attribution: 'Lost & Found',
				maxZoom: 18
			}).addTo($scope.map);
			$scope.marker = L.marker([$scope.item.location.latitude, $scope.item.location.longitude]).addTo($scope.map);
		}
		$rootScope.hideLoading();
	});

});
