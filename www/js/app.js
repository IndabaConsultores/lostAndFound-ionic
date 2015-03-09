// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'starter.controllers'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if(window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if(window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });
})

.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider

    .state('app', {
      url: "/app",
      abstract: true,
      templateUrl: "templates/menu.html",
      controller: 'AppCtrl'
    })

    .state('app.foundItems', {
      url: "/found_items",
      views: {
        'menuContent' :{
          templateUrl: "templates/found_items.html",
          controller: 'FoundItemsCtrl'
        }
      }
    })
    
    .state('app.item', {
      url: "/found_items/:item",
      views: {
        'menuContent' :{
          templateUrl: "templates/item.html",
          controller: 'ItemCtrl'
        }
      }
    })

    .state('app.alerts', {
      url: "/alerts",
      views: {
        'menuContent' :{
          templateUrl: "templates/alerts.html",
          controller: "AlertsCtrl"
        }
      }
    })
    .state('app.launchAlert', {
      url: "/launch_alert",
      views: {
        'menuContent' :{
          templateUrl: "templates/launch_alert.html",
          controller: 'LaunchAlertCtrl'
        }
      }
    })
    .state('app.howTo', {
      url: "/how_to",
      views: {
        'menuContent' :{
          templateUrl: "templates/how_to.html",
          controller: 'HowToCtrl'
        }
      }
    });
  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/app/found_items');
});

