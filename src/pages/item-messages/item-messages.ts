import { Component, ViewChild, AfterViewInit } from '@angular/core';

import { Content, NavController, NavParams } from 'ionic-angular';

import { Item } from '../../models/item';
import { Message } from '../../models/message';

import { AuthService } from '../../services/auth.service';
import { MessageService } from '../../services/message.service';
import { UserService } from '../../services/user.service';

@Component({
	selector: 'item-messages',
	templateUrl: 'item-messages.html'
})
export class ItemMessagesPage implements AfterViewInit {

	@ViewChild(Content) content: Content;
	messages: Message[];
	users: Object;

	message: Message;

	constructor(
		public navCtrl: NavController,
		public navParams: NavParams,
		public authService: AuthService,
		public userService: UserService,
		public msgService: MessageService
	) {
		this.messages = [];
		this.users = {};
		this.message = new Message();
		console.log(this.message);
	}

	ngAfterViewInit(): void {
		let item: Item = this.navParams.get('item');
		let itemType: string = (item.type === 'lost' || item.type === 'found')
			? 'alert' : 'office';
		let itemId: string = itemType + '/' + item.$key;
		let observable = this.msgService.getObservableMessageListByItemId(itemId);
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
		console.log('Send message: ', this.message);
	}

}

