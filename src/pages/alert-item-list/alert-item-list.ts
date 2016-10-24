import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { TranslateService } from 'ng2-translate/ng2-translate';

import { NavController, LoadingController } from 'ionic-angular';

import { ItemService } from '../../services/item.service';
import { ImageService } from '../../services/image.service';

import { Item } from '../../models/item';
import { Image } from '../../models/image';

import { AlertItemDetailPage } from '../alert-item-detail/alert-item-detail';

@Component({
	selector: 'alert-item-list',
	templateUrl: 'alert-item-list.html'
})
export class AlertItemListPage {

	items: Item[];
	covers: Object;

	constructor(
		public navCtrl: NavController,
		public loadingCtrl: LoadingController,
		public translate: TranslateService,
		public itemService: ItemService,
		public imageService: ImageService
	) {
		this.items = [];
		this.covers = {};
		var loader = this.loadingCtrl.create();
		loader.present();
		Promise.all([
			itemService.hasLoadedAlert()
		]).then(() => {
			this.doRefresh();
			loader.dismiss();
		});
	}

	doRefresh(refresher?: any): void {
		let itemCount = 0,
				itemsLength = 0;
		this.items = this.itemService.listAlertItems();
		itemsLength = this.items.length;
		this.items.forEach((item) => {
			let image: Observable<Image>;
			if (item.images) {
				let imageId = Object.keys(item.images)[0];
				image = this.imageService.getObservableImage(imageId);
			} else {
				let img = new Image();
				img.image = 'assets/img/no-image.png';
				image = Observable.of(img);
			}
			this.covers[item.$key] = image;
			itemCount++;
			if (itemCount === itemsLength) {
				if (refresher) refresher.complete();
			}
		});
	}

	itemTapped(event: any, item: Item): void {
		this.navCtrl.push(AlertItemDetailPage, {
			item: item
		});
	}

}

