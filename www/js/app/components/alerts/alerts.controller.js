angular.module('lf')
.controller('AlertsCtrl', function($scope,$rootScope,ItemService){

  if($rootScope.alert_collection)
    $scope.items = $rootScope.alert_collection.models;

  $rootScope.$watch('alert_collection', function(newValue, oldValue) {
    $scope.items = newValue.models;
  });

  $scope.doRefresh = function(){
    ItemService.fetchAlerts(function(error,collection){
     $rootScope.$apply(function () {
        $rootScope.alert_collection = collection;
        //Stop the ion-refresher from spinning
        $scope.$broadcast('scroll.refreshComplete');
      });
    });
  }

  


})