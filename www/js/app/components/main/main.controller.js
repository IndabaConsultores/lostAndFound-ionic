angular.module('lf')

.controller('AppCtrl', function($scope,$state,$ionicHistory,$rootScope,$ionicPopup,$firebaseObject,$ionicModal,$timeout,$translate) {
	// Form data for the login modal
	$scope.loginData = {};

	// Create the login modal that we will use later
	$ionicModal.fromTemplateUrl('js/app/components/main/login.html', {
		scope: $scope
	}).then(function(modal) {
		$scope.modal = modal;
	});

	$scope.logout = function() {
		$rootScope.ref.unauth();
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
		console.log("signup");
		$scope.modal.hide();
		$state.go('app.signup');
	};

	$scope.fblogin = function(){
		$rootScope.ref.authWithOAuthPopup("facebook", function(error, authData) {
			if (error) {
				console.log("Login Failed!", error);
			} else {
				console.log("Authenticated successfully with payload:", authData);
			}
		});
	};

	// Perform the login action when the user submits the login form
	$scope.doLogin = function() {
		console.log("do login");
		$rootScope.showLoading();

		$rootScope.ref.authWithPassword({
			"email": $scope.loginData.username,
			"password": $scope.loginData.password
		}, function(error, authData) {
			$rootScope.hideLoading();
			if (error) {
				var alertPopup = $ionicPopup.alert({
					title: 'Sign Up ERROR' + error.code,
					template: error.message
				});
				alertPopup.then(function(res) {});
				console.log("Login Failed!", error);
			} else {
				console.log("Authenticated successfully with payload:", authData);
				$rootScope.currentUser = $firebaseObject($rootScope.ref.child('users').child(authData.uid));
				$translate.use($rootScope.currentUser.language);
				//$rootScope.currentUser = authData;
			}
		});

		// Simulate a login delay. Remove this and replace with your login
		// code if using a login system
		$timeout(function() {
			$scope.closeLogin();
		}, 1000);
	};

	$scope.$on('cloud:push:notification', function(event, data) {
		console.log("Notification received %s", data.message.text);
	});
});
