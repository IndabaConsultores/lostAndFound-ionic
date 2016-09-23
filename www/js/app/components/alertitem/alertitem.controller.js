'use strict';

angular.module('lf')
.controller('AlertItemCtrl', function($rootScope, $scope, $state, $stateParams, $ionicPopup, $ionicPopover, $ionicModal, $firebaseObject, ItemService){

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
	};

	$scope.deleteItem = function() {
		if ($rootScope.data.currentUser.$id != $scope.item.createdBy.$id) {
			$ionicPopup.show({
				template: 'Please log in to use this function',
				scope: $scope,
				buttons: [
					{ text: 'OK' }
				]
			});
		} else {
			$ionicPopup.confirm({
				title: 'Delete item',
				template: 'Are you sure you want to delete the alert?'
			}).then(function(confirm) {
				if (!!confirm) {
					var item = $scope.item;
					$scope.popover.hide();
					ItemService.deleteAlertItem(item).then(function(ref) {
						$rootScope.$broadcast('alert-deleted', item);
						$state.go('app.alerts');
					}).catch(function(error) {
						console.log(error);
					});
				}
			});
		}
	};

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

	$scope.showPicture = function(){
		console.log('showPictureItem');
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

