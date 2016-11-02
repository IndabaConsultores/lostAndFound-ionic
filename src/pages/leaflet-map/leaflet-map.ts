import { Component, ContentChildren, QueryList, AfterViewInit, OnDestroy, OnChanges, Input, Output, EventEmitter } from '@angular/core';

import 'leaflet';
import 'leaflet.markercluster';

declare var L: any;

export class Location {
	constructor(lat, lng) {
		this.latitude = lat;
		this.longitude = lng;
	}
	latitude: number = 0;
	longitude: number = 0;
}

@Component({
	selector: 'leaflet-marker',
	template: ''
})
export class LeafletMarker implements OnChanges {
	@Input()
	location: Location;

	@Input()
	color: string;

	marker: L.Marker;
	map: L.Map;
	cluster: any;

	setMap(map: any): void {
		this.map = map;
		if (this.marker) this.marker.addTo(this.map);
	}

	setCluster(cluster: any): void {
		this.cluster = cluster;
		if (this.marker) this.cluster.addLayer(this.marker);
	}

	ngOnChanges(changes: any): void {
		if (this.location) {
			let iconOptions: any = {};
			switch (this.color) {
				case 'green':
					iconOptions.icon = L.icon({
						iconUrl: 'assets/img/found-icon.png',
						shadowUrl: 'assets/img/marker-shadow.png',
						iconSize:     [25, 41],
						shadowSize:   [41, 41],
						iconAnchor:   [12, 41],
						popupAnchor:  [1, -34]
					});
					break;
				case 'red':
					iconOptions.icon = L.icon({
						iconUrl: 'assets/img/lost-icon.png',
						shadowUrl: 'assets/img/marker-shadow.png',
						iconSize:     [25, 41],
						shadowSize:   [41, 41],
						iconAnchor:   [12, 41],
						popupAnchor:  [1, -34]
					});
					break;
				default:
					iconOptions = undefined;
			}
			if (this.map && this.marker) this.map.removeLayer(this.marker);
			if (this.cluster && this.marker) this.cluster.removeLayer(this.marker);
			this.marker = L.marker([
				this.location.latitude,
				this.location.longitude
			], iconOptions);
			if (this.map) this.marker.addTo(this.map);
			if (this.cluster) this.cluster.addLayer(this.marker);
		}
	}
}

@Component({
	selector: 'leaflet-map',
	templateUrl: 'leaflet-map.html'
})
export class LeafletMapComponent implements AfterViewInit, OnChanges, OnDestroy {

	@ContentChildren(LeafletMarker) markerComponents: QueryList<LeafletMarker>;

	@Input()
	height: number = 240;

	@Input()
	width: number;

	@Input()
	center: Location = new Location(0,0);

	@Output()
	mapTapped: EventEmitter<Location> = new EventEmitter<Location>();

	viewInit: boolean = false;

	map: any;

	ngAfterViewInit(): void {
		this.initMap();
		this.viewInit = true;
	}

	ngOnChanges(changes: any): void {
		if (!this.map && this.viewInit) {
			this.initMap();
		}
	}

	ngOnDestroy(): void {
		if (this.map) {
			this.map.remove();
		}
	}

	initMap(): void {
		if (this.center) {
			this.map = L.map('leaflet-map', {
				tap: true,
				center: [this.center.latitude, this.center.longitude],
				zoom: 14
			});

			L.tileLayer('http://{s}.tile.stamen.com/terrain/{z}/{x}/{y}.png', {
				attribution: [
					'Map tiles by <a href="http://stamen.com">Stamen Design</a>, ',
					'under <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a>.',
					'<br> Data by <a href="http://openstreetmap.org">OpenStreetMap</a>, ',
					'under <a href="http://www.openstreetmap.org/copyright">ODbL</a>.',
				].join(''),
			maxZoom: 18,
			}).addTo(this.map);

			let markers = L.markerClusterGroup();
			this.markerComponents.forEach((markerComponent) => {
				//markerComponent.setMap(this.map);
				markerComponent.setCluster(markers);
			});
			this.map.addLayer(markers);

			this.markerComponents.changes.subscribe(() => {
				this.markerComponents.forEach((markerComponent) => {
					markerComponent.setMap(this.map);
				});
			});

			this.map.on('click', (event) => {
				let l = new Location(event.latlng.lat, event.latlng.lng);
				this.mapTapped.emit(l);
			});
		}
	}

}

