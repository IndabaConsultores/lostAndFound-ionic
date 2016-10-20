import { Injectable } from '@angular/core';
import { AngularFire, FirebaseObjectObservable } from 'angularfire2';

import { Constants } from '../app/app.constants';
import { Office } from '../models/office';

@Injectable()
export class OfficeService {

	private _observable: FirebaseObjectObservable<Office>;
	private _office: Office = new Office();
	
	constructor(
		private af: AngularFire,
		private constants: Constants
	) {
		let officeId = constants.OFFICE_ID;
		this._observable = af.database.object('/offices/'+officeId);
		this._observable.subscribe((office) => {
			this._office = office;
		}, (error) => {
			console.log('error');
		}, () => {});
	}

	getOffice(): Office {
		return this._office;
	}

	getObservableOffice(): FirebaseObjectObservable<Office> {
		return this._observable;
	}

}

