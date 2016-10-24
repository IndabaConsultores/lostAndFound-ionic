import { Component } from '@angular/core';

import { NavController } from 'ionic-angular';

import { AuthService } from '../../services/auth.service';
import { LaunchAlertPage } from '../launch-alert/launch-alert';

@Component({
	selector: 'pre-launch-alert',
	templateUrl: 'pre-launch-alert.html'
})
export class PreLaunchAlertPage {
	constructor(
		public navCtrl: NavController,
		public authService: AuthService
	) { }

	ionViewCanEnter(): boolean {
		if (this.authService.getCurrentUser()) {
			return true;
		} else {
			return false;
		}
	}

	launchAlert(type: string): void {
		this.navCtrl.push(LaunchAlertPage, {
			type: type
		});
	}
}

