
angular.module('lf.services.office', [])
.factory('OfficeService', function ($rootScope, $firebaseObject, $firebaseArray, constants) {

	var service = {};

	service.getOffice = function() {
		var promise = new Promise(function(resolve, reject) {
			var officeRef = firebase.database().ref('offices').child(constants.OFFICE_ID);
			officeRef.once('value').then(function(snapshot) {
				var office = snapshot.val();
				office.$id = snapshot.key;
				office.logo = 'img/logo.png';
				office.color1 = 'gray';
				office.color2 = 'blue';
				office.phoneNumber = '943123456';
				office.emailAddress = 'lostandfound@indaba.es';
				resolve(office);
			});
			setTimeout(function() {
				reject(new Error('loadOffice timed out'));
			}, 10000);
		});
		return promise;
	};
	service.postPictureOnAlertMessage = function(picture_item,cb){
		var messagesRef = $firebaseArray(firebase.database().ref().child("messages").child("alert"));
		var picture = {};
		picture["image"] = picture_item.image;
		picture["thumbnail"] = picture_item.thumb;
		var new_obj = { 
			"createdAt": Date.now(), 
			"item": picture_item.item_id, 
			"picture": picture, 
			"updatedAt": Date.now(), 
			"user":$rootScope.currentUser.id 
		};
		messagesRef.$add(new_obj).then(function(ref) {
			var id = ref.key();
			messagesRef[messagesRef.$indexFor(id)].id = id; // returns location in the array
			messagesRef.$save(messagesRef.$indexFor(id)).then(function(){
			});
			var itemMessagesRef = firebase.database().ref().child("items").child("alert").child(picture_item.item_id).child("messages");

			itemMessagesRef.once("value", function(snapshot){
				var obj = {};
				obj[id] = true;
									
				if(snapshot.exists()){
					// ya existe algún mensaje
					itemMessagesRef.update(obj,function(){
						cb(null,true);
					});
				}else{
					//crear messages con un elemento en el array
					var msg = {};
					msg["messages"] = obj;
					var itemRef = firebase.database().ref().child("items").child("alert").child(picture.item_id);
					itemRef.update(msg, function(){
						cb(null,true);
					});
				}
			});
		});
	};

	service.postPictureOnOfficeMessage = function(picture_item,cb){
		var messagesRef = $firebaseArray(firebase.database().ref().child("messages").child("office"));
		var picture = {};

		picture["image"] = picture_item.image;
		picture["thumbnail"] = picture_item.thumbnail;
		messagesRef.$add({
			"createdAt": Date.now(),
			"item": picture_item.item_id,
			"picture": picture,
			"updatedAt": Date.now(),
			"user":$rootScope.currentUser.id
		})
		.then(function(ref) {
			var id = ref.key();
			messagesRef[messagesRef.$indexFor(id)].id = id; // returns location in the array
			messagesRef.$save(messagesRef.$indexFor(id)).then(function(){
			});

			var itemMessagesRef = firebase.database().ref().child("items").child("office").child(picture_item.item_id).child("messages");

			itemMessagesRef.once("value", function(snapshot){
				var obj = {};
				obj[id] = true;

				if(snapshot.exists()){
					// ya existe algún mensaje
					itemMessagesRef.update(obj,function(){
						cb(null,true);
					});
				}else{
					//crear messages con un elemento en el array
					var msg = {};
					msg["messages"] = obj;
					var itemRef = firebase.database().ref().child("items").child("office").child(picture_item.item_id);
					itemRef.update(msg, function(){
						cb(null,true);
					});
				}
			});
		});
	};

	return service;
});

