import { Injectable } from '@angular/core';
import { AngularFire, FirebaseListObservable } from 'angularfire2';

import { ImageService } from './image.service';
import { Constants } from '../app/app.constants';
import { Item } from '../models/item';
import { Image } from '../models/image';

@Injectable()
export class ItemService {

	private _officeId: number;

	private _observableOffices: FirebaseListObservable<Item[]>;
	private _observableAlerts: FirebaseListObservable<Item[]>;
	private _officeItems: Item[] = [];
	private _alertItems: Item[] = [];

	private _loadedOffice: Promise<any>;
	private _loadedAlerts: Promise<any>;

	constructor(
		private af: AngularFire,
		private constants: Constants,
		public imageService: ImageService
	) {
		this._officeId = +constants.OFFICE_ID;
		let query: { orderByChild: string, equalTo: any };
		query = {
			orderByChild: 'office',
			equalTo: this._officeId
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

		this._observableAlerts = af.database.list('/items/alert');
		this._loadedAlerts = new Promise((resolve, reject) => {
			this._observableAlerts.subscribe((items) => {
				this._alertItems = items;
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

	hasLoadedAlert(): Promise<any> {
		return this._loadedAlerts;
	}

	listOfficeItems(): Item[] {
		return this._officeItems;
	}

	listAlertItems(): Item[] {
		return this._alertItems;
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

	createAlert(item: Item, images: Image[]): any {
		item.createDate = new Date();
		item.modifiedDate = new Date();
		item.office = this._officeId;
		console.log(item);
		return this._observableAlerts.push(item).then((ref) => {
			let itemId = ref.key;
			console.log('itemAdded: ', itemId);
			let promises = [];
			for (let i=0; i<images.length; i++) {
				let image = images[i];
				image.item = item.type + '/' + itemId;
				image.createDate = item.createDate;
				image.modifiedDate = item.modifiedDate;
				let promise = this.imageService.createImage(image);
				promises.push(promise);
			}
			return Promise.all(promises).then((results) => {
				console.log('All images added: ', results);
				item.images = {};
				for (let i=0; i<results.length; i++) {
					let imageId = results[i];
					console.log('Image: ', imageId);
					item.images[imageId] = true;
				}
				return this._observableAlerts.update(itemId, item);
			});
		});
	}

}

