angular.module('lf')
.controller('AlertItemCtrl', function($scope,$stateParams,$rootScope,$ionicPopup,ItemService,OfficeService,$firebaseObject){

    $rootScope.showLoading();
    ItemService.getAlert($stateParams.item,function(error,item){
        console.log(item);
        $scope.item = item;
        if(!!$scope.item.location){
            $scope.map = L.map('alertmap',{ tap:true }).setView([$scope.item.location.latitude, $scope.item.location.longitude], 14);
            L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
              attribution: 'Lost & Found',
              maxZoom: 18
            }).addTo($scope.map);

            $scope.marker = L.marker([$scope.item.location.latitude, $scope.item.location.longitude]).addTo($scope.map);
        }
        $rootScope.hideLoading();
    });


});