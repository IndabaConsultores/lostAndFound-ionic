angular.module('lf')
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