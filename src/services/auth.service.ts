import { Injectable } from '@angular/core';
import { AngularFire, FirebaseObjectObservable } from 'angularfire2';
import { EmailPasswordCredentials, FirebaseAuthState } from 'angularfire2/auth';

import { User } from '../models/user';

@Injectable()
export class AuthService {

	private currentUser: FirebaseAuthState; // firebase.User

	constructor(
		public af: AngularFire
	) {
		af.auth.subscribe((authData) => {
			this.currentUser = authData;
		});
	}

	getCurrentUser(): FirebaseAuthState {
		return this.currentUser;
	}

	createUser(user: User): firebase.Promise<any> {
		let fbUser: EmailPasswordCredentials = {
			email: user.email,
			password: user.password
		};
		return this.af.auth.createUser(fbUser)
		.then((authState: FirebaseAuthState) => {
			let observableUser: FirebaseObjectObservable<User> = this.af.database.object('users/' + authState.uid);
			delete user.password;
			return observableUser.update(user);
		});
	}

	login(user: User): firebase.Promise<FirebaseAuthState> {
		let fbUser: EmailPasswordCredentials = {
			email: user.email,
			password: user.password
		};
		return this.af.auth.login(fbUser);
	}

	logout(): void {
		this.af.auth.logout();
	}

}

