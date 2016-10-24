import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { TranslateService } from 'ng2-translate/ng2-translate';

import { NavController, LoadingController } from 'ionic-angular';

import { CategoryService } from '../../services/category.service';
import { ItemService } from '../../services/item.service';
import { ImageService } from '../../services/image.service';

import { Category } from '../../models/category';
import { Item } from '../../models/item';
import { Image } from '../../models/image';

import { OfficeItemDetailPage } from '../office-item-detail/office-item-detail';

@Component({
	selector: 'office-item-list',
	templateUrl: 'office-item-list.html'
})
export class OfficeItemListPage {

	categories: Category[];
	items: Object;
	covers: Object;

	constructor(
		public navCtrl: NavController,
		public loadingCtrl: LoadingController,
		public translate: TranslateService,
		public catService: CategoryService,
		public itemService: ItemService,
		public imageService: ImageService
	) {
		this.items = {};
		this.covers = {};
		var loader = this.loadingCtrl.create();
		loader.present();
		Promise.all([
			catService.hasLoaded(),
			itemService.hasLoadedOffice()
		]).then(() => {
			this.doRefresh();
			loader.dismiss();
		});
	}

	doRefresh(refresher?: any): void {
		let catCount = 0,
				itemCount = 0,
				itemsLength = 0;
		this.categories = this.catService.listCategories();
		this.categories.forEach((category) => {
			let catId = category.$key;
			this.items[catId] = this.itemService.listOfficeItemsByCat(catId);
			itemsLength += this.items[catId].length;
			this.items[catId].forEach((item) => {
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
				if (catCount === this.categories.length
						&& itemCount === itemsLength) {
					if (refresher) refresher.complete();
				}
			});
			catCount++;
			if (catCount === this.categories.length
					&& itemCount === itemsLength) {
				if (refresher) refresher.complete();
			}
		});
	}

	itemTapped(event: any, item: Item): void {
		this.navCtrl.push(OfficeItemDetailPage, {
			item: item
		});
	}

}

