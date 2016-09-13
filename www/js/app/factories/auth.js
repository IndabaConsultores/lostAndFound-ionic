angular.module("lf")
.factory("Auth", ["$firebaseAuth","constants",
	function($firebaseAuth,Constants) {
		//var ref = new Firebase(Constants.FIREBASEID);
		var ref = firebase.auth();
		return $firebaseAuth(ref);
	}
]);
