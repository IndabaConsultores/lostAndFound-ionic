angular.module('lf')
.controller('FoundItemsCtrl', function($scope,$rootScope,ItemService,OfficeService){
  

  ItemService.fetchFoundItems(function(error,categories){

      $scope.categories = categories;
      $scope.$apply();

  });
  


});
