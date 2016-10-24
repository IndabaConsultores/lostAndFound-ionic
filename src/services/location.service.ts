import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { Geolocation } from 'ionic-native';

export class Location {
	constructor(lat:number, lng:number) {
		this.latitude = lat;
		this.longitude = lng;
	}
	latitude: number;
	longitude: number;
}

@Injectable()
export class LocationService {

	private currentLocation: Observable<Location>;

	constructor(
	) {
		this.currentLocation = new Observable<Location>((observer) => {
			let watch = Geolocation.watchPosition({
				enableHighAccuracy: false,
				timeout: 60000,
				maximumAge: 300000
			});
			watch.subscribe((position) => {
				if (position.code === undefined) {
					let location = new Location(0, 0);
					location.latitude = position.coords.latitude;
					location.longitude = position.coords.longitude;
					observer.next(location);
				}
			});
		});
	}

	getCurrentLocation(): Observable<Location> {
		return this.currentLocation;
	}

}

