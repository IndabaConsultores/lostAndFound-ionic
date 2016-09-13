
angular.module('lf')
.controller('FoundItemsCtrl', function($scope,$rootScope,ItemService,OfficeService){
	
	ItemService.fetchFoundItems(function(error,categories){
		console.log(categories);
		$scope.categories = categories;
		$scope.$apply();
	});
	
});
