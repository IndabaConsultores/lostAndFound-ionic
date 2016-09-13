
angular.module('lf.services.item', [])

.factory('ItemService', function ($firebaseArray, $firebaseObject, constants) {
	var service = {

		fetchAlerts: function (cb) {
			var alerts = firebase.database().ref('items/alert')
			alerts.once('value').then(function(snapshot){
				var alert_num = snapshot.numChildren(),
					final_alerts = [],
					readed = 0;
				firebase.database().ref('items/alert').on('child_added', function(alert) {
					var alertId = alert.key,
						alertData = alert.val(),
						user = firebase.database().ref('users').child(alertData.createdBy);
					var cover_exists = alert.child('cover').exists();
					if(cover_exists){
						var cover = firebase.database().ref('images').child(alertData.cover);    
					} else {
						if (alert.val().images) {
							cover = firebase.database().ref('images').child(Object.keys(alert.val().images)[0]);
							cover_exists = true;
						}
					}
					async.parallel([
						function(callback){
							if(cover_exists){
								cover.on('value', function(cover_image_snap){
									callback(null,cover_image_snap.val());
								});    
							}else{
								callback(null,null);
							}
						},
						function(callback){
							user.on('value', function(user_snap){
								callback(null,user_snap.val());
							});
						}
						],
						function(err, results){
							if(!!err){
								cb(err,null);
							}else{
								alertData.id = alertId;
								alertData.cover = results[0];
								alertData.createdBy = results[1];
								final_alerts.push(alertData);
								readed++;
								if(readed === alert_num){
									cb(null,final_alerts);
								}
							}
					});
				});
			});
		},


		getAlert: function(alert_id, cb){
			var alertRef = firebase.database().ref('items/alert').child(alert_id);

			alertRef.once("value", function(snap){
				var alert =  snap.val();
				alert.$id = snap.key;
				var userRef = firebase.database().ref().child("users").child(alert.createdBy);
				var officeRef = firebase.database().ref().child("offices").child(alert.office);
				var messagesRef = firebase.database().ref().child("items").child("alert").child(alert_id).child("messages");

				var cover_exists = snap.child("cover").exists();
				if(cover_exists){
					var coverRef = firebase.database().ref().child("images").child(alert.cover);
				} else {
					if (alert.images) {
						coverRef = firebase.database().ref('images').child(Object.keys(alert.images)[0]);
						cover_exists = true;
					}
				}
				async.parallel([
					function(callback){
						userRef.on("value", function(user_snap){
							callback(null,user_snap.val());
						});
					},
					function(callback){
						officeRef.on("value", function(office_snap){
							callback(null,office_snap.val());
						});
					},
					function(callback){
						if(cover_exists){
							coverRef.on("value", function(cover_snap){
								callback(null,cover_snap.val());
							});
						}else{
							callback(null,null);
						}
					},
					function(callback){
						messagesRef.on("value",function(messages_snap){
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
		},

		getFoundItem: function(found_item_id, cb){
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
						userRef.on("value", function(user_snap){
							callback(null,user_snap.val());
						});
					},
					function(callback){
						officeRef.on("value", function(office_snap){
							callback(null,office_snap.val());
						});
					},
					function(callback){
						if(cover_exists){
							coverRef.on("value", function(cover_snap){
								callback(null,cover_snap.val());
							});
						}else{
							callback(null,null);
						}
					},
					function(callback){
						messagesRef.on("value",function(messages_snap){
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
						console.log(alert);
						cb(null,alert);
					}
				});
			});
		},

		newAlertItem: function(new_item,cb) {
			var alertRef = $firebaseArray(firebase.database().ref('items/alert'));
			alertRef.$add(new_item).then(function(ref) {
				var id = ref.key;
				//alertRef[alertRef.$indexFor(id)].id = id; // returns location in the array
				alertRef.$save(alertRef.$indexFor(id)).then(function(){
					cb(null,true);
				});
			});
		},

		foundItemsByCategory: function(category_id,cb){
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
			
		},

		fetchFoundItems: function(cb) {
			if (firebase.apps.length == 0)
				cb(null, null);

			var categories = firebase.database().ref().child("categories");

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
		}

	}
	return  service;
});
