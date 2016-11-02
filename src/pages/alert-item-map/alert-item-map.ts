import { Component, HostListener } from '@angular/core';

import { LocationService } from '../../services/location.service';
import { ItemService } from '../../services/item.service';

import { Item } from '../../models/item';

@Component({
	selector: 'alert-item-map',
	templateUrl: 'alert-item-map.html'
})
export class AlertItemMapPage {
	public currentLocation: any;
	public items: Item[];

	public viewport: {width: number, height: number};

	constructor(
		public locationService: LocationService,
		public itemService: ItemService
	) {
		let subscription = locationService.getCurrentLocation()
		.subscribe((location) => {
			this.currentLocation = location;
			subscription.unsubscribe();
		});

		this.items = itemService.listAlertItems();
		this.viewport = {
			width: window.innerWidth,
			height: window.innerHeight
		};
	}

	@HostListener('window:resize', ['$event'])
	onResize(event: any): void {
		this.viewport = {
			width: window.innerWidth,
			height: window.innerHeight
		};
	}
}

