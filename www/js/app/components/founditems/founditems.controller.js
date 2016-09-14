
angular.module('lf')
.controller('FoundItemsCtrl', function($scope,$rootScope,ItemService,OfficeService){
	
	ItemService.fetchFoundItems(function(error,categories){
		$scope.categories = categories;
		$scope.$apply();
	});
	
	$scope.doRefresh = function() {
		ItemService.fetchFoundItems(function(error,categories){
			$scope.categories = categories;
			//Stop the ion-refresher from spinning
			$scope.$broadcast('scroll.refreshComplete');
		});
	}
	
	//Automatically refresh every minute
	setInterval($scope.doRefresh, 1000*60*5);
	
});

