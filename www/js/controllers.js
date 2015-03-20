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

.controller('FoundItemsCtrl', function($scope,OfficeService){

  OfficeService.getFoundItems(function(error,data){
    if(error)
      alert("error" + error.code);
    
    $scope.items = data;
  });

})

.controller('ItemCtrl', function($scope,$stateParams,OfficeService){


  OfficeService.getItem($stateParams.item,function(error,data){
    if(error)
      alert("error" + error.code);
    console.log(data);
    $scope.item = data;
  });
})


.controller('MessageCtrl', function($scope,$stateParams,OfficeService){

  

  $scope.getMessages = function(){
      OfficeService.getMessages($stateParams.item,function(error,data){
          if(error)
            alert("error" + error.code);
          
          $scope.messages = data;
      });
  }

  $scope.sendMessage = function(){
      OfficeService.postMessage($scope.msg.text,$stateParams.item,function(error,data){
        if(error)
            alert("error" + error.code);
        
        $scope.getMessages();
      });
  }

  $scope.getMessages();

})



.controller('AlertsCtrl', function($scope,OfficeService){


  OfficeService.getAlertItems(function(error,data){
    if(error)
      alert("error" + error.code);
    
    $scope.items = data;
  });


})

.controller('LaunchAlertCtrl', function($scope) {

})


.controller('InfoCtrl', function($scope){

});
