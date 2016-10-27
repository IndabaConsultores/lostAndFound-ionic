import { Injectable } from '@angular/core';
import { AngularFire, FirebaseListObservable } from 'angularfire2';

import { Message } from '../models/message';

@Injectable()
export class MessageService {

	constructor(
		public af: AngularFire,
	) { }

	getObservableMessageListByItemId(itemId: string): FirebaseListObservable<Message[]> {
		let query = {
			query: {
				orderByChild: 'item',
				equalTo: itemId
			}
		}
		return this.af.database.list('messages', query);
	}

	createMessage(message: Message): Promise<any> {
		console.log('createMessage');
		return new Promise((resolve, reject) => {
			setTimeout(() => resolve(), 1000);
		});
	}

}

