'use strict';

angular.module('lf.services.office', [])
.service('OfficeService', function ($rootScope, $firebaseObject, $firebaseArray, constants) {

	this.getOffice = function() {
		var promise = new Promise(function(resolve, reject) {
			var officeRef = firebase.database().ref('offices').child(constants.OFFICE_ID);
			officeRef.once('value').then(function(snapshot) {
				var office = snapshot.val();
				office.$id = snapshot.key;
				$rootScope.office = office;
				$rootScope.style = '.bar.bar-dark, .tabs { background-color:' + $rootScope.office.color1 + '!important;}';
				$rootScope.style += 'ion-content { background-color:' + $rootScope.office.color2 + ';}';
				resolve(office);
			});
			setTimeout(function() {
				reject(new Error('loadOffice timed out'));
			}, 100000);
		});
		return promise;
	};

});

