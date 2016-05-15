angular.module('lf.services.item', [])

    .factory('ItemService', function ($rootScope,$firebaseArray,constants) {
        $rootScope.item;

        var service = {

            fetchAlerts: function (cb) {

                var alerts = $rootScope.ref.child("items").child("alert");

                alerts.on("value", function(snapshot){

                    var alert_num = snapshot.numChildren(),
                        final_alerts = [],
                        readed = 0;

                    $rootScope.ref.child("items").child("alert").on("child_added", function(alert){          
                        var alertId = alert.key(),
                            alertData = alert.val(),

                            user = $rootScope.ref.child("users").child(alertData.createdBy);

                            var cover_exists = alert.child("cover").exists();
                            
                            if(cover_exists){
                                var cover = $rootScope.ref.child("images").child(alertData.cover);    
                            }

                            
                            

                        async.parallel([
                            function(callback){
                                if(cover_exists){
                                    cover.on("value", function(cover_image_snap){
                                        callback(null,cover_image_snap.val());
                                    });    
                                }else{
                                    callback(null,null);
                                }
                            },
                            function(callback){
                                user.on("value", function(user_snap){
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
                var alertRef = $rootScope.ref.child("items").child("alert").child(alert_id);

                alertRef.on("value", function(snap){
                    var alert =  snap.val();
                    var userRef = $rootScope.ref.child("users").child(alert.createdBy);
                    var officeRef = $rootScope.ref.child("offices").child(alert.office);
                    var messagesRef = $rootScope.ref.child("items").child("alert").child(alert_id).child("messages");

                    var cover_exists = snap.child("cover").exists();
                    if(cover_exists){
                        var coverRef = $rootScope.ref.child("images").child(alert.cover);
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
                var alertRef = $rootScope.ref.child("items").child("office").child(found_item_id);

                alertRef.on("value", function(snap){
                    var alert =  snap.val();
                    var userRef = $rootScope.ref.child("users").child(alert.createdBy);
                    var officeRef = $rootScope.ref.child("offices").child(alert.office);
                    var messagesRef = $rootScope.ref.child("items").child("office").child(found_item_id).child("messages");

                    var cover_exists = snap.child("cover").exists();
                    if(cover_exists){
                        var coverRef = $rootScope.ref.child("images").child(alert.cover);
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
/*
                var new_item = {
                    "type": "alert",
                    "createdBy": $rootScope.currentUser,
                    "picture": null,
                    "office": $rootScope.office,
                    "name": $scope.newalert.name,
                    "description": $scope.newalert.description,
                    "alertlocation": alertlocation
                };
*/

                var alertRef = $firebaseArray($rootScope.ref.child("items").child("alert"));
                console.log(new_item);
                alertRef.$add(new_item).then(function(ref) {
                  var id = ref.key();
                  console.log("added record with id " + id);
                  //alertRef[alertRef.$indexFor(id)].id = id; // returns location in the array
                  alertRef.$save(alertRef.$indexFor(id)).then(function(){
                    cb(null,true);
                  });
                });




            },

            foundItemsByCategory: function(category_id,cb){

                console.log(category_id);

                var officeItems = new Firebase.util.NormalizedCollection(
                          $rootScope.ref.child('categories').child(category_id).child('items'),
                          $rootScope.ref.child('items').child('office')
                        ).select('office.name',
                                 'office.cover',
                                 'office.createdAt',
                                 'office.description').ref();

                var itemsArray = $firebaseArray(officeItems);
                console.log(itemsArray);
                itemsArray.$loaded(function(){

                    async.times(itemsArray.length, function(n, next){
                        console.log(n);
                        var coverRef = $rootScope.ref.child("images").child(itemsArray[n].cover);
                        coverRef.on("value", function(coverSnap){
                            itemsArray[n].cover = coverSnap.val();
                            next(null,coverSnap.val());
                        });
                    }, function(err, users) {
                        cb(itemsArray);
                    });
                });
                
            },

            fetchFoundItems: function(cb) {

                var categories = $rootScope.ref.child("categories");

                categories.on("value",function(snap){
                    
                    var num_categories = snap.numChildren(),
                        all_items = [],
                        readed = 0;

                    categories.on("child_added", function(item){
                        //console.log(item.key());
                        //console.log(item.val());

                        service.foundItemsByCategory(item.key(), function(item_list){
                            console.log(item_list);
                            
                            var cat = item.val();
                            cat.items = item_list;
                            
                            all_items.push(cat);
                            readed += 1;
                            console.log(num_categories);
                            console.log(readed);
                            if(readed === num_categories){
                                console.log(all_items);
                                cb(null,all_items);
                            }
                        });

                    });

                });

            }

        }
        return  service;
    });