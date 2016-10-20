import { Injectable } from '@angular/core';
import { AngularFire, FirebaseObjectObservable, FirebaseListObservable } from 'angularfire2';

import { Constants } from '../app/app.constants';
import { Item } from '../models/item';

@Injectable()
export class ItemService {

	private _observableOffices: FirebaseListObservable<Item[]>;
	private _observableAlerts: FirebaseListObservable<Item[]>;
	private _officeItems: Item[] = [];
	private _alertItems: Item[] = [];

	private _loadedOffice: Promise<any>;
	private _loadedAlerts: Promise<any>;

	constructor(
		private af: AngularFire,
		private constants: Constants
	) {
		let officeId: number = +constants.OFFICE_ID;
		let query: { orderByChild: string, equalTo: any };
		query = {
			orderByChild: 'office',
			equalTo: officeId
		}

		this._observableOffices = af.database.list('/items/office', {query: query});
		this._loadedOffice = new Promise((resolve, reject) => {
			this._observableOffices.subscribe((items) => {
				this._officeItems = items;
				resolve(items);
			}, (error) => {
				console.log('error');
				reject(error);
			}, () => {});
		});
	}

	hasLoadedOffice(): Promise<any> {
		return this._loadedOffice;
	}

	listOfficeItems(): Item[] {
		return this._officeItems;
	}

	listOfficeItemsByCat(catId: number): Item[] {
		let items = [];
		for (let i=0; i<this._officeItems.length; i++) {
			let item = this._officeItems[i];
			if (item.category === catId || (!item.category && catId === -1)) {
				items.push(item);
			}
		}
		return items;
	}

	getOfficeItem(id: string): Item {
		for (let i=0; i<this._officeItems.length; i++) {
			let item = this._officeItems[i];
			if (item.$key === id) {
				return item;
			}
		}
		return undefined;
	}

}
