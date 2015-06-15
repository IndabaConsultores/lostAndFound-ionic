angular.module('lf')
.controller('SettingsCtrl', function($scope,$rootScope,$translate,$ionicModal,amMoment,CameraService){

    $scope.settings = {
      language : $rootScope.currentUser.get("language"),
      alerts: $rootScope.currentUser.get("alerts")
    };

    $scope.saveSettings = function(){
      $rootScope.showLoading();
      $rootScope.currentUser.set("language",$scope.settings.language);
      $rootScope.currentUser.set("alerts", $scope.settings.alerts);
      if($scope.imageBase64){
          var file_name = Date.now(),
          parseFile = new Parse.File(file_name+".jpg", {base64:$scope.imageBase64});
          $rootScope.currentUser.set("avatar",parseFile);
      }
      $rootScope.currentUser.save(null, {
          success:function(ob) {
            $translate.use($scope.settings.language);
            amMoment.changeLocale($scope.settings.language);
            $rootScope.hideLoading();
          }, 
          error:function(e) {
            $rootScope.hideLoading();
            alert("error");
            console.log("Oh crap", e);
        }
      });
    };

    $scope.showPopup = function() {
        $ionicModal.fromTemplateUrl('templates/use_camera.html', {
          scope: $scope,
          animation: 'slide-in-up'
        }).then(function(modal) {
          $scope.modal = modal;
          $scope.modal.show();
        });
    };

    $scope.useCamera = function(){
      var options = {
        quality: 50,
        destinationType: navigator.camera.DestinationType.DATA_URL 
      };


      CameraService.getPicture(options)
        .then(function(imageURI) {
              $scope.imageBase64 = imageURI;
              $scope.modal.hide();
        }, function(err) {
            alert(err);
        });
    };

    $scope.usePicture = function(){
       var options = {
          quality: 50,
          destinationType: navigator.camera.DestinationType.DATA_URL,
          sourceType: navigator.camera.PictureSourceType.PHOTOLIBRARY
        };

        CameraService.getPicture(options)
          .then(function(imageURI) {
                $scope.imageBase64 = imageURI;
                $scope.modal.hide();
          }, function(err) {
              alert(err);
        });
    };

    $scope.$on('$destroy', function() {
      $scope.modal.remove();
    });
});