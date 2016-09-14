
angular.module('lf.services.office', [])
.factory('OfficeService', function ($rootScope,$firebaseObject,$firebaseArray,constants) {
	var service = {

		loadOffice: function (cb) {
			var my_office = $firebaseObject(firebase.database().ref('offices/' + constants.OFFICE_ID));
			console.log('loadOffice');
			my_office.$loaded().then(function () {
				cb(null,my_office);
			}).catch(function(error) {
				console.log(error);
				cb(error, null);
			});;
		},

		getAlertMessageCount: function(item_id,cb){
			var messagesRef = firebase.database().ref('items/alert/'+item_id+'/messages');
			var messagesLen = $firebaseArray(messagesRef);

			messagesLen.$loaded().then(function(messagesLen){
				cb(null,messagesLen.length);
			});
		},

		getOfficeMessageCount: function(item_id,cb){
			var messagesRef = firebase.database().ref('items/office' + item_id + '/messages');
			var messagesLen = $firebaseArray(messagesRef);
			messagesLen.$loaded().then(function(messagesLen){
				cb(null,messagesLen.length);
			});
		},

		getAlertMessages: function(item_id,cb){
			var itemMsgsRef = firebase.database().ref('items/alert/'+item_id+'/messages');
			itemMsgsRef.once('value').then(function(itemMsgSnap) {
				var itemMsgsKeys = itemMsgSnap.val();
				if (itemMsgsKeys) {
					var itemMsgPromises = [];
					var msgRef = firebase.database().ref('messages');
					return msgRef.orderByChild('createDate').once('value').then(function(msgsSnap) {
						var msgs = msgsSnap.val();
						for (msgKey in msgs) {
							if (itemMsgsKeys.hasOwnProperty(msgKey))
								itemMsgPromises.push($firebaseObject(msgsSnap.ref.child(msgKey)));
						}
						return Promise.all(itemMsgPromises);
					});
				} else {
					var messages = [];
					return messages;
				}
			}).then(function(messages){
				console.log(messages);
				cb(null,messages);
			},function(error){
				console.log(error);
				cb(error,null)
			});

		},

		getOfficeMessages: function(item_id,cb){
			var itemMsgsRef = firebase.database().ref('items/office/'+item_id+'/messages');
			itemMsgsRef.once('value').then(function(itemMsgSnap) {
				var itemMsgsKeys = itemMsgSnap.val();
				if (itemMsgsKeys) {
					var itemMsgPromises = [];
					var msgRef = firebase.database().ref('messages');
					return msgRef.orderByChild('createDate').once('value').then(function(msgsSnap) {
						var msgs = msgsSnap.val();
						for (msgKey in msgs) {
							if (itemMsgsKeys.hasOwnProperty(msgKey))
								itemMsgPromises.push($firebaseObject(msgsSnap.ref.child(msgKey)));
						}
						return Promise.all(itemMsgPromises);
					});
				} else {
					var messages = [];
					return messages;
				}
			}).then(function(messages){
				console.log(messages);
				cb(null,messages);
			},function(error){
				console.log(error);
				cb(error,null)
			});
		},

		postAlertMessage: function(msg,item_id,cb){
			console.log("postAlertMessage");
			/*
			Crear una entrada de en /messages/alert/
			* createdAt: Date.now()
			* id: el id que me de
			* item: item_id
			* text: msg
			* updatedAt: Date.now()
			* user: $rootScope.currentUser.id
							
			Crear una entrada en /items/alert/$item_id/messages
			* id_del mensaje anterior: true
			*/
			var messagesRef = $firebaseArray(firebase.database().ref().child("messages").child("alert"));
			messagesRef.$add({ 
				"createdAt": Date.now(), 
				"item": item_id, 
				"text": msg, 
				"updatedAt": Date.now(), 
				"user":$rootScope.currentUser.id 
			}).then(function(ref) {
				var id = ref.key();
				console.log("added record with id " + id);
				messagesRef[messagesRef.$indexFor(id)].id = id; // returns location in the array
				messagesRef.$save(messagesRef.$indexFor(id)).then(function(){
					console.log("id saved");
				});
				var itemMessagesRef = firebase.database().ref().child("items").child("alert").child(item_id).child("messages");
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
						var itemRef = firebase.database().ref().child("items").child("alert").child(item_id);
						itemRef.update(msg, function(){
							cb(null,true);
						});
					}
				});
			});
		},

		postOfficeMessage: function(msg,item_id,cb){
			console.log("postAlertMessage");
			/*
			Crear una entrada de en /messages/alert/
			* createdAt: Date.now()
			* id: el id que me de
			* item: item_id
			* text: msg
			* updatedAt: Date.now()
			* user: $rootScope.currentUser.id
							
			Crear una entrada en /items/alert/$item_id/messages
			* id_del mensaje anterior: true
			*/
			var messagesRef = $firebaseArray(firebase.database().ref().child("messages").child("office"));
			messagesRef.$add({ 
				"createdAt": Date.now(), 
				"item": item_id, 
				"text":msg, 
				"updatedAt": Date.now(), 
				"user":$rootScope.currentUser.id 
			}).then(function(ref) {
				var id = ref.key();
				console.log("added record with id " + id);
				messagesRef[messagesRef.$indexFor(id)].id = id; // returns location in the array
				messagesRef.$save(messagesRef.$indexFor(id)).then(function(){
					console.log("id saved");
				});
				var itemMessagesRef = firebase.database().ref().child("items").child("office").child(item_id).child("messages");

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
						var itemRef = firebase.database().ref().child("items").child("office").child(item_id);
						itemRef.update(msg, function(){
							cb(null,true);
						});
					}
				});
			});
		},

		postPictureOnAlertMessage: function(picture_item,cb){
			var messagesRef = $firebaseArray(firebase.database().ref().child("messages").child("alert"));
			var picture = {};
			picture["image"] = picture_item.image;
			picture["thumbnail"] = picture_item.thumb;
			console.log(picture_item);
			var new_obj = { 
				"createdAt": Date.now(), 
				"item": picture_item.item_id, 
				"picture": picture, 
				"updatedAt": Date.now(), 
				"user":$rootScope.currentUser.id 
			};
			console.log(new_obj);
			messagesRef.$add(new_obj).then(function(ref) {
				var id = ref.key();
				console.log("added record with id " + id);
				messagesRef[messagesRef.$indexFor(id)].id = id; // returns location in the array
				messagesRef.$save(messagesRef.$indexFor(id)).then(function(){
					console.log("id saved");
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
		},

		postPictureOnOfficeMessage: function(picture_item,cb){
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
				console.log("added record with id " + id);
				messagesRef[messagesRef.$indexFor(id)].id = id; // returns location in the array
				messagesRef.$save(messagesRef.$indexFor(id)).then(function(){
					console.log("id saved");
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
		}
	}

	return service;
});

