// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'

angular.module('lf', ['ionic',
					 'ionic.cloud',
  					 'pascalprecht.translate',
  					 'angularMoment',
					 'ngAnimate',
  					 'nl2br',
  					 'firebase',
					 'jett.ionic.filter.bar',
  					 'lf.services.office', 
  					 'lf.services.category',
  					 'lf.services.item',
					 'lf.services.image',
					 'lf.services.message',
					 'lf.services.user',
  					 'lf.services.camera'])

.run(function($ionicPlatform, $ionicPopup, $ionicLoading, $ionicPush, $rootScope, $translate, $filter, $firebaseObject, amMoment, constants, OfficeService, CategoryService, ItemService, UserService, MessageService, ImageService) {

	//Initialize global data
	$rootScope.data = {};
	$rootScope.settings = {
		alerts: window.localStorage.getItem('settings.alerts') == "true"
	};
	$rootScope.currentLocation = {
		"latitude" : 0,
		"longitude" : 0
	};

	//Save Firebase reference and load it into the rootscope
	firebase.initializeApp(constants.FIREBASE_CONFIG);
	console.log('Database initialized');

	$rootScope.showLoading = function()  {
		$ionicLoading.show({ template: $filter('translate')('loading'), noBackdrop:true });
	};

	$rootScope.hideLoading = function()  {
		$ionicLoading.hide();
	};

	$ionicPlatform.ready(function() {
		// Hide the accessory bar by default (remove this to show the accessory bar above the keyboard for form inputs)
		if(window.cordova && window.cordova.plugins.Keyboard) {
			cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
		}
		if(window.StatusBar) {
			// org.apache.cordova.statusbar required
			StatusBar.styleDefault();
		}

		// Check for internet connection
		if(navigator.connection && navigator.connection.type == Connection.NONE) {
			navigator.splashscreen.hide();
			$ionicPopup.alert({
				title: 'No connection',
				content: 'No connection to Internet, app will close'
			}).then(function(res) {
				ionic.Platform.exitApp();
			});
		}

		// Check alert configuration and register device if necessary
		if (!window.localStorage.getItem('settings.alerts')) {
			window.localStorage.setItem('settings.alerts', true);
		}

		if (!!window.localStorage.getItem('settings.alerts')) {
			//Register Ionic Push device token
			$ionicPush.register().then(function(t) {
				return $ionicPush.saveToken(t);
			}).then(function(t) {
				window.localStorage.setItem('pushToken', t);
				//save token to Firebase?
			});
		}

		//Check user authentication
		var auth = firebase.auth().user;

		if(!!auth){
			$rootScope.data.currentUser = $firebaseObject(firebase.database().ref('users').child(auth.uid));
			$rootScope.data.currentUser.$loaded().then(function () {
				console.log($rootScope.data.currentUser.name);
				console.log($rootScope.data.currentUser.language);
				$translate.use($rootScope.data.currentUser.language);
				amMoment.changeLocale($rootScope.data.currentUser.language);
			});
		}else{
			// usuario no autetificado
			if (window.localStorage.getItem('settings.language')) {
				$rootScope.settings.language = window.localStorage.getItem('settings.language');
				$translate.use($rootScope.settings.language);
				amMoment.changeLocale($rootScope.settings.language);			
		//	} else if (typeof navigator.globalization !== "undefined") {
		//		navigator.globalization.getPreferredLanguage(function(language) {
		//			$rootScope.settings.language = (language.value).split("-")[0];
		//			$translate.use($rootScope.settings.language);
		//			amMoment.changeLocale($rootScope.settings.language);
		//		}, null);
			} else {
				$rootScope.settings.language = "eu";	
				$translate.use($rootScope.settings.language);       			
				amMoment.changeLocale($rootScope.settings.language);	
			}
		}

		$rootScope.languages = [
			{ code: "en",
			  name: "English" },
			{ code: "es",
			  name: "Español" },
			{ code: "eu",
			  name: "Euskara" }
		];

			
		(function(d, s, id){
			var js, fjs = d.getElementsByTagName(s)[0];
			if (d.getElementById(id)) {return;}
			js = d.createElement(s); js.id = id;
			js.src = "//connect.facebook.net/en_US/sdk.js";
			fjs.parentNode.insertBefore(js, fjs);
		}(document, 'script', 'facebook-jssdk'));

		initAppInfo();
	});

	function startLocationWatch() {
		// Set geolocation watcher
		navigator.geolocation.watchPosition(function(pos) {
			$rootScope.currentLocation = {
				latitude: pos.coords.latitude,
				longitude: pos.coords.longitude
			};
		}, function(error) {
			if ($rootScope.office && $rootScope.office.location) {
				$rootScope.currentLocation = $rootScope.office.location;
			} else {
				$rootScope.currentLocation = {
					"latitude" : 0,
					"longitude" : 0
				};
			}
		}, {
			"enableHighAccuracy": false,
			"timeout": 5000,
			"maximumAge": 1000*60*30
		});	
	}

	function initAppInfo() {
		if (!navigator.splashscreen)
			$ionicLoading.show({ template: 'Iniciando aplicacion...', noBackdrop:true });

		var promises = [];
		promises.push(OfficeService.getOffice());
		promises.push(ItemService.loaded());
		promises.push(ImageService.loaded());
		promises.push(MessageService.loaded());
		promises.push(UserService.loaded());
		promises.push(CategoryService.loaded());
		Promise.all(promises).then(function(results){
			startLocationWatch();
			if (navigator.splashscreen)
				navigator.splashscreen.hide();
			else
				$ionicLoading.hide();
		}).catch(function(error) {
			console.log(error);
		});
	}
	
})

