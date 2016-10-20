Lost & Found Ionic App
=====================

Lost & Found project for [Ionic 2](http://ionic.io/2 "Ionic 2").

## Requirements

### NPM

This projects uses `npm` as a dependency manager. 
Install [npm](https://docs.npmjs.com/getting-started/installing-node).

### Ionic

Make sure `ionic` and `cordova` are installed and the version of `ionic` is 2.*.*:
```bash
$ sudo npm install -g ionic cordova

$ ionic -v
2.1.1
```

## Using this project
Fill the constants file with your data:
```javascript
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
```

Install the dependencies with `npm` and preview it with the `ionic` CLI:

```bash
$ npm install

$ ionic serve
```

