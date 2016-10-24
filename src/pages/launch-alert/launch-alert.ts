import { Component } from '@angular/core';

import { NavController, NavParams, LoadingController } from 'ionic-angular';

import { AuthService } from '../../services/auth.service';
import { ItemService } from '../../services/item.service';
import { LocationService } from '../../services/location.service';

import { Item } from '../../models/item';
import { Image } from '../../models/image';

import { LoginPage } from '../login/login';
import { AlertItemListPage } from '../alert-item-list/alert-item-list';

@Component({
	selector: 'launch-alert',
	templateUrl: 'launch-alert.html'
})
export class LaunchAlertPage {

	image: string;
	item: Item;
	currentLocation: any;

	constructor(
		public navCtrl: NavController,
		public navParams: NavParams,
		public loadingCtrl: LoadingController,
		public authService: AuthService,
		public itemService: ItemService,
		public locationService: LocationService
	) {
		let type = navParams.get('type');
		this.item = new Item();
		this.item.type = type;
		let observable = locationService.getCurrentLocation();
		let subscription = observable.subscribe((location) => {
			this.currentLocation = location;
			subscription.unsubscribe();
		});
	}

	ionViewCanEnter(): boolean {
			return this.loggedIn();
	}

	setImage(event: any): void {
		this.image = event.imageURI;
	}

	loggedIn(): boolean {
		if (this.authService.getCurrentUser()) {
			return true;
		} else {
			return false;
		}
	}

	launchAlert(): void {
		let user = this.authService.getCurrentUser();
		if (user) {
			this.item.createdBy = user.uid;
			this.item.location = this.currentLocation;
			let images: Image[] = [];
			if (this.image) {
				let image = new Image();
				image.image = this.image;
				images.push(image);
			}
			let loader = this.loadingCtrl.create();
			this.itemService.createAlert(this.item, images).then(() => {
				loader.dismiss();
				this.navCtrl.setRoot(AlertItemListPage);
			}).catch((error) => {
				console.log(error);
			});
		}
	}

	goToLogin(): void {
		this.navCtrl.push(LoginPage, {
			redirect: LaunchAlertPage
		});
	}

}

