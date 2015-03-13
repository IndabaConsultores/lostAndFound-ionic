angular.module('lf.controllers', [])

.controller('AppCtrl', function($scope, $ionicModal, $timeout) {
  // Form data for the login modal
  $scope.loginData = {};

  // Create the login modal that we will use later
  $ionicModal.fromTemplateUrl('templates/login.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modal = modal;
  });

  // Triggered in the login modal to close it
  $scope.closeLogin = function() {
    $scope.modal.hide();
  };

  // Open the login modal
  $scope.login = function() {
    $scope.modal.show();
  };

  // Perform the login action when the user submits the login form
  $scope.doLogin = function() {
    console.log('Doing login', $scope.loginData);

    // Simulate a login delay. Remove this and replace with your login
    // code if using a login system
    $timeout(function() {
      $scope.closeLogin();
    }, 1000);
  };
})

.controller('FoundItemsCtrl', function($scope){

/*
    Parse.Cloud.httpRequest({
        url: 'https://api.parse.com/1/functions/foundItems',
        success: function(httpResponse) {
          console.log(httpResponse);
        },
        error: function(httpResponse) {
          console.error('Request failed with response code ' + httpResponse.status);
        }
      });
*/

  var Item = Parse.Object.extend("Item");
  var query = new Parse.Query(Item);
  query.equalTo("type", "found");
  query.find({
    success: function(results) {
      // Do something with the returned Parse.Object values
      console.log(results);
    },
    error: function(error) {
      alert("Error: " + error.code + " " + error.message);
    }
  });




    // Simple syntax to create a new subclass of Parse.Object.
      var Item = Parse.Object.extend("Item");
       
      // Create a new instance of that class.
      var item = new Item();

      item.fetch({
        success: function(data) {
          $scope.items = data.attributes.results;
          console.log($scope.items);
        },
        error: function(myObject, error) {
          // The object was not refreshed successfully.
          // error is a Parse.Error with an error code and message.
        }
      });

})

.controller('ItemCtrl', function($scope,$stateParams){
  var items = [
    { id: 1, name: 'Two Keys', date: '2014/09/09', picture: 'http://www.doorcloser.com/acatalog/DCSC_KEYS_LARGE.jpg', category: 'keys'},
    { id: 2, name: 'Big Bunch of Keys', date: '2014/09/09', picture: 'http://static.guim.co.uk/sys-images/Guardian/About/General/2012/6/4/1338812468461/A-bunch-of-keys-008.jpg', category: 'keys'},
    { id: 3, name: 'Green Wallet', date: '2014/09/09', picture: 'http://images.cdn.bigcartel.com/bigcartel/product_images/99987691/max_h-1000+max_w-1000/NAH_5624.JPG', category: 'wallets'},
    { id: 4, name: 'Samsung Galaxy S5', date: '2014/09/09', picture: 'http://taliandroid.com/wp-content/uploads/2014/03/Foto-del-Galaxy-S5--1024x682.jpg', category: 'phones'}
  ];

  for(var item = null, i=0, len=items.length; i<len; i++){

    if(items[i].id == $stateParams.item){
      item = items[i];
    }
  }

  $scope.item = item;
    
})

.controller('AlertsCtrl', function($scope){


  var Item = Parse.Object.extend("Item");
  var query = new Parse.Query(Item);
  query.equalTo("type", "alert");
  query.find({
    success: function(results) {
      $scope.items = results;
    },
    error: function(error) {
      alert("Error: " + error.code + " " + error.message);
    }
  });

/*
  $scope.items = [
    { id: 1, name: 'Two Keys', date: '2014/09/09', picture: 'http://www.doorcloser.com/acatalog/DCSC_KEYS_LARGE.jpg', category: 'keys'},
    { id: 2, name: 'Big Bunch of Keys', date: '2014/09/09', picture: 'http://static.guim.co.uk/sys-images/Guardian/About/General/2012/6/4/1338812468461/A-bunch-of-keys-008.jpg', category: 'keys'},
    { id: 3, name: 'Green Wallet', date: '2014/09/09', picture: 'http://images.cdn.bigcartel.com/bigcartel/product_images/99987691/max_h-1000+max_w-1000/NAH_5624.JPG', category: 'wallets'},
    { id: 4, name: 'Samsung Galaxy S5', date: '2014/09/09', picture: 'http://taliandroid.com/wp-content/uploads/2014/03/Foto-del-Galaxy-S5--1024x682.jpg', category: 'phones'}
  ];  
*/
})

.controller('LaunchAlertCtrl', function($scope) {

})


.controller('InfoCtrl', function($scope){

});
