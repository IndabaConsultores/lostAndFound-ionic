import { Injectable } from '@angular/core';
import { AngularFire, FirebaseListObservable } from 'angularfire2';

import { Constants } from '../app/app.constants';
import { Category } from '../models/category';

@Injectable()
export class CategoryService {

	private _observable: FirebaseListObservable<Category[]>;
	private _categories: Category[];
	private _loaded: Promise<any>;

	constructor(
		private af: AngularFire,
		private constants: Constants
	) {
		let officeId: number = +constants.OFFICE_ID;
		let query: {orderByChild: string, equalTo: any};
		query = {
			orderByChild: 'office',
			equalTo: officeId
		}
		this._observable = af.database.list('/categories', {query: query});

		this._loaded = new Promise((resolve, reject) => {
			this._observable.subscribe((categories) => {
				this._categories = categories;
				let unCat = new Category();
				unCat.$key = -1;
				this._categories.push(unCat);
				resolve(categories);
			}, (error) => {
				console.log(error);
				reject(error);
			}, () => {
				resolve(true);
			});
		});
	}

	hasLoaded(): Promise<any> {
		return this._loaded;
	}

	listObservableCategories(): FirebaseListObservable<Category[]> {
		return this._observable;
	}

	listCategories(): Category[] {
		return this._categories;
	}

	getCategory(id: number): Category {
		for (let i=0; i<this._categories.length; i++) {
			let cat = this._categories[i];
			if (cat.$key === id) {
				return cat;
			}
		}
		return undefined;
	}

}

