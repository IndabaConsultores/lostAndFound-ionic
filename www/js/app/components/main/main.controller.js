'use strict';

angular.module('lf')

.controller('AppCtrl', function($scope,$state,$ionicHistory,$rootScope,$ionicPopup,$firebaseObject,$ionicModal,$timeout,$translate, amMoment) {
	if (!window.localStorage.getItem('rememberMe')) {
		window.localStorage.setItem('rememberMe', false);	
		window.localStorage.removeItem('email');
		window.localStorage.removeItem('password');
	}
	
	// Form data for the login modal
	$scope.loginData = {
		username: window.localStorage.getItem('email'),
		password: window.localStorage.getItem('password'),
		rememberMe: window.localStorage.getItem('rememberMe') == 'true'
	};

	// Create the login modal that we will use later
	$ionicModal.fromTemplateUrl('js/app/components/main/login.html', {
		scope: $scope
	}).then(function(modal) {
		$scope.loginModal = modal;
	});

	$scope.logout = function() {
		firebase.auth().signOut().then(function() {
			$ionicHistory.clearCache();
			$rootScope.data.currentUser = null;
			$state.go('app.foundItems');
		});
	};

	// Triggered in the login modal to close it
	$scope.closeLogin = function() {
		$scope.loginModal.hide();
	};

	// Open the login modal
	$scope.login = function() {
		$scope.loginModal.show();
	};

	$scope.signup = function(){
		$scope.loginModal.hide();
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
		window.localStorage.setItem('rememberMe', $scope.loginData.rememberMe);

		var regexp = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

		var error = [];
		if (email == undefined || !regexp.test(email)) {
			error.push('invalid email');
		}
		if (password == undefined || password.length < 6) {
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
			return;
		}
		
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
			$rootScope.data.currentUser = $firebaseObject(firebase.database().ref('users').child(user.uid));
			$rootScope.data.currentUser.$loaded().then(function() {
				$translate.use($rootScope.data.currentUser.language);
				amMoment.changeLocale($rootScope.data.currentUser.language);
				$rootScope.settings.language = $rootScope.data.currentUser.language;
			});
			$scope.loginModal.hide();
		}).catch(function(error) {
			var alertPopup = $ionicPopup.alert({
				title: 'Log in error' + error.code,
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
		//console.log('DATA: ' + JSON.stringify(data));
		var closed = data.message.app.closed;
		var asleep = data.message.app.asleep;
		var itemId = data.message.payload.itemId;
		if (closed || asleep) {
			$state.go('app.alertitem', {'item':itemId});;
		} else {
			//TODO manage push notification when app is open
			//Guardar notificacion en lista de notificaciones??
			console.log(data.message.title + ': ' + data.message.text);
		}
	});
});

