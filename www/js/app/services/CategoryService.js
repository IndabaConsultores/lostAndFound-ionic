'use strict';

angular.module('lf.services.category', [])
.service('CategoryService', function ($rootScope, $firebaseArray, constants) {

	var _ref;
	var _categories;
	
	this.loaded = function() {
		_ref = firebase.database().ref('categories');
		_categories = $firebaseArray(_ref.orderByChild('office')
			.equalTo(constants.OFFICE_ID));
		return _categories.$loaded();
	};

	this.getCategory = function(catId) {
		var catOrig = _categories.$getRecord(catId);
		var catCopy = JSON.parse(JSON.stringify(catOrig));
		return catCopy;
	};

	this.getCategories = function() {
		return _categories;
	};

});

