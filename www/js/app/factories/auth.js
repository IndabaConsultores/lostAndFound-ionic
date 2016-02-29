angular.module("lf")
.factory("Auth", ["$firebaseAuth","constants",
  function($firebaseAuth,Constants) {
    var ref = new Firebase(Constants.FIREBASEID);
    return $firebaseAuth(ref);
  }
]);