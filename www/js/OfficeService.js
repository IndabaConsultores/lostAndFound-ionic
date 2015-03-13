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
            }
            
        }
        return  service;
    });
