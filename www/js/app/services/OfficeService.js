angular.module('lf.services.office', [])


    .factory('OfficeService', function ($rootScope,$firebaseObject) {
        

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
