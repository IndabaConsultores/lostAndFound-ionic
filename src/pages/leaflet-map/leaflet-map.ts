import { Component, AfterViewInit, OnDestroy, Input } from '@angular/core';
import 'leaflet';

export class Location {
	latitude: number = 0;
	longitude: number = 0;
}

@Component({
	selector: 'leaflet-map',
	templateUrl: 'leaflet-map.html'
})
export class LeafletMapComponent implements AfterViewInit, OnDestroy {
	@Input()
	location: Location;

	@Input()
	markers: Location[];

	map: any;

	ngAfterViewInit(): void {
		this.map = L.map('leaflet-map', {
			tap: true,
			center: [this.location.latitude, this.location.longitude],
			zoom: 14
		});
		L.tileLayer('http://{s}.tile.stamen.com/terrain/{z}/{x}/{y}.png', {
		attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, under <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a>. Data by <a href="http://openstreetmap.org">OpenStreetMap</a>, under <a href="http://www.openstreetmap.org/copyright">ODbL</a>.',
		maxZoom: 18,
		}).addTo(this.map);
		if (this.markers) {
			this.markers.forEach((location) => {
				L.marker([location.latitude, location.longitude]).addTo(this.map);
			});
		}
	}

	ngOnDestroy(): void {
		this.map.remove();
	}

}

