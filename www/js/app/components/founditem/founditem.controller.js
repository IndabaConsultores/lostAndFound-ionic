angular.module('lf')
.controller('FoundItemCtrl', function($scope,$stateParams,$rootScope,$ionicPopup,ItemService,OfficeService,$firebaseArray,$firebaseObject){

  $rootScope.showLoading();
  if($rootScope.founditems_collection){
      $scope.item = $rootScope.founditems_collection.$getRecord($stateParams.item);

      $scope.userRef = $firebaseObject($rootScope.ref.child('users').child($scope.item.createdBy));
      

/*
      var commentsRef = new Firebase("https://awesome.firebaseio-demo.com/comments");
      var linkRef = new Firebase("https://awesome.firebaseio-demo.com/links");
      var linkCommentsRef = linkRef.child(LINK_ID).child("comments");


      linkCommentsRef.on("child_added", function(snap) {
        commentsRef.child(snap.key()).once("value", function() {
          // Render the comment on the link page.
        ));
      });
*/

    
    if(!!$scope.item.alertLocation){

          $scope.map = L.map('alertmap',{ tap:true }).setView([$scope.item.alertLocation.latitude, $scope.item.alertLocation.longitude], 14);
          L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
            attribution: 'Lost & Found',
            maxZoom: 18
          }).addTo($scope.map);

          $scope.marker = L.marker([$scope.item.alertLocation.latitude, $scope.item.alertLocation.longitude]).addTo($scope.map);


    }



/*
      if($scope.item.get("alertLocation")){

          
      }
*/
  }
  

  OfficeService.getMessageCount($stateParams.item, function(error,data){
    $rootScope.hideLoading();
    $scope.messages = data;
  });

});