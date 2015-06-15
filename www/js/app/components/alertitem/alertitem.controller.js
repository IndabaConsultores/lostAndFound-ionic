angular.module('lf')
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

});