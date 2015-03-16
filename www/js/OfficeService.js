angular.module('lf.services.office', [])


    .factory('OfficeService', function ($rootScope) {
        $rootScope.office;

        var service = {

            loadOffice: function () {
            	var Office = Parse.Object.extend("Office");
            	var query = new Parse.Query(Office);
            	query.equalTo("codeName", "00-indaba");
            	query.find({
                    success: function (results) {
                        $rootScope.office = results[0];
                    },
                    error: function (object, error) {
                        alert("Error: " + error.code + " " + error.message);
                    }
                });
            },

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
                })
            },

            getItem: function(item_id,cb){
                var Item = Parse.Object.extend("Item");
                var query = new Parse.Query(Item);
                query.include('createdBy');
                query.get(item_id, {
                  success: function(item) {
                    // The object was retrieved successfully.
                    var user = item.get('createdBy');
                    console.log(user);
                    cb(null,item);
                  },
                  error: function(object, error) {
                    // The object was not retrieved successfully.
                    // error is a Parse.Error with an error code and message.
                    cb(error,null);
                  }
                });
            }
            
        }
        return  service;
    });
