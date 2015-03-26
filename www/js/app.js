  // Ionic Starter App

  // angular.module is a global place for creating, registering and retrieving Angular modules
  // 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
  // the 2nd parameter is an array of 'requires'

  angular.module('starter', ['ionic', 'lf.controllers', 'lf.services.office', 'lf.services.category','lf.services.item','lf.directives.map'])

  .run(function($ionicPlatform, $ionicLoading, $rootScope, OfficeService, CategoryService, ItemService) {
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


      var APP_ID = 'rLLNluRNBUF8oE80COn93iypqnJowLhHeij4w1jT';
      var JS_KEY = 'Ibs97GtVmHrVaM9vp68pGCYdOSNDjig5jrARo3L8';

      Parse.initialize(APP_ID, JS_KEY);


      $rootScope.alert_collection = {
          'models': []
      };


      initAppInfo();
      

      $rootScope.showLoading = function()  {
       $ionicLoading.show({template: 'Loading...',noBackdrop:true});
      };

      $rootScope.hideLoading = function()  {
        $ionicLoading.hide();
      };

    });

    function initAppInfo() {
        $ionicLoading.show({template: 'Iniciando aplicacion...',noBackdrop:true});
        OfficeService.loadOffice(function(error,office){
            $rootScope.office = office;

            // bulk loading of data

            async.parallel([
              function(cb){
                CategoryService.fetch(function(error,collection){
                  $rootScope.$apply(function () {
                      $rootScope.category_collection = collection;
                      cb(error,collection);
                  });
                });
              },
              function(cb){
                ItemService.fetchFoundItems(function(error,collection){
                  $rootScope.$apply(function () {
                    $rootScope.founditems_collection = collection;
                    cb(error,collection);
                  });
                });
              },
              function(cb){
                ItemService.fetchAlerts(function(error,collection){
                 $rootScope.$apply(function () {
                    $rootScope.alert_collection = collection;
                    cb(error,collection);
                  });
                });
              }
          ], function(err,results){
                  $ionicLoading.hide();
                  if(err)
                    $ionicPopup.alert({ title: err.message })
            });

        });

      }
    
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
            controller: 'FoundItemCtrl'
          }
        }
      })

      .state('app.messages',{
        url: "/found_items/messages/:item",
        views: {
          'menuContent': {
            templateUrl: "templates/messages.html",
            controller: 'MessageCtrl'
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

      .state('app.alertitem', {
        url: "/alerts/:item",
        views: {
          'menuContent' :{
            templateUrl: "templates/item.html",
            controller: 'ItemCtrl'
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
      .state('app.info', {
        url: "/info",
        views: {
          'menuContent' :{
            templateUrl: "templates/info.html",
            controller: 'InfoCtrl'
          }
        }
      });
    // if none of the above states are matched, use this as the fallback
    $urlRouterProvider.otherwise('/app/found_items');
  });

