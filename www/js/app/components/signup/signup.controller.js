angular.module('lf')

.controller('SignUpCtrl', function($scope,$rootScope,$state,$translate,$ionicPopup,$firebaseArray,Auth,constants){

  $scope.newuser = {};

    $scope.signup = function(){
        console.log("signup controller signup function");
        $rootScope.showLoading();

        Auth.$createUser({
          email: $scope.newuser.email,
          password: $scope.newuser.password
        }).then(function(userData) {
          $scope.message = "User created with uid: " + userData.uid;

          var new_userRef = new Firebase(constants.FIREBASEID+"/users/"+userData.uid);

          new_userRef.set({
            id: userData.uid,
            alerts:true,
            language: $translate.use(),
            username: $scope.newuser.username
          });

          $rootScope.hideLoading();
          var alertPopup = $ionicPopup.alert({
             title: 'New User success '+ $scope.newuser.username,
             template: 'ready for login'
           }).then(function(res) {
              $state.go('app.foundItems');
           });
        
        }).catch(function(error) {
          $scope.error = error;
          console.log(error);
        });



/*

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
  */        
    }
});