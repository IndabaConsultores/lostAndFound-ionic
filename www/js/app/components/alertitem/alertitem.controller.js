
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
    ItemService.getAlert($stateParams.item,function(error,item){
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

