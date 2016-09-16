
angular.module('lf')
.controller('AlertsCtrl', function($ionicPopover, $ionicPopup, $scope, $rootScope, ItemService){

	$ionicPopover.fromTemplateUrl('popover.html', {scope: $scope})
	.then(function(popover) {
		$scope.popover = popover;
	});

	$scope.openPopover = function($event) {
		$scope.popover.show($event);
	};

	$scope.closePopover = function() {
		$scope.popover.hide();
	};
	
	$scope.$on('destroy', function() {
		$scope.popover.remove();
	});

	$scope.noFavorites = function() {
		return !!$scope.showFavorites && $rootScope.data.currentUser && (!$rootScope.data.currentUser.favorites || $rootScope.data.currentUser.favorites.length == 0);
	};

	$scope.isFavorite = function(item) {
		if ($scope.showFavorites) {
			if ($rootScope.data.currentUser && $rootScope.data.currentUser.favorites)
				return $rootScope.data.currentUser.favorites.hasOwnProperty(item.$id);
			else
				return false;
		} else {
			return true;
		}
	};

	$scope.showAllItems = function() {
		$scope.showFavorites = false;
		$scope.popover.hide();
	};

	$scope.showFavItems = function() {
		if ($rootScope.data.currentUser) {
			$scope.showFavorites = true;
		} else {
			$ionicPopup.show({
				template: 'Please log in to use this function',
				scope: $scope,
				buttons: [
					{ text: 'OK' }
				]
			});
		}
		$scope.popover.hide();
	};
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
	};

});

