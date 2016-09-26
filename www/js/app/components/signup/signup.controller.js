angular.module('lf')

.controller('SignUpCtrl', function($scope,$rootScope,$state,$translate,$ionicPopup,$firebaseArray,Auth,constants){
	
	$scope.newUser = {};
	
	$scope.signup = function(){
		$rootScope.showLoading();
		var user = $scope.newUser;

		var regexp = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

		var error = [];
		if (user.username == undefined) {
			error.push('username is empty');
		}
		if (user.email == undefined || !regexp.test(user.email)) {
			error.push('invalid email');
		}
		if (user.password == undefined || user.password.length < 6) {
			error.push('password length must be 6 or more');
		}

		if (error.length > 0) {
			var template = '<ul>';
			for (var i=0; i<error.length; i++) {
				template += '<li>' + error[i] + '</li>';
			}
			template += '</ul>';
			$rootScope.hideLoading();
			
			var alertPopup = $ionicPopup.alert({
				title: 'Sign up error',
				template: template
			});
		} else {
		
			Auth.$createUserWithEmailAndPassword($scope.newUser.email, $scope.newUser.password
			).then(function(userData) {
				$scope.message = "User created with uid: " + userData.uid;

				var new_userRef = firebase.database().ref("/users/"+userData.uid);

				new_userRef.set({
					id: userData.uid,
					alerts: true,
					language: $translate.use(),
					username: $scope.newUser.username
				});

				$rootScope.hideLoading();
				var alertPopup = $ionicPopup.alert({
					title: 'New User success '+ $scope.newUser.username,
					template: 'ready for login'
				}).then(function(res) {
					$state.go('app.foundItems');
				});

			}).catch(function(error) {
				$rootScope.hideLoading();
				var alertPopup = $ionicPopup.alert({
					title: 'Sign up error',
					template: error
				});			
			});
		}

    }
});
