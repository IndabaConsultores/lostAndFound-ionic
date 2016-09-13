angular.module('lf')
.controller('OfficeMessageCtrl', function($scope,$rootScope,$ionicScrollDelegate,$stateParams,$ionicModal,OfficeService,CameraService){


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
      
	console.log('getMessages()', $stateParams.item);
      $rootScope.showLoading();
      OfficeService.getOfficeMessages($stateParams.item,function(error,data){
		console.log('Office messages', data);
          $rootScope.hideLoading();

          if(error)
            alert("error" + error.code);
          
          $scope.messages = data;
          $ionicScrollDelegate.scrollBottom(true);
      });
  }

  $scope.sendMessage = function(){

      if(!!$rootScope.currentUser){
          $rootScope.showLoading();

          OfficeService.postOfficeMessage($scope.msg.text,$stateParams.item,function(error,data){
            $scope.msg.text = "";
            $rootScope.hideLoading();
            if(error)
                alert("error" + error.code);
            
            $ionicScrollDelegate.scrollBottom(true);
          });
        }else{
          console.log("please, log in");
        }
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

  function resizeImage() {
      var thumb = CameraService.resizePicture(this, 64, 64);
      var file_name = Date.now();
      $rootScope.showLoading();
      OfficeService.postPictureOnMessage({"image":$scope.imageBase64,"thumb": thumb,"item_id":$stateParams.item}, function(error,data){
        $rootScope.hideLoading();
        if(error)
            alert("error" + error.code);
        $scope.getMessages();
        $ionicScrollDelegate.scrollBottom(true);
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
            var img = new Image;
                img.onload = resizeImage;
                img.src = $scope.imageBase64;
            $scope.modal.hide();
      }, function(err) {
          alert(err);
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
            var img = new Image;
                img.onload = resizeImage;
                img.src = $scope.imageBase64;
            $scope.modal.hide();
      }, function(err) {
          alert(err);
      });
  };

  $scope.getMessages();

  $scope.$on('$destroy', function() {
    $scope.modal.remove();
  });

});
