import { Injectable } from '@angular/core';

//Firebase database configuration
export const FirebaseConfig = {
	apiKey: "<API-KEY>",
	authDomain: "<APP-NAME>.firebaseapp.com",
	databaseURL: "https://<APP-NAME>.firebaseio.com",
	storageBucket: "<APP-NAME>.appspot.com"
}

@Injectable()
export class Constants {
	OFFICE_ID = <OFFICE_ID>; //Id number of the Office entity in Firebase
}

