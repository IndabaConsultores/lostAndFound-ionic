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

})

.controller('ItemCtrl', function($scope,$stateParams){
  var items = [
    { id: 1, name: 'Two Keys', date: '2014/09/09', picture: 'http://www.doorcloser.com/acatalog/DCSC_KEYS_LARGE.jpg', category: 'keys'},
    { id: 2, name: 'Big Bunch of Keys', date: '2014/09/09', picture: 'http://static.guim.co.uk/sys-images/Guardian/About/General/2012/6/4/1338812468461/A-bunch-of-keys-008.jpg', category: 'keys'},
    { id: 3, name: 'Green Wallet', date: '2014/09/09', picture: 'http://images.cdn.bigcartel.com/bigcartel/product_images/99987691/max_h-1000+max_w-1000/NAH_5624.JPG', category: 'wallets'},
    { id: 4, name: 'Samsung Galaxy S5', date: '2014/09/09', picture: 'http://taliandroid.com/wp-content/uploads/2014/03/Foto-del-Galaxy-S5--1024x682.jpg', category: 'phones'}
  ];

  for(var item = null, i=0, len=items.length; i<len; i++){
    console.log($stateParams);
    if(items[i].id == $stateParams.item){
      item = items[i];
    }
  }
  console.log(item);
  $scope.item = item;
    
})

.controller('AlertsCtrl', function($scope){
  $scope.items = [
    { id: 1, name: 'Two Keys', date: '2014/09/09', picture: 'http://www.doorcloser.com/acatalog/DCSC_KEYS_LARGE.jpg', category: 'keys'},
    { id: 2, name: 'Big Bunch of Keys', date: '2014/09/09', picture: 'http://static.guim.co.uk/sys-images/Guardian/About/General/2012/6/4/1338812468461/A-bunch-of-keys-008.jpg', category: 'keys'},
    { id: 3, name: 'Green Wallet', date: '2014/09/09', picture: 'http://images.cdn.bigcartel.com/bigcartel/product_images/99987691/max_h-1000+max_w-1000/NAH_5624.JPG', category: 'wallets'},
    { id: 4, name: 'Samsung Galaxy S5', date: '2014/09/09', picture: 'http://taliandroid.com/wp-content/uploads/2014/03/Foto-del-Galaxy-S5--1024x682.jpg', category: 'phones'}
  ];  
})

.controller('LaunchAlertCtrl', function($scope) {

})


.controller('InfoCtrl', function($scope){

});
