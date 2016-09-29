'use strict';

angular.module('lf')
.controller('InfoCtrl', function($rootScope, $scope, constants){

	if ($rootScope.office && $rootScope.office.location) {
		if (!$scope.map) {
			$scope.map = L.map('officemap',{ tap:true });
		}

		L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
			attribution: 'Lost & Found',
			maxZoom: 18
		}).addTo($scope.map);

		$scope.map.setView([
			$rootScope.office.location.latitude,
			$rootScope.office.location.longitude
		], 14);
		$scope.marker = L.marker([
			$rootScope.office.location.latitude,
			$rootScope.office.location.longitude
		]).addTo($scope.map);
	}

	$scope.openUrl = function(url) {
		if (!url.startsWith('http'))
			url = 'http://' + url;
		window.open(url, '_system', 'location=yes');
	};
});
