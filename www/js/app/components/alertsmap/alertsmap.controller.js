'use strict';

angular.module('lf')
.controller('AlertsMapCtrl', function($rootScope, $scope, ItemService) {

	var alerts = ItemService.getAlertItems();
	var markers = {};


	
	$scope.map = L.map('alertsmap', {tap:true});
	L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
		attribution: 'Lost & Found',
		maxZoom: 18
	}).addTo($scope.map);

	for (var i=0; i<alerts.length; i++) {
		var item = alerts[i];
		var imgSrc = item.cover && item.cover.image ? item.cover.image : 'img/no-image.png';
		var popupHTML = '<a style="text-decoration:none" href="#/app/alerts/'+item.$id+'">';
		popupHTML += '<div class="row"><div class="col">';
		popupHTML += '<img class="popup-img" style="max-width:75px !important;" src="'+imgSrc+'"/>';
		popupHTML += '</div><div class="col">';
		popupHTML += '<h3><b>'+item.name+'</b></h3>';
		popupHTML += '<h4>'+item.description+'</h4>';
		popupHTML += '</div></div>';
		popupHTML += '</a>';
		markers[item.$id] = L.marker([
			item.location.latitude,
			item.location.longitude
		]).bindPopup(popupHTML).on('click', function(e) {
			//TODO Si dos alertas estan en el mismo lugar?
			this.openPopup();
		}).addTo($scope.map);
	}
	$scope.map.setView([
		$rootScope.currentLocation.latitude,
		$rootScope.currentLocation.longitude
	], 14);

	$rootScope.$watch('currentLocation', function() {
		$scope.map.setView([
			$rootScope.currentLocation.latitude,
			$rootScope.currentLocation.longitude
		], 14);
	});

});

