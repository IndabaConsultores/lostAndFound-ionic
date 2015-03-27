angular.module('lf.controllers', [])

.controller('AppCtrl', function($scope,$state,$rootScope,$ionicPopup,$ionicModal,$timeout) {
  // Form data for the login modal
  $scope.loginData = {};

  // Create the login modal that we will use later
  $ionicModal.fromTemplateUrl('templates/login.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modal = modal;
  });

  $scope.logout = function() {
    Parse.User.logOut();
    $rootScope.currentUser = null;
    $state.go('app.foundItems');
  };

  // Triggered in the login modal to close it
  $scope.closeLogin = function() {
    $scope.modal.hide();
  };

  // Open the login modal
  $scope.login = function() {
    $scope.modal.show();
  };

  $scope.signup = function(){
    $scope.modal.hide();
    $state.go('app.signup');
  }

  // Perform the login action when the user submits the login form
  $scope.doLogin = function() {
    $rootScope.showLoading();
    Parse.User.logIn($scope.loginData.username, $scope.loginData.password, {
      success: function(user) {
        $rootScope.hideLoading();
        $scope.loginData = {};
        $rootScope.currentUser = user;
        $state.go('app.foundItems');
      },
      error: function(user, error) {
        $rootScope.hideLoading();
          var alertPopup = $ionicPopup.alert({
           title: 'Sign Up ERROR' + error.code,
           template: error.message
         });
         alertPopup.then(function(res) {});
      }
    }); 



    console.log('Doing login', $scope.loginData);

    // Simulate a login delay. Remove this and replace with your login
    // code if using a login system
    $timeout(function() {
      $scope.closeLogin();
    }, 1000);
  };
})

.controller('SignUpCtrl', function($scope,$rootScope,$state,$ionicPopup){

  $scope.newuser = {};

    $scope.signup = function(){

        $rootScope.showLoading();

        var user = new Parse.User();
        user.set("username", $scope.newuser.username);
        user.set("password", $scope.newuser.password);
        user.set("email", $scope.newuser.email);
         
        // other fields can be set just like with Parse.Object
        // user.set("phone", "415-392-0202");
         
        user.signUp(null, {
          success: function(user) {
            $rootScope.hideLoading();
            console.log(user);
            $scope.newuser = {};
            $rootScope.currentUser = user;
            var alertPopup = $ionicPopup.alert({
               title: 'New User success '+ user.attributes.username,
               template: 'ready for login'
             });
             alertPopup.then(function(res) {
                $state.go('app.foundItems');
             });
          },
          error: function(user, error) {
              $rootScope.hideLoading();
              var alertPopup = $ionicPopup.alert({
               title: 'Sign Up ERROR' + error.code,
               template: error.message
             });
             alertPopup.then(function(res) {});
          }
        });

    }

})


.controller('FoundItemsCtrl', function($scope,$rootScope,ItemService,OfficeService){


  $scope.listSetUp = function(){
    if($rootScope.founditems_collection && $rootScope.category_collection){

      var category_length = $rootScope.category_collection.length;
      $scope.bycategory = [];
      
      async.times(category_length, function(n, next){
          ItemService.foundItemsByCategory($rootScope.category_collection.at(n).id,function(error,data){
              var block = {
                 'category': $rootScope.category_collection.at(n).attributes.name,
                 'items': data
              }
              if(data.length > 0)
                $scope.bycategory.push(block);

              next(error,data);
          });
      }, function(err, items) {
          if(err)
            alert("error");
      });        
    }    
  }

  
  $scope.listSetUp();
  

  $rootScope.$watch('founditems_collection', function(newValue, oldValue) {
      $scope.listSetUp();
  });

  

  
})

.controller('AlertItemCtrl', function($scope,$stateParams,$rootScope,$ionicPopup,ItemService,OfficeService){

  $rootScope.showLoading();
  if($rootScope.alert_collection){
      $scope.item = $rootScope.alert_collection.get($stateParams.item);
  }
  

  OfficeService.getMessageCount($stateParams.item, function(error,data){
    $rootScope.hideLoading();
    $scope.messages = data;
  });

})

.controller('FoundItemCtrl', function($scope,$stateParams,$rootScope,$ionicPopup,ItemService,OfficeService){

  $rootScope.showLoading();
  if($rootScope.founditems_collection){
      $scope.item = $rootScope.founditems_collection.get($stateParams.item);
  }
  

  OfficeService.getMessageCount($stateParams.item, function(error,data){
    $rootScope.hideLoading();
    $scope.messages = data;
  });

})


.controller('MessageCtrl', function($scope,$rootScope,$stateParams,OfficeService){

  

  $scope.getMessages = function(){
      
      $rootScope.showLoading();
      
      OfficeService.getMessages($stateParams.item,function(error,data){
          
          $rootScope.hideLoading();

          if(error)
            alert("error" + error.code);
          
          $scope.messages = data;
      });
  }

  $scope.sendMessage = function(){

      $rootScope.showLoading();

      OfficeService.postMessage($scope.msg.text,$stateParams.item,function(error,data){
        $scope.msg.text = "";
        $rootScope.hideLoading();
        if(error)
            alert("error" + error.code);
        
        $scope.getMessages();
      });
  }

  $scope.getMessages();

})



.controller('AlertsCtrl', function($scope,$rootScope){

  if($rootScope.alert_collection)
    $scope.items = $rootScope.alert_collection.models;

  $rootScope.$watch('alert_collection', function(newValue, oldValue) {
    $scope.items = newValue.models;
  });

  


})

.controller('LaunchAlertCtrl', function($scope) {
   $scope.mapCreated = function(map) {
    $scope.map = map;
  };
})


.controller('InfoCtrl', function($scope){

});
