'use strict';

angular.module('lf')
.service('NotifyService', function() {
	var _notifications = {};
	var _count = 0;
	var _news = false;

	this.getNotifications = function() {
		return _notifications;
	};

	this.addNotification = function(notification) {
		_notifications[_count++] = notification;
		_news = false;
	};
	
	this.removeNotification = function(index) {
		delete _notifications[index];
	};
	
	this.clearNotifications = function() {
		_notifications = {};
		_news = false;
		return _notifications;
	};
	
	this.getNews = function() {
		return _news;
	};

});

