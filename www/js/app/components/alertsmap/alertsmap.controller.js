'use strict';

angular.module('lf')
.controller('AlertsMapCtrl', function($rootScope, $scope, ItemService) {

	var alerts = ItemService.getAlertItems();
	var markers = {};
	
	var lostIcon = L.icon({
		iconUrl: 'img/lost-icon.png',
		shadowUrl: 'img/marker-shadow.png',
		iconSize:     [25, 41],
		shadowSize:   [41, 41],
		iconAnchor:   [12, 41],
		popupAnchor:  [1, -34] 
	});
	
	var foundIcon = L.icon({
		iconUrl: 'img/found-icon.png',
		shadowUrl: 'img/marker-shadow.png',
		iconSize:     [25, 41],
		shadowSize:   [41, 41],
		iconAnchor:   [12, 41],
		popupAnchor:  [1, -34] 
	});
	
	$scope.alertsMap = L.map('alertsmap', {tap:true});
	L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
		attribution: 'Lost & Found',
		maxZoom: 18
	}).addTo($scope.alertsMap);

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
		], {
			icon: item.type == 'lost' ? lostIcon : foundIcon
		}).bindPopup(popupHTML).on('click', function(e) {
			//TODO Si dos alertas estan en el mismo lugar?
			this.openPopup();
		}).addTo($scope.alertsMap);
	}
	$scope.alertsMap.setView([
		$rootScope.currentLocation.latitude,
		$rootScope.currentLocation.longitude
	], 14);

	$rootScope.$watch('currentLocation', function() {
		$scope.alertsMap.setView([
			$rootScope.currentLocation.latitude,
			$rootScope.currentLocation.longitude
		], 14);
	});

});

