import { Injectable } from '@angular/core';
import { TranslateService } from 'ng2-translate';

import { NativeStorage } from 'ionic-native';

import { AuthService } from './auth.service';
import { UserService } from './user.service';

import moment from 'moment';
import 'moment/src/locale/eu';
import 'moment/src/locale/es';
import 'moment/src/locale/en-gb';

@Injectable()
export class SettingsService {

	constructor(
		public translate: TranslateService,
		public authService: AuthService,
		public userService: UserService
	) { }

	applySettings(): void {
		let auth = this.authService.getCurrentUser();
		if (auth) {
			this.userService.getUser(auth.uid).then((user) => {
				this.translate.use(user.language);
				moment.locale(user.language);
			});
		} else {
			NativeStorage.getItem('settings').then((localSettings) => {
				if (localSettings) {
					this.translate.use(localSettings.language);
					moment.locale(localSettings.language);
				}
			}).catch((error) => {
				console.log(error);
				let stringSettings: string = window.localStorage.getItem('settings');
				if (stringSettings) {
					let localSettings: any = JSON.parse(stringSettings);
					this.translate.use(localSettings.language);
					moment.locale(localSettings.language);
				}
			});
		}
	}

}

