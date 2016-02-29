angular.module('lf')
.controller('AlertMessageCtrl', function($scope,$rootScope,$ionicScrollDelegate,$stateParams,$ionicModal,OfficeService,CameraService){


  $scope.showPopup = function() {
      $ionicModal.fromTemplateUrl('js/app/templates/use_camera.html', {
        scope: $scope,
        animation: 'slide-in-up'
      }).then(function(modal) {
        $scope.modal = modal;
        $scope.modal.show();
      });
  };

  

  $scope.getMessages = function(){
      
      $rootScope.showLoading();
      OfficeService.getAlertMessages($stateParams.item,function(error,data){
          $rootScope.hideLoading();

          if(error)
            alert("error" + error.code);
          
          $scope.messages = data;
          console.log($scope.messages.length);
          $ionicScrollDelegate.scrollBottom(true);
      });
  }

  $scope.sendMessage = function(){

      $rootScope.showLoading();

      OfficeService.postAlertMessage($scope.msg.text,$stateParams.item,function(error,firstMessage){
        $scope.msg.text = "";
        $rootScope.hideLoading();
        if(error)
            alert("error" + error.code);
        
        $ionicScrollDelegate.scrollBottom(true);
      });
  };

  $scope.showPicture = function(picSource){
      $scope.picSource = picSource;
      $ionicModal.fromTemplateUrl('js/app/templates/image_modal.html', {
        scope: $scope,
        animation: 'slide-in-up'
      }).then(function(modal) {
        $scope.modal = modal;
        $scope.modal.show();
      });
  };

  $scope.closeModal = function() {
      $scope.modal.hide();
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
            $rootScope.showLoading();
            var file_name = Date.now();
                //parseFile = new Parse.File(file_name+".jpg", {base64:$scope.imageBase64});
                OfficeService.postPictureOnAlertMessage($scope.imageBase64, $stateParams.item, function(error,data){
                  $rootScope.hideLoading();
                  if(error)
                      alert("error" + error.code);
                  //$scope.getMessages();
                  $ionicScrollDelegate.scrollBottom(true);
                });
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
            $rootScope.showLoading();
            var file_name = Date.now();
                //parseFile = new Parse.File(file_name+".jpg", {base64:$scope.imageBase64});
                OfficeService.postPictureOnAlertMessage($scope.imageBase64, $stateParams.item, function(error,data){
                  $rootScope.hideLoading();
                  if(error)
                      alert("error" + error.code);
                  //$scope.getMessages();
                  $ionicScrollDelegate.scrollBottom(true);
                });
        }, function(err) {
            alert(err);
      });
  };

  $scope.getMessages();

  $scope.$on('$destroy', function() {
    $scope.modal.remove();
  });

});