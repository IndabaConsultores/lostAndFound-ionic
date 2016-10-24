import { Component } from '@angular/core';

import { NavController, NavParams } from 'ionic-angular';

import { AuthService } from '../../services/auth.service';

import { User } from '../../models/user';

@Component({
	selector: 'signup',
	templateUrl: 'signup.html'
})
export class SignUpPage {

	error: string;

	rootPage: Component;
	user: User;

	constructor(
		public navCtrl: NavController,
		public navParams: NavParams,
		public authService: AuthService
	) {
		this.rootPage = navParams.get('redirect');
		this.user = new User();
	}

	doSignUp(): void {
		this.authService.createUser(this.user)
		.then(() => {
			delete this.error;
			this.navCtrl.setRoot(this.rootPage);
		}).catch((error) => {
			console.log(error);
			this.error = error.code;
		});
	}
}

