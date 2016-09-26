'use strict';

angular.module("lf")
.factory("Auth", ["$firebaseAuth","constants",
	function($firebaseAuth,Constants) {
		var ref = firebase.auth();
		return $firebaseAuth(ref);
	}
]);

