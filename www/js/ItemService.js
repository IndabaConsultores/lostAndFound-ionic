angular.module('lf.services.item', [])


    .factory('ItemService', function ($rootScope) {
        $rootScope.item;

        var service = {

            fetchAlerts: function (cb) {
            	var Item = Parse.Object.extend("Item"),

                    ItemCollection = Parse.Collection.extend({
                        model: Item,
                        query: (new Parse.Query(Item)).equalTo("office", $rootScope.office).equalTo('type','alert').include('createdBy')
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
            },

            fetchFoundItems: function(cb) {

            	var Item = Parse.Object.extend("Item"),

                    ItemCollection = Parse.Collection.extend({
                        model: Item,
                        query: (new Parse.Query(Item)).equalTo("office", $rootScope.office).equalTo('type','found').include('createdBy').include('category')
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

            }

        }
        return  service;
    });
