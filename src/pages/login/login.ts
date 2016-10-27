import { Component } from '@angular/core';

import { NavController, NavParams } from 'ionic-angular';

import { SignUpPage } from '../signup/signup';

import { AuthService } from '../../services/auth.service';

import { User } from '../../models/user';

@Component({
	selector: 'login',
	templateUrl: 'login.html'
})
export class LoginPage {

	error: boolean;

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

	doLogin(): void {
		this.authService.login(this.user)
		.then(() => {
			delete this.error;
			if (this.navCtrl.canGoBack()) {
				this.navCtrl.pop();
			} else {
				this.navCtrl.setRoot(this.rootPage);
			}
		}).catch((error) => {
			this.error = true;
			console.log(error);
		});
	}

	goToSignUp(): void {
		this.navCtrl.push(SignUpPage, {redirect: this.rootPage});
	}
}

