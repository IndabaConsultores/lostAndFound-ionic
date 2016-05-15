angular.module('lf.services.office', [])


    .factory('OfficeService', function ($rootScope,$firebaseObject,$firebaseArray,constants) {
        

        var service = {

            loadOffice: function (cb) {

                var my_office = $firebaseObject($rootScope.ref.child('offices').child("20232"));
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


            getAlertMessages: function(item_id,cb){

                var messagesRef = new Firebase.util.NormalizedCollection(
                    $rootScope.ref.child("items").child("alert").child(item_id).child("messages"),
                    [$rootScope.ref.child("messages"),"message"]    
                )
                .select("message.body","message.createDate","message.picture","message.user")
                .ref().orderByChild("createDate");

                var messagesArray = $firebaseArray(messagesRef);


                console.log(messagesRef);

                messagesArray.$loaded(function(){

                    if(messagesArray.length > 0){
                        async.times(messagesArray.length, function(n, next){
                            var userRef = $rootScope.ref.child("messages").child(messagesArray[n].user);
                            userRef.on("value", function(userSnap){
                                messagesArray[n].user = userSnap.val();
                                next(null,userSnap.val());
                            });
                        }, function(err, users) {
                            console.log(messagesArray);
                            cb(err, messagesArray);
                        });
                    }else{
                        cb(null,[]);
                    }

                    

                });

                



/*
                        var messagesRef = $rootScope.ref.child('items').child('alert').child(item_id).child("messages");
                        var messagesLen = $firebaseArray(messagesRef);
                        messagesLen.$loaded().then(function(messagesLen){
                            console.log(messagesLen);
                            var nc = new Firebase.util.NormalizedCollection(
                                $rootScope.ref.child('items').child('alert').child(item_id).child("messages"),
                                [$rootScope.ref.child('messages'),'message'],
                                [$rootScope.ref.child('users'),'users','message.user']
                            )
                            .select('message.body','message.createDate','message.picture','message.user','users.username','users.avatar')
                            .ref().orderByChild('createDate');

                            var messages = $firebaseArray(nc);

                            console.log(messages);
                            /*
                                firebase utils muestra un comportamiento extraño
                                solamente carga el loaded la primera vez
                            */
/*                            
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

                var messagesRef = $rootScope.ref.child('items').child('office').child(item_id).child("messages");
                var messagesLen = $firebaseArray(messagesRef);
                messagesLen.$loaded().then(function(messagesLen){
                    var nc = new Firebase.util.NormalizedCollection(
                        $rootScope.ref.child('items').child('office').child(item_id).child("messages"),
                        $rootScope.ref.child('messages').child('office'),
                        [$rootScope.ref.child('users'), 'users','office.user']
                    )
                    .select('office.text','office.createdAt','office.picture','office.user','users.username','users.avatar')
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
                var messagesRef = $firebaseArray($rootScope.ref.child("messages").child("office"));
                messagesRef.$add({ "createdAt": Date.now(), "item": item_id, "text":msg, "updatedAt": Date.now(), "user":$rootScope.currentUser.id }).then(function(ref) {
                  var id = ref.key();
                  console.log("added record with id " + id);
                  messagesRef[messagesRef.$indexFor(id)].id = id; // returns location in the array
                  messagesRef.$save(messagesRef.$indexFor(id)).then(function(){
                    console.log("id saved");
                  });

                  var itemMessagesRef = $rootScope.ref.child("items").child("office").child(item_id).child("messages");

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
                            var itemRef = $rootScope.ref.child("items").child("office").child(item_id);
                            itemRef.update(msg, function(){
                                cb(null,true);
                            });
                        }
                  });
                });
            },

            postPictureOnAlertMessage: function(picture_item,cb){
                /*
                    picture_item: { image
                               thumb
                               item_id}
                */
                var messagesRef = $firebaseArray($rootScope.ref.child("messages").child("alert"));
                    var picture = {};
                        picture["image"] = picture_item.image;
                        picture["thumbnail"] = picture_item.thumb;
                console.log(picture_item);
                    var new_obj = { "createdAt": Date.now(), "item": picture_item.item_id, "picture": picture, "updatedAt": Date.now(), "user":$rootScope.currentUser.id };
                console.log(new_obj);
                messagesRef.$add(new_obj).then(function(ref) {
                  var id = ref.key();
                  console.log("added record with id " + id);
                  messagesRef[messagesRef.$indexFor(id)].id = id; // returns location in the array
                  messagesRef.$save(messagesRef.$indexFor(id)).then(function(){
                    console.log("id saved");
                  });

                  var itemMessagesRef = $rootScope.ref.child("items").child("alert").child(picture_item.item_id).child("messages");

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
                            var itemRef = $rootScope.ref.child("items").child("alert").child(picture.item_id);
                            itemRef.update(msg, function(){
                                cb(null,true);
                            });
                        }
                  });
                });
            },

            postPictureOnOfficeMessage: function(picture_item,cb){
                /*
                    picture: { image
                               thumb
                               item_id}
                */
                var messagesRef = $firebaseArray($rootScope.ref.child("messages").child("office"));
                    var picture = {};
                    picture["image"] = picture_item.image;
                    picture["thumbnail"] = picture_item.thumbnail;
                messagesRef.$add({ "createdAt": Date.now(), "item": picture_item.item_id, "picture": picture, "updatedAt": Date.now(), "user":$rootScope.currentUser.id }).then(function(ref) {
                  var id = ref.key();
                  console.log("added record with id " + id);
                  messagesRef[messagesRef.$indexFor(id)].id = id; // returns location in the array
                  messagesRef.$save(messagesRef.$indexFor(id)).then(function(){
                    console.log("id saved");
                  });

                  var itemMessagesRef = $rootScope.ref.child("items").child("office").child(picture_item.item_id).child("messages");

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
                            var itemRef = $rootScope.ref.child("items").child("office").child(picture_item.item_id);
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
