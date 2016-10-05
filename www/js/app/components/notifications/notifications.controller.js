'use strict';

angular.module('lf')
.controller('NotifyCtrl', function($rootScope, $scope) {
	$scope.notifications = [];

	$scope.clearNotifications = function() {
		$scope.notifications = [];
	};
	
	$scope.getStyle = function(notification) {
		return !!notification.isNew ? '{border-left: inset blue 5px}' : '{}';
	};
	
	$scope.openNotification = function(notification, index) {
		$scope.notifications.splice(index, 1);
		notification.open();
	};

	$rootScope.$on('new-notification', function(event, notification) {
		$scope.notifications.push(notification);
	});
});

