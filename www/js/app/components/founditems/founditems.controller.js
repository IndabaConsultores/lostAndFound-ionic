
angular.module('lf')
.controller('FoundItemsCtrl', function($rootScope, $scope, $translate, $filter, ItemService, OfficeService, CategoryService, $ionicFilterBar){

	$scope.showSearchBar = function() {
		$scope.hideSearchBar = $ionicFilterBar
			.show({
				items: $scope.categories,
				update: function(newItems) {
					$scope.categories = newItems;
				},
				filter: $filter('category-items')
			});
	};
	
	$scope.categories = [];

	$scope.doRefresh = function() {
		var categories = CategoryService.getCategories();
		$scope.categories = [];
		for (var i=0; i<categories.length; i++) {
			var catId = categories[i].$id;
			var cat = CategoryService.getCategory(catId);
			cat.items = ItemService.getOfficeItemsByCat(catId);
			$scope.categories.push(cat);
		}
		var noCat = {};
		noCat.items = ItemService.getOfficeItemsUncategorized();
		$scope.categories.push(noCat);
		//notifica al ion-refresher para que pare de girar
		$scope.$broadcast('scroll.refreshComplete');
	};

	
	$scope.doRefresh();

	//Automatically refresh every minute
	setInterval($scope.doRefresh, 1000*60*5);
	
});

