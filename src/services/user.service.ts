import { Injectable } from '@angular/core';
import { AngularFire, FirebaseObjectObservable } from 'angularfire2';

import { User } from '../models/user';

@Injectable()
export class UserService {

	private _observableUsers: Object;

	constructor(
		private af: AngularFire,
	) {
		this._observableUsers = {};
	}

	getObservableUser(id: string): FirebaseObjectObservable<User> {
		if (!this._observableUsers[id]) {
			this._observableUsers[id] = this.af.database.object('/users/'+id)
		}
		return this._observableUsers[id];
	}

	getUser(id: string): Promise<User> {
		if (!this._observableUsers[id]) {
			this._observableUsers[id] = this.af.database.object('/users/'+id)
		}
		return new Promise((resolve, reject) => {
			let subscription = this._observableUsers[id]
			.subscribe((user) => {
				resolve(user);
				subscription.unsubscribe();
			}, (error) => {
				reject(error);
			});
		});
	}

	updateUser(user: User): Promise<any> {
		let u: FirebaseObjectObservable<User> = this._observableUsers[user.$key];
		if (!u) {
			u  = this.af.database.object('/users/'+user.$key)
		}
		// return u.update(user);
		// Mock update for now
		return new Promise((resolve, reject) => {
			setTimeout(() => resolve(), 1000);
		});
	}

}

