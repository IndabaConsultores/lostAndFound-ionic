import { Component, Output, EventEmitter } from '@angular/core';
import { TranslateService } from 'ng2-translate';

import { ActionSheetController } from 'ionic-angular';
import { Camera } from 'ionic-native';


declare var document: any;

@Component({
	selector: 'image-selector',
	templateUrl: 'image-selector.html'
})
export class ImageSelectorComponent {

	@Output()
	onImageTaken: EventEmitter<any> = new EventEmitter<any>();

	private actionSheet: any;

	constructor(
		public actionSheetCtrl: ActionSheetController,
		public translate: TranslateService
	) { }

	showActionSheet(): void {
		this.actionSheet = this.actionSheetCtrl.create();
		this.translate.get('image_selector.title').subscribe((title) => {
			this.actionSheet.setTitle(title);
		});
		this.translate.get('image_selector.camera').subscribe((text) => {
			this.actionSheet.addButton({
					text: text,
					handler: () => {
						Camera.getPicture({
							destinationType: 0, //DATA_URL - base64-encoded string
							sourceType: 1,      //CAMERA
							targetWidth: 360,
							targetHeight: 360
						}).then((imageURI) => {
							this.onImageTaken.emit({
								imageURI: 'data:image/jpeg;base64,' + imageURI
							});
						}).catch((error) => console.log(error));
					}
			});
		});
		this.translate.get('image_selector.gallery').subscribe((text) => {
			this.actionSheet.addButton({
					text: text,
					handler: () => {
						Camera.getPicture({
							destinationType: 0, //DATA_URL - base64-encoded string
							sourceType: 0,      //PHOTOLIBRARY
							targetWidth: 360,
							targetHeight: 360
						}).then((imageURI) => {
							this.onImageTaken.emit({
								imageURI: 'data:image/jpeg;base64,' + imageURI
							});
						}).catch((error) => console.log(error));
					}
				}
			);
		});
		this.translate.get('image_selector.cancel').subscribe((cancel) => {
			this.actionSheet.addButton({
				text: cancel,
				role: 'cancel'
			});
		});
		this.actionSheet.present();
	}

	resizeImage(imageURI: string): string {
		let img = new Image();
		img.src = 'data:image/jpeg;base64,' + imageURI;
		let canvas = document.createElement('canvas');
		if (img.naturalWidth > img.naturalHeight) {
			canvas.width = 320;
			canvas.height = 320 * img.naturalHeight/img.naturalWidth;
		} else {
			canvas.width = 320 * img.naturalWidth/img.naturalHeight;
			canvas.height = 320;
		}
		let ctx = canvas.getContext('2d');
		let scaleFactor = canvas.width/img.naturalWidth;
		ctx.scale(scaleFactor, scaleFactor);
		ctx.drawImage(img, 0, 0);
		return canvas.toDataURL('image/jpeg', 0.8);
	}

}

