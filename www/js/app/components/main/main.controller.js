angular.module('lf')

.controller('AppCtrl', function($scope,$state,$ionicHistory,$rootScope,$ionicPopup,$ionicModal,$timeout,$translate) {
  // Form data for the login modal
  $scope.loginData = {};

  // Create the login modal that we will use later
  $ionicModal.fromTemplateUrl('js/app/components/main/login.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modal = modal;
  });

  $scope.logout = function() {
    Parse.User.logOut();
    $ionicHistory.clearCache();
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
  };

  $scope.fblogin = function(){
      Parse.FacebookUtils.logIn(null, {
        success: function(user) {
          if (!user.existed()) {
            var alertPopup = $ionicPopup.alert({
               title: 'Success!',
               template: 'User signed up and logged in through Facebook!'
             });
             alertPopup.then(function(res) {});
          } else {
            var alertPopup = $ionicPopup.alert({
               title: 'Success!',
               template: 'User logged in through Facebook!'
             });
             alertPopup.then(function(res) {});
          }
        },
        error: function(user, error) {
          var alertPopup = $ionicPopup.alert({
             title: 'User cancelled the Facebook login or did not fully authorize.' + error.code,
             template: error.message
           });
           alertPopup.then(function(res) {});
        }
      });
  };

  // Perform the login action when the user submits the login form
  $scope.doLogin = function() {
    $rootScope.showLoading();
    Parse.User.logIn($scope.loginData.username, $scope.loginData.password, {
      success: function(user) {
        $rootScope.hideLoading();
        $scope.loginData = {};
        $rootScope.currentUser = user;
        $translate.use(user.get("language"));
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


    // Simulate a login delay. Remove this and replace with your login
    // code if using a login system
    $timeout(function() {
      $scope.closeLogin();
    }, 1000);
  };
});