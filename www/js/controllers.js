angular.module('lf.controllers', [])

.controller('AppCtrl', function($scope,$state,$rootScope,$ionicPopup,$ionicModal,$timeout) {
  // Form data for the login modal
  $scope.loginData = {};

  // Create the login modal that we will use later
  $ionicModal.fromTemplateUrl('templates/login.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modal = modal;
  });

  $scope.logout = function() {
    Parse.User.logOut();
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
    $scope.modal.hide();
    $state.go('app.signup');
  };

  $scope.fblogin = function(){
      Parse.FacebookUtils.logIn(null, {
        success: function(user) {
          if (!user.existed()) {
            var alertPopup = $ionicPopup.alert({
               title: 'Success!',
               template: 'User signed up and logged in through Facebook!'
             });
             alertPopup.then(function(res) {});
          } else {
            var alertPopup = $ionicPopup.alert({
               title: 'Success!',
               template: 'User logged in through Facebook!'
             });
             alertPopup.then(function(res) {});
          }
        },
        error: function(user, error) {
          var alertPopup = $ionicPopup.alert({
             title: 'User cancelled the Facebook login or did not fully authorize.' + error.code,
             template: error.message
           });
           alertPopup.then(function(res) {});
        }
      });
  };

  // Perform the login action when the user submits the login form
  $scope.doLogin = function() {
    $rootScope.showLoading();
    Parse.User.logIn($scope.loginData.username, $scope.loginData.password, {
      success: function(user) {
        $rootScope.hideLoading();
        $scope.loginData = {};
        $rootScope.currentUser = user;
        $state.go('app.foundItems');
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



    console.log('Doing login', $scope.loginData);

    // Simulate a login delay. Remove this and replace with your login
    // code if using a login system
    $timeout(function() {
      $scope.closeLogin();
    }, 1000);
  };
})

.controller('SignUpCtrl', function($scope,$rootScope,$state,$ionicPopup){

  $scope.newuser = {};

    $scope.signup = function(){

        $rootScope.showLoading();

        var user = new Parse.User();
        user.set("username", $scope.newuser.username);
        user.set("password", $scope.newuser.password);
        user.set("email", $scope.newuser.email);
         
        // other fields can be set just like with Parse.Object
        // user.set("phone", "415-392-0202");
         
        user.signUp(null, {
          success: function(user) {
            $rootScope.hideLoading();
            console.log(user);
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

    }

})


.controller('FoundItemsCtrl', function($scope,$rootScope,ItemService,OfficeService){


  $scope.listSetUp = function(){
    if($rootScope.founditems_collection && $rootScope.category_collection){

      var category_length = $rootScope.category_collection.length;
      $scope.bycategory = [];
      
      async.times(category_length, function(n, next){
          ItemService.foundItemsByCategory($rootScope.category_collection.at(n).id,function(error,data){
              var block = {
                 'category': $rootScope.category_collection.at(n).attributes.name,
                 'items': data
              }
              if(data.length > 0)
                $scope.bycategory.push(block);

              next(error,data);
          });
      }, function(err, items) {
          if(err)
            alert("error");
      });        
    }    
  }

  
  $scope.listSetUp();
  

  $rootScope.$watch('founditems_collection', function(newValue, oldValue) {
      $scope.listSetUp();
  });

  

  
})

.controller('AlertItemCtrl', function($scope,$stateParams,$rootScope,$ionicPopup,ItemService,OfficeService){

  $rootScope.showLoading();
  if($rootScope.alert_collection){
      $scope.item = $rootScope.alert_collection.get($stateParams.item);

      if($scope.item.get("alertLocation")){
          
          $scope.map = L.map('alertmap',{ tap:true }).setView([$scope.item.get("alertLocation")._latitude, $scope.item.get("alertLocation")._longitude], 14);
          L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
            attribution: 'Lost & Found',
            maxZoom: 18
          }).addTo($scope.map);

          $scope.marker = L.marker([$scope.item.get("alertLocation")._latitude, $scope.item.get("alertLocation")._longitude]).addTo($scope.map);
      }
      

  }
  

  OfficeService.getMessageCount($stateParams.item, function(error,data){
    $rootScope.hideLoading();
    $scope.messages = data;
  });

})

.controller('FoundItemCtrl', function($scope,$stateParams,$rootScope,$ionicPopup,ItemService,OfficeService){

  $rootScope.showLoading();
  if($rootScope.founditems_collection){
      $scope.item = $rootScope.founditems_collection.get($stateParams.item);

      if($scope.item.get("alertLocation")){

          $scope.map = L.map('alertmap',{ tap:true }).setView([$scope.item.get("alertLocation")._latitude, $scope.item.get("alertLocation")._longitude], 14);
          L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
            attribution: 'Lost & Found',
            maxZoom: 18
          }).addTo($scope.map);

          $scope.marker = L.marker([$scope.item.get("alertLocation")._latitude, $scope.item.get("alertLocation")._longitude]).addTo($scope.map);
      }
  }
  

  OfficeService.getMessageCount($stateParams.item, function(error,data){
    $rootScope.hideLoading();
    $scope.messages = data;
  });

})


.controller('MessageCtrl', function($scope,$rootScope,$stateParams,OfficeService){

  

  $scope.getMessages = function(){
      
      $rootScope.showLoading();
      
      OfficeService.getMessages($stateParams.item,function(error,data){
          
          $rootScope.hideLoading();

          if(error)
            alert("error" + error.code);
          
          $scope.messages = data;
      });
  }

  $scope.sendMessage = function(){

      $rootScope.showLoading();

      OfficeService.postMessage($scope.msg.text,$stateParams.item,function(error,data){
        $scope.msg.text = "";
        $rootScope.hideLoading();
        if(error)
            alert("error" + error.code);
        
        $scope.getMessages();
      });
  }

  $scope.getMessages();

})



.controller('AlertsCtrl', function($scope,$rootScope){

  if($rootScope.alert_collection)
    $scope.items = $rootScope.alert_collection.models;

  $rootScope.$watch('alert_collection', function(newValue, oldValue) {
    $scope.items = newValue.models;
  });

  


})

.controller('LaunchAlertCtrl', function($scope,$rootScope,$ionicPopup,CameraService,ItemService) {



  $scope.initMap = function(){
      $scope.map = L.map('map',{ tap:true }).setView([$scope.coords.lat, $scope.coords.lng], 14);

      L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
        attribution: 'Lost & Found',
        maxZoom: 18
      }).addTo($scope.map);

      $scope.marker = L.marker([$scope.coords.lat, $scope.coords.lng]).addTo($scope.map);
      $scope.map.on('click', $scope.onMapClick);

  };

  $scope.onMapClick = function(e) {
      //alert("You clicked the map at " + e.latlng);
      $scope.map.removeLayer($scope.marker);
      $scope.marker = L.marker([e.latlng.lat, e.latlng.lng]).addTo($scope.map);
      $scope.coords = e.latlng;
  };

  $scope.mapCreated = function(map) {
    $scope.map = map;
  };

  //$scope.coords = {'lat':$rootScope.office.get('location')._latitude, 'lng': $rootScope.office.get('location')._longitude };
  //$scope.initMap();


  navigator.geolocation.getCurrentPosition(function(success){
      /*
          En caso de que podamos acceder la ubicacion del dispositivo
          colocamos el marker en su lugar
      */
      $scope.coords = {'lat':success.coords.latitude, 'lng': success.coords.longitude };
      $scope.initMap();
  },function(error){ 
      $scope.coords = {'lat':$rootScope.office.get('location')._latitude, 'lng': $rootScope.office.get('location')._longitude };
      $scope.initMap();
  },{timeout:10000});





  var Item = Parse.Object.extend("Item");

  $scope.newalert = {};





  $scope.useCamera = function(){
      /*
          Usar camara para sacar foto
      */
      var options = {
        quality: 50,
        destinationType: navigator.camera.DestinationType.DATA_URL 
      };

      console.log(options);

      CameraService.getPicture(options)
        .then(function(imageURI) {
              $scope.imageBase64 = imageURI;
        }, function(err) {
            alert(err);
        });
  };


  $scope.usePicture = function(){
      /*
          Usar foto de la camara
      */
      var options = {
        quality: 50,
        destinationType: navigator.camera.DestinationType.DATA_URL,
        sourceType: navigator.camera.PictureSourceType.PHOTOLIBRARY
      };

      console.log(options);

      CameraService.getPicture(options)
        .then(function(imageURI) {
              $scope.imageBase64 = imageURI;
        }, function(err) {
            alert(err);
        });
  };

  $scope.createAlert = function(){
    if($rootScope.currentUser){
        $rootScope.showLoading();
        var file_name = Date.now(),
            parseFile = new Parse.File(file_name+".jpg", {base64:$scope.imageBase64});
            alertlocation = new Parse.GeoPoint({latitude: $scope.coords.lat, longitude: $scope.coords.lng });
            parseFile.save().then(function() {

              var item = new Item();
              
              item.set("type","alert");
              item.set("createdBy",$rootScope.currentUser);
              item.set("picture",parseFile);
              item.set("office",$rootScope.office);
              item.set("name",$scope.newalert.name);
              item.set("description", $scope.newalert.description);
              item.set("alertLocation", alertlocation);
              item.save(null, {

                success:function(ob) {
                  ItemService.fetchAlerts(function(error,collection){
                   $rootScope.$apply(function () {
                      $rootScope.hideLoading();
                      $scope.newalert = {};
                      $scope.imageBase64 = null;
                      $rootScope.alert_collection = collection;
                      var alertPopup = $ionicPopup.alert({
                         title: 'New alert',
                         template: 'New alert created successfully'
                       });
                       alertPopup.then(function(res) {});
                    });
                  });
              }, 
                error:function(e) {
                  $rootScope.hideLoading();
                  alert("error");
                  console.log("Oh crap", e);
              }
            });
          }, function(error) {
            alert("Error");
            console.log(error);
          });
    }else{
        var alertPopup = $ionicPopup.alert({
           title: 'Access denied',
           template: 'Para crear una alerta necesitas iniciar sesion primero'
         });
         alertPopup.then(function(res) {});
    }  
  };
})








.controller('SettingsCtrl', function($scope){
  
})


.controller('InfoCtrl', function($scope){

});