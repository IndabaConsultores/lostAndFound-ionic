angular.module('lf')

.controller('SignUpCtrl', function($scope,$rootScope,$state,$ionicPopup){

  $scope.newuser = {};

    $scope.signup = function(){

        $rootScope.showLoading();

        var user = new Parse.User();
        user.set("username", $scope.newuser.username);
        user.set("password", $scope.newuser.password);
        user.set("email", $scope.newuser.email);
         
        user.signUp(null, {
          success: function(user) {
            $rootScope.hideLoading();
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
});