
angular.module('lf')
.controller('AlertsCtrl', function($scope,$rootScope,ItemService){

	$rootScope.showLoading();
	ItemService.fetchAlerts(function(error, items) {
		$rootScope.hideLoading();
		$scope.items = items;
		$scope.$apply();
	});

	$scope.doRefresh = function() {
		ItemService.fetchAlerts(function(error,collection){
			$scope.items = collection;
			//Stop the ion-refresher from spinning
			$scope.$broadcast('scroll.refreshComplete');
		});
	}

});

