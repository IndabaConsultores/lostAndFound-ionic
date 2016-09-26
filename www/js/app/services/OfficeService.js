'use strict';

angular.module('lf.services.office', [])
.service('OfficeService', function ($rootScope, $firebaseObject, $firebaseArray, constants) {

	this.getOffice = function() {
		var promise = new Promise(function(resolve, reject) {
			var officeRef = firebase.database().ref('offices').child(constants.OFFICE_ID);
			officeRef.once('value').then(function(snapshot) {
				var office = snapshot.val();
				office.$id = snapshot.key;
				//office.logo = 'img/logo.png';
				//office.color1 = 'gray';
				//office.color2 = 'blue';
				//office.phoneNumber = '943123456';
				//office.emailAddress = 'lostandfound@indaba.es';
				resolve(office);
			});
			setTimeout(function() {
				reject(new Error('loadOffice timed out'));
			}, 100000);
		});
		return promise;
	};

});

