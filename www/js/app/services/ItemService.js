angular.module('lf.services.item', [])


    .factory('ItemService', function ($rootScope,$firebaseArray,constants) {
        $rootScope.item;

        var service = {

            fetchAlerts: function (cb) {
                var alerts = $firebaseArray($rootScope.ref.child('items').child("alert").child("lost"));
                alerts.$loaded().then(function () {
                    cb(null,alerts);
                });
/*
            	var Item = Parse.Object.extend("Item"),

                    ItemCollection = Parse.Collection.extend({
                        model: Item,
                        query: (new Parse.Query(Item)).equalTo("office", $rootScope.office).equalTo('type','alert').include('createdBy').descending("createdAt")
                    });
                var item_collection = new ItemCollection();

                item_collection.fetch({
                  success: function(collection) {
                    cb(null,collection);
                  },
                  error: function(collection, error) {
                    cb(error,null);
                  }
                });
*/                
            },

            fetchFoundItems: function(cb) {


                var foundRef = new Firebase(constants.FIREBASEID+'/items/office'),
                    foundCollection = $firebaseArray(foundRef),
                    query = foundRef.orderByChild("office").equalTo($rootScope.office.$id);

                cb(null,$firebaseArray(query));
/*
            	var Item = Parse.Object.extend("Item"),
                    ItemCollection = Parse.Collection.extend({
                        model: Item,
                        query: (new Parse.Query(Item)).equalTo("office", $rootScope.office).equalTo('type','found').include('createdBy').include('category').descending("createdAt")
                    });
                var item_collection = new ItemCollection();

                item_collection.fetch({
                  success: function(collection) {
                    cb(null,collection);
                  },
                  error: function(collection, error) {
                    cb(error,null);
                  }
                });
*/
            },

            foundItemsByCategory: function(category_id,cb) {
                results = [];
                $rootScope.founditems_collection.$loaded().then(function(){
                    angular.forEach($rootScope.founditems_collection, function(item) {
                        if(item.category === category_id){
                            results.push(item);
                        }
                    });
                    cb(null,results);
                });
                
                
            }

        }
        return  service;
    });
