import { Component, AfterViewInit, OnDestroy, OnChanges, Input, Output, EventEmitter } from '@angular/core';

import 'leaflet';

export class Location {
	constructor(lat, lng) {
		this.latitude = lat;
		this.longitude = lng;
	}
	latitude: number = 0;
	longitude: number = 0;
}

@Component({
	selector: 'leaflet-map',
	templateUrl: 'leaflet-map.html'
})
export class LeafletMapComponent implements AfterViewInit, OnChanges, OnDestroy {

	@Input()
	location: Location;

	@Output()
	locationChange: EventEmitter<Location> = new EventEmitter<Location>();

	@Input()
	markers: Location[];

	@Input()
	enableTap: boolean;

	@Input()
	locationMarker: boolean = true;

	init: boolean = false;

	map: any;
	mainMarker: any;
	allMarkers: Array<any>;

	ngAfterViewInit(): void {
		this.initMap();
		this.init = true;
	}

	ngOnChanges(changes: any): void {
		if (!this.map && this.init) {
			this.initMap();
		}
	}

	ngOnDestroy(): void {
		if (this.map) {
			this.map.remove();
		}
	}

	initMap(): void {
		if (this.location) {
			this.map = L.map('leaflet-map', {
				tap: true,
				center: [this.location.latitude, this.location.longitude],
				zoom: 14
			});
			L.tileLayer('http://{s}.tile.stamen.com/terrain/{z}/{x}/{y}.png', {
				attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, under <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a>.<br> Data by <a href="http://openstreetmap.org">OpenStreetMap</a>, under <a href="http://www.openstreetmap.org/copyright">ODbL</a>.',
				maxZoom: 18,
			}).addTo(this.map);
			if (this.locationMarker) {
				this.mainMarker = L.marker([
					this.location.latitude,
					this.location.longitude
				]).addTo(this.map);
			}
			if (this.markers) {
				this.markers.forEach((location) => {
					if (location) {
						this.allMarkers.push(L.marker([
							location.latitude,
							location.longitude
						]).addTo(this.map));
					}
				});
			}
			if (this.enableTap) {
				this.map.on('click', (event) => {
					this.map.removeLayer(this.mainMarker);
					this.mainMarker = L.marker([
						event.latlng.lat,
						event.latlng.lng
					]).addTo(this.map);
					let l = new Location(event.latlng.lat, event.latlng.lng);
					this.locationChange.emit(l);
				});
			}
		}
	}

}

