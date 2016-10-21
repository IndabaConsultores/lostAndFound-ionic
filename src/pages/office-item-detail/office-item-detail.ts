import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { TranslateService } from 'ng2-translate/ng2-translate';

import { NavController, LoadingController, NavParams } from 'ionic-angular';

import { OfficeService } from '../../services/office.service';
import { ItemService } from '../../services/item.service';
import { ImageService } from '../../services/image.service';

import { Office } from '../../models/office';
import { Item } from '../../models/item';
import { Image } from '../../models/image';

import { ImageDetailPage } from '../image-detail/image-detail';

@Component({
	selector: 'office-item-detail',
	templateUrl: 'office-item-detail.html'
})
export class OfficeItemDetailPage {

	office: Observable<Office>;
	item: Item;
	images: Observable<Image>[];
	numMessages: number;

	constructor(
		public navCtrl: NavController,
		public navParams: NavParams,
		public loadingCtrl: LoadingController,
		public translate: TranslateService,
		public officeService: OfficeService,
		public itemService: ItemService,
		public imageService: ImageService
	) {
		this.item = navParams.get('item');
		if (this.item.messages) {
			this.numMessages = Object.keys(this.item.messages).length;
		} else {
			this.numMessages = 0;
		}
		this.office = officeService.getObservableOffice();
		this.images = [];
		if (this.item.images) {
			let imageIds = Object.keys(this.item.images);
			imageIds.forEach((imageId) => {
				this.images.push(imageService.getObservableImage(imageId));
			});
		} else {
			let image = new Image();
			image.image = 'assets/img/no-image.png';
			this.images.push(Observable.of(image));
		}
	}

	showPicture(event: any, image: Observable<Image>): void {
		this.navCtrl.push(ImageDetailPage, {
			image: image
		});
	}

	goToComments(event: any, item: Item): void {
		console.log('goToComments');
	}

}

