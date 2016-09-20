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
				item.cover = ImageService.getImage(coverId);
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
					var image = images[i];
					image.item = 'alert' + itemRef.key;
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

	/*

	this.fetchAlerts = function(cb) {
		var alertsRef = firebase.database().ref('items/alert');
		var resultItems = [];
		alertsRef.once('value').then(function(alertsSnap) {
			var count = 0;
			var alerts = alertsSnap.val();
			var userRef = firebase.database().ref('users');
			var imgRef = firebase.database().ref('images');
			for (alertKey in alerts) {
				var item = alerts[alertKey];
				var promises = [];
				promises.push(alertsRef.child(alertKey).once('value'));
				if (item.createdBy) promises.push(userRef.child(item.createdBy).once('value'));
				if (item.images) promises.push(imgRef.child(Object.keys(item.images)[0]).once('value'));
				Promise.all(promises).then(function(results) {
					var item = results[0].val();
					item.$id = results[0].key;
					item.createdBy = results[1].val();
					if (results[2])
						item.cover = results[2].val();
					item.distance = calculateDistance(item.location);
					resultItems.push(item);
					count++;
					if (count == Object.keys(alerts).length)
						cb(null, resultItems);
				});
			}
		});
	};

	this.getAlert = function(alert_id, cb){
		var alertRef = firebase.database().ref('items/alert').child(alert_id);

		alertRef.once("value", function(snap){
			var item =  snap.val();
			item.$id = snap.key;
			var userRef = firebase.database().ref().child("users").child(item.createdBy);
			var officeRef = firebase.database().ref().child("offices").child(item.office);
			var messagesRef = firebase.database().ref().child("items").child("alert").child(alert_id).child("messages");

			var cover_exists = snap.child("cover").exists();
			if(cover_exists){
				var coverRef = firebase.database().ref().child("images").child(item.cover);
			} else {
				if (item.images) {
					coverRef = firebase.database().ref('images').child(Object.keys(item.images)[0]);
					cover_exists = true;
				}
			}
			async.parallel([
				function(callback){
					userRef.once('value', function(user_snap){
						callback(null,user_snap.val());
					});
				},
				function(callback){
					officeRef.once('value', function(office_snap){
						callback(null,office_snap.val());
					});
				},
				function(callback){
					if(cover_exists){
						coverRef.once('value', function(cover_snap){
							callback(null,cover_snap.val());
						});
					}else{
						callback(null,null);
					}
				},
				function(callback){
					messagesRef.once('value',function(messages_snap){
						callback(null,messages_snap.numChildren());
					});
				}
			],
			function(err, results){
				if(!!err){
					cb(err,null);
				}else{
					item.createdBy = results[0];
					item.office = results[1];
					item.cover = results[2];
					item.messages_length = results[3];
					cb(null,item);
				}
			});
		});
	};

	this.getFoundItem = function(found_item_id, cb){
		var alertRef = firebase.database().ref('items/office/' + found_item_id);

		alertRef.on('value', function(snap){
			var alert =  snap.val();
			alert.$id = snap.key;
			var userRef = firebase.database().ref().child("users").child(alert.createdBy);
			var officeRef = firebase.database().ref().child("offices").child(alert.office);
			var messagesRef = firebase.database().ref().child("items").child("office").child(found_item_id).child("messages");

			var cover_exists = snap.child("cover").exists();
			if(cover_exists){
				var coverRef = firebase.database().ref().child("images").child(alert.cover);
			} else if (alert.images) {
				var coverRef = firebase.database().ref('images').child(Object.keys(alert.images)[0]);
				cover_exists = true;
			}
			async.parallel([
				function(callback){
					userRef.once("value", function(user_snap){
						callback(null,user_snap.val());
					});
				},
				function(callback){
					officeRef.once("value", function(office_snap){
						callback(null,office_snap.val());
					});
				},
				function(callback){
					if(cover_exists){
						coverRef.once("value", function(cover_snap){
							callback(null,cover_snap.val());
						});
					}else{
						callback(null,null);
					}
				},
				function(callback){
					messagesRef.once("value",function(messages_snap){
						callback(null,messages_snap.numChildren());
					});
				}
			],
			function(err, results){
				if(!!err){
					cb(err,null);
				}else{
					alert.createdBy = results[0];
					alert.office = results[1];
					alert.cover = results[2];
					alert.messages_length = results[3];
					cb(null,alert);
				}
			});
		});
	};

	this.newAlertItem = function(new_item,cb) {
		var alertRef = $firebaseArray(firebase.database().ref('items/alert'));
		alertRef.$add(new_item).then(function(ref) {
			var id = ref.key;
			//alertRef[alertRef.$indexFor(id)].id = id; // returns location in the array
			alertRef.$save(alertRef.$indexFor(id)).then(function(){
				cb(null,true);
			});
		});
	};

	this.foundItemsByCategory = function(category_id,cb){
		firebase.database().ref('categories').child(category_id).child('items/office').once('value')
		.then(function(snapshot) {
			var catItems = snapshot.val();
			var officeItemsRef = firebase.database().ref('items/office/');
			var promises = [];
			for (itemId in catItems) {
				promises.push($firebaseObject(officeItemsRef.child(itemId)).$loaded());
			}
			return Promise.all(promises);
		}).then(function(itemsArray){

			async.times(itemsArray.length, function(n, next){
				if (itemsArray[n].images) {
					var coverRef = firebase.database().ref('images').child(Object.keys(itemsArray[n].images)[0]);
					coverRef.on('value', function(coverSnap){
						itemsArray[n].cover = coverSnap.val();
						next(null,coverSnap.val());
					});
				} else {
					next(null, null);
				}
			}, function(err, users) {
				cb(itemsArray);
			});
		});
	};

	this.fetchFoundItems = function(cb) {
		if (firebase.apps.length == 0)
			cb(null, null);

		var categories = firebase.database().ref('categories').orderByChild('office').equalTo(constants.OFFICE_ID);

		categories.once('value',function(snap){
			var num_categories = snap.numChildren(),
				all_items = [],
				readed = 0;

			categories.on('child_added', function(catSnap){
				service.foundItemsByCategory(catSnap.key, function(item_list){
					
					var cat = catSnap.val();
					cat.items = item_list;
					all_items.push(cat);
					readed += 1;

					if(readed === num_categories){
						cb(null,all_items);
					}
				});
			});
		});
	};
	*/

});

