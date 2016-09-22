angular.module('lf')
.controller('InfoCtrl', function($scope, constants){
	if (!$scope.map) {
		$scope.map = L.map('officemap',{ tap:true });
	}
	$scope.map.setView([
		constants.OFFICE_LAT, 
		constants.OFFICE_LON
	], 14);
	L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
	  attribution: 'Lost & Found',
	  maxZoom: 18
	}).addTo($scope.map);

	$scope.marker = L.marker([
		constants.OFFICE_LAT, 
		constants.OFFICE_LON
	]).addTo($scope.map);
});
