angular.module('lf.services.category', [])


    .factory('CategoryService', function ($rootScope,$firebaseArray) {

        var service = {

            fetch: function(cb) {

                var categories = $firebaseArray($rootScope.ref.child('categories'));
                categories.$loaded().then(function () {
                    cb(null,categories);
                });
            	

/*
                var Category = Parse.Object.extend("Category"),
                    CategoryCollection = Parse.Collection.extend({
                        model: Category,
                        query: (new Parse.Query(Category)).equalTo("office", $rootScope.office)
                    });
                var category_collection = new CategoryCollection();


                category_collection.fetch({
                  success: function(collection) {
                    cb(null,collection);
                  },
                  error: function(collection, error) {
                    cb(error,null);
                  }
                });
*/

            },
                        
        }
        return  service;
    });
