import { Injectable } from '@angular/core';
import { AngularFire } from 'angularfire2';

import { User } from '../models/user';

@Injectable()
export class AuthService {

	private currentUser: any; // firebase.User

	constructor(
		public af: AngularFire
	) {
		af.auth.subscribe((authData) => {
			console.log('Auth change: ', authData);
			this.currentUser = authData;
		});
	}

	getCurrentUser(): any {
		return this.currentUser;
	}

	createUser(user: User): any {
		let fbUser = {
			email: user.email,
			password: user.password
		};
		return this.af.auth.createUser(fbUser)
		.then((authState) => {
			let observableUser = this.af.database.object('users/' + authState.uid);
			delete user.password;
			return observableUser.update(user);
		});
	}

	login(user: User): any {
		let fbUser = {
			email: user.email,
			password: user.password
		};
		return this.af.auth.login(fbUser);
	}

	logout(): any {
		this.af.auth.logout();
	}

}

