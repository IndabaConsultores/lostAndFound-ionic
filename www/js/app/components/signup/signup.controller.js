angular.module('lf')

.controller('SignUpCtrl', function($scope,$rootScope,$state,$translate,$ionicPopup,$firebaseArray,Auth,constants){
	
	$scope.newuser = {};
	
	$scope.signup = function(){
		console.log('signup enter');
		$rootScope.showLoading();

		Auth.$createUserWithEmailAndPassword($scope.newuser.email, $scope.newuser.password
		).then(function(userData) {
			console.log('signup success');
			$scope.message = "User created with uid: " + userData.uid;

			var new_userRef = firebase.database().ref("/users/"+userData.uid);

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
			//TODO hideLoading() no logra ocultar el widget
			$rootScope.hideLoading();
			console.log('signup error');
			$scope.error = error;
		});

    }
});
