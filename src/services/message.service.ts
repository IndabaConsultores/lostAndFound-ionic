import { Injectable } from '@angular/core';
import { AngularFire, FirebaseListObservable } from 'angularfire2';

import { Message } from '../models/message';
import { Item } from '../models/item';

import { AuthService } from './auth.service';
import { Constants } from '../app/app.constants';

@Injectable()
export class MessageService {

	private _observableMessages: Map<String, FirebaseListObservable<Message[]>>;

	constructor(
		private af: AngularFire,
		private authService: AuthService,
		private constants: Constants
	) {
		this._observableMessages = new Map<String, FirebaseListObservable<Message[]>>();
	}

	getObservableMessageListByItemId(itemId: string): FirebaseListObservable<Message[]> {
		let query: Object = {
			query: {
				orderByChild: 'item',
				equalTo: itemId
			}
		}
		let messageList = this._observableMessages.get(itemId);
		if (!messageList) {
			messageList = this.af.database.list('messages', query);
			this._observableMessages.set(itemId, messageList);
		}
		return messageList;
	}

	createMessage(message: Message, item?: Item): firebase.database.ThenableReference {
		message.createDate = firebase.database['ServerValue']['TIMESTAMP'];
		message.modifiedDate = firebase.database['ServerValue']['TIMESTAMP'];

		message.user = this.authService.getCurrentUser().uid;
		message.office = String(this.constants.OFFICE_ID);

		let itemId: string = message.item || item.$key;
		return this._observableMessages.get(itemId).push(message);
	}

}

