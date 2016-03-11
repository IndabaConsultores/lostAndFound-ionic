angular.module('lf.services.office', [])


    .factory('OfficeService', function ($rootScope,$firebaseObject,$firebaseArray,constants) {
        

        var service = {

            loadOffice: function (cb) {


                var my_office = $firebaseObject($rootScope.ref.child('offices').child("Ke0BYLMdR1"));
                my_office.$loaded().then(function () {
                    cb(null,my_office);
                });

/*
            	var Office = Parse.Object.extend("Office");
            	var query = new Parse.Query(Office);
            	query.equalTo("codeName", "00-indaba");
                //query.equalTo("codeName", "02-oinati");
            	query.find({
                    success: function (results) {
                        cb(null,results[0]);
                    },
                    error: function (object, error) {
                        //alert("Error: " + error.code + " " + error.message);
                        cb(error,null);
                    }
                });
*/                
            },

/*
            getAlertItems: function(cb) {
                var Item = Parse.Object.extend("Item");
                var query = new Parse.Query(Item);
                query.equalTo("type", "alert");
                query.find({
                    success: function(results) {
                      cb(null,results);
                    },
                    error: function(error) {
                      cb(error,null);
                    }
                });
            },
*/

            getFoundItems: function(cb) {
                var Item = Parse.Object.extend("Item");
                var query = new Parse.Query(Item);
                query.equalTo("type", "found");
                query.find({
                    success: function(results){
                        cb(null,results);
                    },
                    error: function(error){
                        cb(error,null);
                    }
                });
            },
/*
            getItem: function(item_id,cb){
                var Item = Parse.Object.extend("Item");
                var query = new Parse.Query(Item);
                query.include('createdBy');
                query.get(item_id, {
                  success: function(item) {
                    cb(null,item);
                  },
                  error: function(object, error) {
                    cb(error,null);
                  }
                });
            },
*/

            getAlertMessageCount: function(item_id,cb){
                var messagesRef = $rootScope.ref.child('items').child('alert').child(item_id).child("messages");
                var messagesLen = $firebaseArray(messagesRef);

                messagesLen.$loaded().then(function(messagesLen){
                    cb(null,messagesLen.length);
                });
            },

            getOfficeMessageCount: function(item_id,cb){
                var messagesRef = $rootScope.ref.child('items').child('office').child(item_id).child("messages");
                var messagesLen = $firebaseArray(messagesRef);

                messagesLen.$loaded().then(function(messagesLen){
                    cb(null,messagesLen.length);
                });
            },


            getMessageCount: function(item_id,cb){

                cb(null,{});

                /*
                var Message = Parse.Object.extend("Message"),
                    Item = Parse.Object.extend('Item'),
                    item = new Item(),
                    query = new Parse.Query(Message);


                item.id = item_id;
                query.include('sender');
                query.equalTo('item', item);
                query.count({
                    success: function(data){
                        cb(null,data);
                    },
                    error: function(error){
                        cb(error,null);
                    }
                });
                */
            },

            getMessages: function(item_id,cb){
                cb(null,{});
                /*
                var Message = Parse.Object.extend("Message"),
                    Item = Parse.Object.extend('Item'),
                    item = new Item(),
                    query = new Parse.Query(Message);
                    query.ascending("createdAt");


                item.id = item_id;
                query.include('sender');
                query.equalTo('item', item);
                query.find({
                    success: function(results){
                        cb(null,results);
                    },
                    error: function(error){
                        cb(error,null);
                    }
                });
                */
            },

            getAlertMessages: function(item_id,cb){
                /*
                var itemRef = $rootScope.ref.child("items").child("alert").child(item_id);

                itemRef.once("value",function(snapshot){
                    if(snapshot.child("messages").exists()){
                */
                        var messagesRef = $rootScope.ref.child('items').child('alert').child(item_id).child("messages");
                        var messagesLen = $firebaseArray(messagesRef);
                        messagesLen.$loaded().then(function(messagesLen){
                            var nc = new Firebase.util.NormalizedCollection(
                                $rootScope.ref.child('items').child('alert').child(item_id).child("messages"),
                                $rootScope.ref.child('messages').child('alert'),
                                [$rootScope.ref.child('users'), 'users','alert.user']
                            )
                            .select('alert.text','alert.createdAt','alert.picture','alert.user','users.username','users.avatar')
                            .ref().orderByChild('createdAt');

                            var messages = $firebaseArray(nc);
                            /*
                                firebase utils muestra un comportamiento extraño
                                solamente carga el loaded la primera vez
                            */
                            messages.$loaded().then(function(messages){
                                console.log(messages);
                                cb(null,messages);
                            },function(error){
                                console.log(error);
                                cb(error,null)
                            });
                        });
                /*
                    }else{
                        cb(null,[]);
                    }
                });
                */
                        
/*
                }else{
                    cb(null,[]);
                }
*/                

            },


            getOfficeMessages: function(item_id,cb){

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
                var messagesRef = $firebaseArray($rootScope.ref.child("messages").child("alert"));
                messagesRef.$add({ "createdAt": Date.now(), "item": item_id, "text":msg, "updatedAt": Date.now(), "user":$rootScope.currentUser.id }).then(function(ref) {
                  var id = ref.key();
                  console.log("added record with id " + id);
                  messagesRef[messagesRef.$indexFor(id)].id = id; // returns location in the array
                  messagesRef.$save(messagesRef.$indexFor(id)).then(function(){
                    console.log("id saved");
                  });

                  var itemMessagesRef = $rootScope.ref.child("items").child("alert").child(item_id).child("messages");

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
                            var itemRef = $rootScope.ref.child("items").child("alert").child(item_id);
                            itemRef.update(msg, function(){
                                cb(null,true);
                            });
                        }
                  });

                });

            },

            postMessage: function(msg,item_id,cb){

                /*
                var Message = Parse.Object.extend("Message"),
                    Item = Parse.Object.extend('Item'),
                    User = Parse.Object.extend('User'),
                    item = new Item(),
                    user = new User(),
                    message = new Message();

                item.id = item_id;
                user.id = $rootScope.currentUser.id;
                message.set("item",item);
                message.set("text",msg);
                message.set("sender",user);

                message.save(null, {
                  success: function(message) {
                    cb(null,message);
                  },
                  error: function(message, error) {
                    cb(error,null);
                  }
                });
                */
            },

            postPictureOnAlertMessage: function(pict,item_id,cb){
                var messagesRef = $firebaseArray($rootScope.ref.child("messages").child("alert"));
                    var picture = {};
                    picture["image"] = pict;
                messagesRef.$add({ "createdAt": Date.now(), "item": item_id, "picture": picture, "updatedAt": Date.now(), "user":$rootScope.currentUser.id }).then(function(ref) {
                  var id = ref.key();
                  console.log("added record with id " + id);
                  messagesRef[messagesRef.$indexFor(id)].id = id; // returns location in the array
                  messagesRef.$save(messagesRef.$indexFor(id)).then(function(){
                    console.log("id saved");
                  });


                  var itemMessagesRef = $rootScope.ref.child("items").child("alert").child(item_id).child("messages");

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
                            var itemRef = $rootScope.ref.child("items").child("alert").child(item_id);
                            itemRef.update(msg, function(){
                                cb(null,true);
                            });
                        }
                  });

                });
                
            },

            postPictureOnMessage: function(pict,item_id,cb){

                /*
                var Message = Parse.Object.extend("Message"),
                    Item = Parse.Object.extend("Item"),
                    User = Parse.Object.extend("User"),
                    item = new Item(),
                    user = new User(),
                    message = new Message();

                item.id = item_id;
                user.id = $rootScope.currentUser.id;
                message.set("item", item);
                message.set("picture",pict);
                message.set("sender", user);

                message.save(null, {
                  success: function(message) {
                    cb(null,message);
                  },
                  error: function(message, error) {
                    cb(error,null);
                  }
                });
                */

            }
        }
        return service;
    });