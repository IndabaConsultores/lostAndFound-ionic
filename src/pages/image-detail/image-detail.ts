import { Component } from '@angular/core'
import { Observable } from 'rxjs';

import { NavParams } from 'ionic-angular';

import { Image } from '../../models/image';

@Component({
	selector: 'image-detail',
	templateUrl: 'image-detail.html'
})
export class ImageDetailPage {

	image: Observable<Image>;

	constructor(
		navParams: NavParams,
	) {
		this.image = navParams.get('image');
	}
}

