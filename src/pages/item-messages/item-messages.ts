import { Component, ViewChild, AfterViewInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { Content, NavController, NavParams } from 'ionic-angular';
import { FirebaseAuthState } from 'angularfire2';

import { Item } from '../../models/item';
import { Message } from '../../models/message';
import { Image } from '../../models/image';

import { AuthService } from '../../services/auth.service';
import { ItemService } from '../../services/item.service';
import { UserService } from '../../services/user.service';

import { LoginPage } from '../login/login';
import { ImageDetailPage } from '../image-detail/image-detail';

@Component({
	selector: 'item-messages',
	templateUrl: 'item-messages.html'
})
export class ItemMessagesPage implements AfterViewInit {

	@ViewChild(Content) content: Content;
	messages: Message[];
	users: Object;

	message: Message;
	textAreaDisabled: boolean = false;

	constructor(
		private navCtrl: NavController,
		private navParams: NavParams,
		private authService: AuthService,
		private userService: UserService,
		private itemService: ItemService
	) {
		this.messages = [];
		this.users = {};
		this.message = new Message();
	}

	ngAfterViewInit(): void {
		let item: Item = this.navParams.get('item');
		let observable = this.itemService.getObservableMessageList(item);
		observable.subscribe((messages) => {
			this.messages = messages;
			messages.forEach((message) => {
				let userId: string = message.user;
				if (!this.users[userId]) {
					this.userService.getUser(userId).then((user) => {
						this.users[userId] = user;
					});
				}
			});
			this.content.scrollToBottom();
		});
	}

	isCurrentUser(userId: string): boolean {
		let currentUser = this.authService.getCurrentUser();
		return (currentUser && userId === currentUser.uid);
	}

	profileClass(message: Message): string {
		return this.isCurrentUser(message.user)
			? 'profile-pic right' : 'profile-pic left';
	}

	chatBubbleClass(message: Message): string {
		return this.isCurrentUser(message.user)
			? 'chat-bubble right' : 'chat-bubble left';
	}

	sendMessage(): void {
		let item: Item = this.navParams.get('item');
		this.textAreaDisabled = true;
		this.itemService.addMessage(item, this.message).then(() => {
			this.message = new Message();
			this.textAreaDisabled = false;
		});
	}

	goToLogin(): void {
		this.navCtrl.push(LoginPage);
	}

	addImage(imageURI: any): void {
		this.message.picture = imageURI;
	}

	showPicture(event: any, imageURI: string): void {
		let image = new Image();
		image.image = imageURI;
		let observable = Observable.of(image);
		this.navCtrl.push(ImageDetailPage, {
			image: observable
		});
	}

	getCurrentUser(): FirebaseAuthState {
		return this.authService.getCurrentUser();
	}

}

