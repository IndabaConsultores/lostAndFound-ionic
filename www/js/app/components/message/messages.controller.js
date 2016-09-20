'use strict';

angular.module('lf')
.controller('MessageCtrl', function($rootScope, $scope, $stateParams, MessageService, ItemService, UserService) {

	var item = ItemService.getAlertItem($stateParams.item);
	var type = 'alert';
	if (!item) {
		item = ItemService.getOfficeItem($stateParams.item);
		type = 'office';
	}

	$scope.msg = {};

	$scope.sendMessage = function() {
		ItemService.addMessage(item, $scope.msg).then(function(msgKey) {
			//$scope.doRefresh();
			$scope.msg = {};
		});
	};

	$scope.getUser = function(message) {
		return UserService.getUser(message.user);
	};

	$scope.doRefresh = function() {
		$rootScope.showLoading();
		var itemId = type + '/' + item.$id;
		MessageService.getMessagesByCompositeItemId(itemId)
		.then(function(messages) {
			$scope.messages = messages;
			$rootScope.hideLoading();
		});

		/*
		$scope.messages = [];
		for (var msgKey in item.messages) {
			$scope.messages.push(MessageService.getMessage(msgKey));
		}
		$rootScope.hideLoading();
		*/
	};
	
	$scope.doRefresh();

});