.constant('angularMomentConfig', {
	//preprocess: 'unix', // optional
	timezone: 'Europe/Madrid' // optional
})

.config(function($ionicCloudProvider, $stateProvider, $urlRouterProvider, $ionicFilterBarConfigProvider, constants) {
	function loadItems(ItemService) {
		return ItemService.loaded();
	}

	function loadUsers(UserService) {
		return UserService.loaded();
	}
	
	function loadImages(ImageService) {
		return ImageService.loaded();
	}

	function loadCategories(CategoryService) {
		return CategoryService.loaded();
	}

	function loadMessages(MessageService) {
		return MessageService.loaded();
	}
	
	function loadOffice(OfficeService) {
		return OfficeService.getOffice();
	}

	$ionicCloudProvider.init({
		"core": {
			"app_id": constants.IONIC_APP_ID  
		},
		"push": {
			"sender_id": constants.SENDER_ID,
			"pluginConfig": {
				"ios": {
					"badge": true,
					"sound": true
				},
				"android": {
					"iconColor": "#343434"
				}
			}
		}	
	});

	$stateProvider
	.state('app', {
		url: "/app",
		abstract: true,
		templateUrl: "js/app/components/main/menu.html",
		controller: 'AppCtrl',
		resolve: {
			'ItemData': loadItems,
			'ImageData': loadImages,
			'UserData': loadUsers,
			'CategoryData': loadCategories,
			'MessageData': loadMessages,
			'Office': loadOffice
		}
	})
	.state('app.foundItems', {
		url: "/found_items",
		views: {
			'menuContent': {
				templateUrl: "js/app/components/founditems/founditems.html",
				controller: 'FoundItemsCtrl'
			}
		}
	})
	.state('app.item', {
		cache: false,
		url: "/found_items/:itemId",
		views: {
			'menuContent': {
				templateUrl: "js/app/components/founditem/founditem.html",
				controller: 'FoundItemCtrl'
			}
		}
	})
	.state('app.officeMessages',{
		url: "/found_items/messages/:item",
		views: {
			'menuContent': {
				templateUrl: "js/app/components/message/messages.html",
				controller: 'MessageCtrl'
			}
		}
	})
	.state('app.alertMessages', {
		url: "/alert_items/messages/:item",
		views: {
			'menuContent': {
				templateUrl: "js/app/components/message/messages.html",
				controller: "MessageCtrl"
			}
		}
	})
	.state('app.alerts', {
		url: "/alerts",
		views: {
			'menuContent': {
				templateUrl: "js/app/components/alerts/alerts.html",
				controller: "AlertsCtrl"
			}
		}
	})
	.state('app.alertitem', {
		cache: false,
		url: "/alerts/:item",
			views: {
				'menuContent': {
					templateUrl: "js/app/components/alertitem/alertitem.html",
					controller: 'AlertItemCtrl'
			}
		}
	})
	.state('app.launchAlert', {
		url: "/launch_alert",
		views: {
			'menuContent' :{
				templateUrl: "js/app/components/launchalert/launchalert.html",
				controller: 'LaunchAlertCtrl'
			}
		}
	})
	.state('app.info', {
		url: '/info',
		views: {
			'menuContent' :{
				templateUrl: 'js/app/components/info/info.html',
				controller: 'InfoCtrl'
			}
		}
	})
	.state('app.settings', {
		cache: false,
		url: '/settings',
		views: {
			'menuContent': {
				templateUrl: 'js/app/components/settings/settings.html',
				controller: 'SettingsCtrl' 
			}
		}
	})
	.state('app.signup', {
		url: '/signup',
		views: {
			'menuContent': {
				templateUrl: "js/app/components/signup/signup.html",
				controller: 'SignUpCtrl'
			}
		}
	})
	.state('app.notifications', {
		url: '/notifications',
		views: {
			'menuContent': {
				templateUrl: 'js/app/components/notifications/notifications.html',
				controller: 'NotifyCtrl'
			}
		}
	})
	.state('app.alertsmap', {
		url: "/alertsmap",
		views: {
			'menuContent' :{
				templateUrl: "js/app/components/alertsmap/alertsmap.html",
				controller: 'AlertsMapCtrl'
			}
		}
	});

	// if none of the above states are matched, use this as the fallback
	$urlRouterProvider.otherwise('/app/found_items');
	
	$ionicFilterBarConfigProvider.placeholder('Bilatu');
})

.filter('category-items', function() {
	return function(categories, filterText) {
		var out = [];
		for (var i=0; i<categories.length; i++) {
			var category = categories[i];
			if (category.name && category.name.toUpperCase().includes(filterText.toUpperCase())) {
				out.push(category)
			} else if (category.items && category.items.length > 0) {
				var outCategory = JSON.parse(JSON.stringify(category));
				outCategory.items = [];
				for (var j=0; j<category.items.length; j++) {
					var item = category.items[j];
					if (item.name.toUpperCase().includes(filterText.toUpperCase())) {
						outCategory.items.push(item);
					} else if (item.description && item.description.toUpperCase().includes(filterText.toUpperCase())) {
						outCategory.items.push(item);
					}
				}
				out.push(outCategory);
			}
		}
		return out.length > 0 ? out : null;
	}
});

