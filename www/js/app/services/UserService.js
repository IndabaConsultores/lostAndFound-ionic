'use strict';

angular.module('lf.services.user', [])
.service('UserService', function($firebaseArray) {

	var _ref;
	var _users;

	this.loaded = function() {
		_ref = firebase.database().ref('users');
		_users = $firebaseArray(_ref);
		return _users.$loaded();
	};

	this.getUser = function(userId) {
		var userOrig = _users.$getRecord(userId);
		return JSON.parse(JSON.stringify(userOrig));
	}

	this.saveUser = function(user) {
		return _users.$save(user);
	}

});

