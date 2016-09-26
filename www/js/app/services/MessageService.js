'use strict';

angular.module('lf.services.message', [])
.service('MessageService', function($rootScope, $firebaseObject, $firebaseArray, constants, UserService) {

	var _ref;
	var _messages;

	this.loaded = function() {
		_ref = firebase.database().ref('messages');
		_messages = $firebaseArray(_ref);
		return _messages.$loaded();
	};

	this.getMessage = function(messageId) {
		var msg = _messages.$getRecord(messageId);
		var msgCopy = JSON.parse(JSON.stringify(msg));
		msgCopy.user = UserService.getUser(msg.user);
		return msgCopy;
	};

	this.getMessagesByCompositeItemId = function(itemId) {
		var itemArray = $firebaseArray(_ref.orderByChild('item').equalTo(itemId));
		return itemArray.$loaded();
	};

	this.createMessage = function(message) {
		message.createDate = firebase.database.ServerValue.TIMESTAMP,
		message.user =  $rootScope.data.currentUser.$id
		return _messages.$add(message);
	};

	this.removeMessages = function(messageKeys) {
		for (var key in messageKeys) {
			var index = _messages.$indexFor(key);
			_messages.$remove(index);
		}
	};

});

