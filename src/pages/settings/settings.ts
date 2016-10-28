import { Component, OnInit } from '@angular/core';
import { TranslateService } from 'ng2-translate';

import { NavController } from 'ionic-angular';
import { NativeStorage } from 'ionic-native';

import { User } from '../../models/user';

import { AuthService } from '../../services/auth.service';
import { UserService } from '../../services/user.service';

import moment from 'moment';
import 'moment/src/locale/eu';
import 'moment/src/locale/es';
import 'moment/src/locale/en-gb';

@Component({
	selector: 'settings',
	templateUrl: 'settings.html'
})
export class SettingsPage implements OnInit {

	user: User;
	languages: string[];

	constructor(
		public navCtrl: NavController,
		public translate: TranslateService,
		public authService: AuthService,
		public userService: UserService
	) {
	}

	ngOnInit(): void {
		this.user = new User();
		this.languages = ['eu', 'es', 'en'];
		let auth = this.authService.getCurrentUser();
		if (auth) {
			this.userService.getUser(auth.uid).then((user) => {
				this.user = user;
			});
		} else {
			NativeStorage.getItem('settings').then((localSettings) => {
				if (localSettings) {
					this.user.language = localSettings.language;
					this.user.alerts = localSettings.alerts;
				}
			}).catch((error) => {
				console.log(error);
				let localSettings: string = window.localStorage.getItem('settings');
				if (localSettings) {
					let obj: any = JSON.parse(localSettings);
					this.user.language = obj.language;
					this.user.alerts = obj.alerts;
				}
			});
		}
	}

	saveSettings(): void {
		console.log('saveSettings: ', this.user);
		let auth = this.authService.getCurrentUser();
		if (auth) {
			this.userService.updateUser(this.user);
		} else {
			let settings: Object = {
				alerts: this.user.alerts,
				language: this.user.language
			}
			let settingsJSON: string = JSON.stringify(settings);
			window.localStorage.setItem('settings', settingsJSON);
		}
		this.translate.use(this.user.language);
		moment.locale(this.user.language);
		// TODO apply alert settings
	}

}

