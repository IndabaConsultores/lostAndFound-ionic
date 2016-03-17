angular.module('lf')
.controller('SettingsCtrl', function($scope,$rootScope,$ionicHistory,$translate,$ionicModal,amMoment,CameraService){

    $scope.settings = {
      language : $rootScope.currentUser.language,
      alerts: $rootScope.currentUser.alerts
    };

    $scope.saveSettings = function(){
      $rootScope.showLoading();
      $ionicHistory.clearCache();
      $rootScope.currentUser.language = $scope.settings.language;
      $rootScope.currentUser.alerts = $scope.settings.alerts;
      
      if($scope.imageBase64){
          $rootScope.currentUser.avatar = $scope.imageBase64;
      }

      $rootScope.currentUser.$save().then(function(ref){
          $translate.use($scope.settings.language);
          amMoment.changeLocale($scope.settings.language);
          $rootScope.hideLoading();
      }, function(error){
           $rootScope.hideLoading();
            alert("error");
            console.log("Oh crap", e);
      });
    };

    $scope.showPopup = function() {
        $ionicModal.fromTemplateUrl('js/app/templates/use_camera.html', {
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
              $scope.imageBase64 = "data:image/jpeg;base64," + imageURI;
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
                $scope.imageBase64 = "data:image/jpeg;base64," + imageURI;
                $scope.modal.hide();
          }, function(err) {
              alert(err);
        });
    };

    $scope.$on('$destroy', function() {
      $scope.modal.remove();
    });
});