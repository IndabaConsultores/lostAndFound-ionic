
angular.module('lf')

.controller('AppCtrl', function($scope,$state,$ionicHistory,$rootScope,$ionicPopup,$firebaseObject,$ionicModal,$timeout,$translate) {
	if (window.localStorage.getItem('rememberMe') === undefined)
		window.localStorage.setItem('rememberMe', false);	
	
	// Form data for the login modal
	$scope.loginData = {
		rememberMe: window.localStorage.getItem('rememberMe'),
	};

	// Create the login modal that we will use later
	$ionicModal.fromTemplateUrl('js/app/components/main/login.html', {
		scope: $scope
	}).then(function(modal) {
		$scope.modal = modal;
	});

	$scope.logout = function() {
		firebase.auth().signOut().then(function() {
			$ionicHistory.clearCache();
			$rootScope.currentUser = null;
			$state.go('app.foundItems');
		});
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
		var provider = new firebase.auth.FacebookAuthProvider();
		firebase.auth().signInWithPopup(provider).then(function(result) {
			var token = result.credential.accessToken;
			var user = result.user;
			console.log("User authenticated with payload " + token);
		}).catch(function(error) {
			var alertPopup = $ionicPopup.alert({
				title: 'Log In ERROR' + error.code,
				template: error.message
			});
			alertPopup.then(function(res) {});
			console.log("Login Failed!", error);
		});
	};

	// Perform the login action when the user submits the login form
	$scope.doLogin = function() {
		$rootScope.showLoading();

		var email = $scope.loginData.username;
		var password = $scope.loginData.password;
		
		console.log($scope.loginData);
		if ($scope.loginData.rememberMe) {
			window.localStorage.setItem('email', email);
			window.localStorage.setItem('password', password);
		} else {
			window.localStorage.removeItem('email');
			window.localStorage.removeItem('password');
		}

		firebase.auth().signInWithEmailAndPassword(email, password)
		.then(function(user) {
			$rootScope.hideLoading();
			console.log("User authenticated");
			$rootScope.currentUser = $firebaseObject(firebase.database().ref('users').child(user.uid));
			$rootScope.currentUser.$loaded().then(function() {
				$translate.use($rootScope.currentUser.language);
			});
			$scope.modal.hide();
		}).catch(function(error) {
			var alertPopup = $ionicPopup.alert({
				title: 'Sign Up ERROR' + error.code,
				template: error.message
			});
			$rootScope.hideLoading();
			alertPopup.then(function(res) {});
			if ($scope.rememberMe) {
				window.localStorage.removeItem('email');
				window.localStorage.removeItem('password');
			}
			console.log('Login Failed!' + error);
		});
	};

	$scope.$on('cloud:push:notification', function(event, data) {
		//TODO manage push notification when app is open
		console.log('Target scope: ' + event.targetScope);
		console.log('Notification received ' + data.message.text);
		console.log('Item ID: ' + data.itemId);
		$state.go('app.alerts');
	});
});

