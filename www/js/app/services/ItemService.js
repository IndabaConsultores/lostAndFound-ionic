'use strict';

angular.module('lf.services.item', [])
.service('ItemService', function ($rootScope, $firebaseArray, $firebaseObject, UserService, ImageService, CategoryService, MessageService, constants) {
	function deg2rad(deg) {
		return (deg/180)*Math.PI;
	};

	function calculateDistance(locationTo) {
		var lat1 = $rootScope.currentLocation.latitude;
		var lat2 = locationTo.latitude;
		var lon1 = $rootScope.currentLocation.longitude;
		var lon2 = locationTo.longitude;

		var R = 6371000;
		var phi1 = deg2rad(lat1);
		var phi2 = deg2rad(lat2);
		var dphi = deg2rad(lat2 - lat1);
		var dlmb = deg2rad(lon2 - lon1);
		
		var a = Math.pow(Math.sin(dphi/2), 2) + Math.cos(phi1) 
			* Math.cos(phi2) * Math.pow(Math.sin(dlmb/2), 2);
		var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

		var d = R * c;
		return Math.round(d*100)/100;
	};

	var _officeRef; 
	var _alertRef;

	var _officeItems;
	var _alertItems; 

	this.loaded = function() {
		_officeRef = firebase.database().ref('items/office');
		_alertRef = firebase.database().ref('items/alert');

		_officeItems = $firebaseArray(_officeRef.orderByChild('office')
			.equalTo(constants.OFFICE_ID));

		_alertItems = $firebaseArray(_alertRef);	
		
		return Promise.all([_officeItems.$loaded(), _alertItems.$loaded()]);
	};

	function _getItem(itemArray, itemId) {
		var item = itemArray.$getRecord(itemId);
		var itemCpy = JSON.parse(JSON.stringify(item));
		if (item) {
			itemCpy.createdBy = UserService.getUser(item.createdBy);
			var images = [];
			for (var imgKey in item.images) {
				var img = ImageService.getImage(imgKey);
				images.push(img);
			}
			itemCpy.images = images;
		}
		return itemCpy;
	};

	function _getItems(itemArray) {
		var itemArrayC = JSON.parse(JSON.stringify(itemArray));
		for (var i=0; i<itemArrayC.length; i++) {
			var item = itemArrayC[i];
			if (item.createdBy) {
				item.createdBy = UserService.getUser(item.createdBy);
			}
			if (item.images) {
				var coverId = Object.keys(item.images)[0];
				item.cover = ImageService.getImage(coverId);
			}
			item.distance = calculateDistance(item.location);
		}
		return itemArrayC;
	};

	this.getAlertItem = function(itemId) {
		return _getItem(_alertItems, itemId);
	};

	this.getOfficeItem = function(itemId) {
		return _getItem(_officeItems, itemId);
	};

	this.getAlertItems = function() {
		return _getItems(_alertItems);
	};

	this.getOfficeItems = function() {
		return _getItems(_officeItems);
	};

	this.getOfficeItemsByCat = function(catId) {
		var items = [];
		var cat = CategoryService.getCategory(catId);
		for (var itemId in cat.items.office) {
			var itemOrig = _officeItems.$getRecord(itemId);
			var item = JSON.parse(JSON.stringify(itemOrig));
			if (item.createdBy) {
				item.createdBy = UserService.getUser(item.createdBy);
			}
			if (item.images) {
				var coverId = Object.keys(item.images)[0];
				var image = ImageService.getImage(coverId);
				item.cover = image.image;
			}
			items.push(item);
		}
		return items;
	};

	this.createAlertItem = function(item, images) {
		item.type = 'alert';
		item.createDate = firebase.database.ServerValue.TIMESTAMP;
		item.office = constants.OFFICE_ID;
		item.createdBy = $rootScope.data.currentUser.$id;
		return _alertItems.$add(item).then(function(itemRef) {
			item = _alertItems.$getRecord(itemRef.key);
			var promises = [];
			if (images) {
				for (var i=0; i<images.length; i++) {
					var image = {};
					image.image = images[i];
					image.item = 'alert/' + itemRef.key;
					promises.push(ImageService.createImage(image));
				}
			}
			return Promise.all(promises);
		}).then(function(refs) {
			item.images = {};
			for (var i=0; i<refs.length; i++) {
				var imRef = refs[i].key;
				item.images[imRef] = true;
			}
			return _alertItems.$save(item);
		});
	};

	this.addMessage = function(item, message) {
		var msgKey
		var itemArray;
		var itemType;
		if (_alertItems.$getRecord(item.$id)) {
			itemType = 'alert';
			itemArray = _alertItems;
		} else {
			itemType = 'office';
			itemArray = _officeItems;
		}
		message.item = itemType + '/' + item.$id;
		return MessageService.createMessage(message).then(function(msgRef) {
			msgKey = msgRef.key;
			var itemOrig = itemArray.$getRecord(item.$id);
			if (!itemOrig.messages) {
				itemOrig.messages = {};
			}
			itemOrig.messages[msgKey] = true;
			return itemArray.$save(itemOrig);
		}).then(function(itemRef) {
			return msgKey;
		});
	};

	this.deleteAlertItem = function(item) {
		var index = _alertItems.$indexFor(item.$id);
		UserService.removeFavorite(item.$id);
		ImageService.removeImages(item.images);
		MessageService.removeMessages(item.messages);
		return _alertItems.$remove(index);
	};

});

