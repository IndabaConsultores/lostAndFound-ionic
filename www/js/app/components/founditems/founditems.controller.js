angular.module('lf')
.controller('FoundItemsCtrl', function($scope,$rootScope,ItemService,OfficeService){
  $scope.listSetUp = function(){

    if(!!$rootScope.founditems_collection && !!$rootScope.category_collection){
      var category_length = $rootScope.category_collection.length;
      $scope.bycategory = [];

      console.log($rootScope.category_collection);
      
      async.times(category_length, function(n, next){
          ItemService.foundItemsByCategory($rootScope.category_collection[n].$id,function(error,data){

              if(data.length > 0){
                  var block = {
                     'category': $rootScope.category_collection[n].name,
                     'items': data
                  }
                  console.log(block);
                  if(data.length > 0)
                    $scope.bycategory.push(block);
              }
              next(error,data);
          });
      }, function(err, items) {
          if(err)
            alert("error");
      });        
    }    
  }
  
  $scope.listSetUp();

/*
  $rootScope.$watch('founditems_collection', function(newValue, oldValue) {
      if(!!$rootScope.category_collection){
          $scope.listSetUp();
      } 
  });
*/

  $rootScope.$watch('category_collection', function(newValue, oldValue) {
      $scope.listSetUp();
  });

})