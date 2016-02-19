angular.module('lf')
.controller('AlertItemCtrl', function($scope,$stateParams,$rootScope,$ionicPopup,ItemService,OfficeService,$firebaseObject){

  $rootScope.showLoading();
  if($rootScope.alert_collection){
      //$scope.item = $rootScope.alert_collection.get($stateParams.item);

      $scope.item = $rootScope.alert_collection.$getRecord($stateParams.item);
      
      $scope.userRef = $firebaseObject($rootScope.ref.child('users').child($scope.item.createdBy));

      

      if(!!$scope.item.alertLocation){

          $scope.map = L.map('alertmap',{ tap:true }).setView([$scope.item.alertLocation.latitude, $scope.item.alertLocation.longitude], 14);
          L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
            attribution: 'Lost & Found',
            maxZoom: 18
          }).addTo($scope.map);

          $scope.marker = L.marker([$scope.item.alertLocation.latitude, $scope.item.alertLocation.longitude]).addTo($scope.map);

    }

  }

  OfficeService.getMessageCount($stateParams.item, function(error,data){
    $rootScope.hideLoading();
    $scope.messages = data;
  });

});