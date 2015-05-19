  // Ionic Starter App

  // angular.module is a global place for creating, registering and retrieving Angular modules
  // 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
  // the 2nd parameter is an array of 'requires'

  angular.module('starter', ['ionic','pascalprecht.translate','angularMoment','nl2br', 'lf.controllers', 'lf.services.office', 'lf.services.category','lf.services.item','lf.directives.map','lf.services.camera'])

  .run(function($ionicPlatform, $ionicLoading, $rootScope, $translate, OfficeService, CategoryService, ItemService,amMoment,constants) {
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


      Parse.initialize(constants.APP_ID, constants.JS_KEY);

      $rootScope.currentUser = Parse.User.current();

      if(!$rootScope.currentUser){
        if(typeof navigator.globalization !== "undefined") {
            navigator.globalization.getPreferredLanguage(function(language) {
                $translate.use((language.value).split("-")[0]).then(function(data) {
                    console.log("SUCCESS -> " + data);
                }, function(error) {
                    console.log("ERROR -> " + error);
                });
            }, null);
        }else{
          $translate.use("en");
          amMoment.changeLocale("en");
        }
      }else{
        $translate.use($rootScope.currentUser.get("language"));
        amMoment.changeLocale($rootScope.currentUser.get("language"));
      }

       $rootScope.languages = [
                                { code: "en",
                                  name: "English" },
                                { code: "es",
                                  name: "Español"},
                                { code: "eu",
                                  name: "Euskara"}
                              ];
      

      window.fbAsyncInit = function() {
        Parse.FacebookUtils.init({ // this line replaces FB.init({
          appId      : constants.FB_APP_ID, // Facebook App ID
          status     : true,  // check Facebook Login status
          cookie     : true,  // enable cookies to allow Parse to access the session
          xfbml      : true,  // initialize Facebook social plugins on the page
          version    : 'v2.2' // point to the latest Facebook Graph API version
        });
        // Run code after the Facebook SDK is loaded.
      };
     
      (function(d, s, id){
        var js, fjs = d.getElementsByTagName(s)[0];
        if (d.getElementById(id)) {return;}
        js = d.createElement(s); js.id = id;
        js.src = "//connect.facebook.net/en_US/sdk.js";
        fjs.parentNode.insertBefore(js, fjs);
      }(document, 'script', 'facebook-jssdk'));



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

  .constant('angularMomentConfig', {
//    preprocess: 'unix', // optional
      timezone: 'Europe/Madrid' // optional
  })

  .config(function($stateProvider, $urlRouterProvider, $translateProvider) {
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
            controller: 'AlertItemCtrl'
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
        url: '/info',
        views: {
          'menuContent' :{
            templateUrl: 'templates/info.html',
            controller: 'InfoCtrl'
          }
        }
      })

      .state('app.settings', {
        url: '/settings',
        views: {
          'menuContent': {
            templateUrl: 'templates/settings.html',
            controller: 'SettingsCtrl' 
          }
        }
      })

      .state('app.signup', {
        url: "/signup",
        views: {
          'menuContent' :{
            templateUrl: "templates/signup.html",
            controller: 'SignUpCtrl'
          }
        }
      });
    // if none of the above states are matched, use this as the fallback
    $urlRouterProvider.otherwise('/app/found_items');   

    $translateProvider.translations('en', {
        found_items: "Found Items",
        alerts: "Alerts",
        launch_alert: "Launch Alert",
        info: "Info",
        settings: "Settings",
        logout: "Logout",
        login: "Login",
        get_alerts: "Get Alerts",
        back: "Back",
        item_name: "Item Name",
        item_description: "Item Description",
        picture: "Picture",
        camera: "Camera",
        use_picture: "Use Picture",
        comments: "Comments",
        comment: "Comment",
        share: "Share",
        language: "Language",
        username: "Username",
        password: "Password",
        email: "Email",
        create_account: "Create Account",
        cancel: "Cancel",
        choose_from_camera_or_gallery: "Choose from camera or gallery",
        sign_up: "Sign up"
    });


    $translateProvider.translations('es', {
        found_items: "Encontrados",
        alerts: "Alertas",
        launch_alert: "Crear Alerta",
        info: "Informacion",
        settings: "Ajustes",
        logout: "Salir",
        login: "Login",
        get_alerts: "Recibir Alertas",
        back: "Atras",
        item_name: "Nombre",
        item_description: "Descripcion",
        picture: "Imagen",
        camera: "Camara",
        use_picture: "Usar Imagen",
        comments: "Comentarios",
        comment: "Comentar",
        share: "Compartir",
        language: "Idioma",
        username: "Nombre de usuario",
        password: "Contraseña",
        email: "Email",
        create_account: "Crear Cuenta",
        cancel: "Cancelar",
        choose_from_camera_or_gallery: "Desde la camara o galeria",
        sign_up: "Darse de alta"
    });

    $translateProvider.translations('eu', {
        found_items: "Aurkitutakoak",
        alerts: "Alertak",
        launch_alert: "Alerta Berria",
        info: "Informazioa",
        settings: "Ezarpenak",
        logout: "Irten",
        login: "Login",
        get_alerts: "Alertak Jaso",
        back: "Itzuli",
        item_name: "Izena",
        item_description: "Deskribapena",
        picture: "Irudia",
        camera: "Kamera",
        use_picture: "Erabili Irudia",
        comments: "Iruzkin",
        comment: "Iruzkinak",
        share: "Elkarbanatu",
        language: "Hizkuntza",
        username: "Erabiltzailea",
        password: "Pasahitza",
        email: "Emaila",
        create_account: "Kontua Sortu",
        cancel: "Utzi",
        choose_from_camera_or_gallery: "Kamaratik edo argazki galeriatik aukeratu",
        sign_up: "Alta eman"
    });
    $translateProvider.preferredLanguage("en");
    $translateProvider.fallbackLanguage("en");
  });